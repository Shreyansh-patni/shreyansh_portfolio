# Server Actions — Mutations

## What

Server Actions are async functions that run on the server and are invoked from forms or client code.
Use them for server-native mutations when that matches the repository architecture. They are not the only
valid mutation transport: an established browser API module or narrowly scoped same-origin Route Handler may
be the correct boundary for interactive clients. Every Server Action validates input; protected actions
also resolve the verified session. All actions use the shared server API client and revalidate cached data
when applicable.

### File location

Follow the repository's existing action location. A common convention is `src/actions/{domain}.ts`, one file
per domain. The `'use server'` directive at the top makes every exported function in that module a Server
Action.

### Return type — discriminated union

```typescript
// src/types/actions.ts
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };
```

Every Server Action returns `ActionResult<T>`. Callers check `result.success` to discriminate. `fieldErrors` maps Zod field-level errors to form inputs. Never throw from a Server Action — return the error shape instead.

### Zod validation

Validation schemas live in `src/lib/validations/{domain}.ts` (e.g., `src/lib/validations/cart.ts`). Import and validate inside the action before any mutation. Zod `safeParse` returns field-level errors that map directly to `fieldErrors`.

### Revalidation after mutation

Three APIs, each with different semantics. Call-site pattern only — see `references/caching-strategy.md` for the full decision tree.

| API | Semantics | When to use |
|-----|-----------|-------------|
| `updateTag(tag)` | Read-your-writes — user sees fresh data immediately | User-facing mutations: add to cart, update profile, submit form |
| `revalidateTag(tag, profile)` | SWR background refresh — stale served while revalidating | Background content: admin publishes article, inventory sync |
| `refresh()` | Refreshes uncached data only, no cache involvement | Data not using `'use cache'` that needs a fresh server render |

`updateTag` is the default choice. `revalidateTag` requires the `cacheLife` profile as 2nd arg (single-arg form deprecated in Next.js 16).

## How

### Complete Server Action — addToCartAction

```typescript
// src/actions/cart.ts — illustrative; adapt imports to the repository
'use server';
import { updateTag } from 'next/cache';
import { getServerSession } from '@/lib/auth/server-session';
import { addToCartItem } from '@/lib/api/cart-server';
import { addToCartSchema } from '@/lib/validations/cart';
import type { ActionResult } from '@/types/actions';
import type { CartItem } from '@/types/cart';

export async function addToCartAction(
  _prevState: ActionResult<CartItem> | null,
  formData: FormData,
): Promise<ActionResult<CartItem>> {
  // 1. Authenticate
  const session = await getServerSession();
  if (!session) return { success: false, error: 'auth.required' };

  // 2. Validate
  const parsed = addToCartSchema.safeParse({
    productId: formData.get('productId'),
    quantity: Number(formData.get('quantity')),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: 'validation_failed',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  // 3. Mutate via API client
  try {
    const item = await addToCartItem(parsed.data);
    // 4. Revalidate — user sees updated cart immediately
    updateTag('cart');
    return { success: true, data: item };
  } catch {
    return { success: false, error: 'cart.addFailed' };
  }
}
```

`_prevState` is required by `useActionState` (underscore signals unused). In a cookie-session project,
`getServerSession()` remains `React.cache()`-wrapped and `no-store`, and the shared server client forwards only
the required Cookie, configured first-party Origin, and locale. Error strings such as `'cart.addFailed'` are
translation keys that the form passes to `t()`. The backend policy remains the final authorization authority;
see `references/auth.md` and `references/security.md`.

### Zod validation schema

```typescript
// src/lib/validations/cart.ts
import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(99),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
```

### Complete form — useActionState + useFormStatus

```tsx
// src/app/[locale]/products/[slug]/_components/add-to-cart-form.tsx
'use client';
import { useActionState, useOptimistic } from 'react';
import { useTranslations } from 'next-intl';
import { addToCartAction } from '@/actions/cart';
import type { ActionResult } from '@/types/actions';
import type { CartItem } from '@/types/cart';

interface AddToCartFormProps {
  productId: string;
  productName: string;
  cartCount: number;
}

function AddToCartForm({ productId, productName, cartCount }: AddToCartFormProps) {
  const t = useTranslations('products');
  const [optimisticCount, addOptimistic] = useOptimistic(
    cartCount,
    (current, _increment: number) => current + _increment,
  );
  const [state, formAction, isPending] = useActionState<
    ActionResult<CartItem> | null, FormData
  >(async (prevState, formData) => {
    addOptimistic(1);
    return addToCartAction(prevState, formData);
  }, null);

  return (
    <form action={formAction}>
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="quantity" value="1" />
      <SubmitButton isPending={isPending} productName={productName} />
      <p className="mt-2 text-sm text-muted-foreground">
        {t('cart.itemCount', { count: optimisticCount })}
      </p>
      {state && !state.success && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {t(state.error)}
        </p>
      )}
    </form>
  );
}
export { AddToCartForm };
```

```tsx
// src/app/[locale]/products/[slug]/_components/submit-button.tsx — MUST be a child of <form>
'use client';
import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

function SubmitButton({ isPending, productName }: { isPending: boolean; productName: string }) {
  const t = useTranslations('products');
  const { pending } = useFormStatus();
  const isDisabled = isPending || pending;
  return (
    <Button type="submit" disabled={isDisabled}
      aria-label={t('cart.addAriaLabel', { product: productName })}>
      {isDisabled ? t('cart.adding') : t('cart.add')}
    </Button>
  );
}
export { SubmitButton };
```

**Progressive enhancement:** `<form action={formAction}>` works without JS — standard POST, action runs, page re-renders. JS enhances with optimistic updates and pending UI.

**`useActionState`** returns `[state, formAction, isPending]`. The `formAction` goes on `<form action>`. **`useFormStatus`** must be in a **child** of `<form>` — that is why `SubmitButton` is extracted. **`useOptimistic`** resets automatically when the action completes and the server re-renders. Error strings are translation keys — `t(state.error)`. `role="alert"` announces to screen readers (see `references/accessibility.md`). All visible strings use `t()`.

## When

### Choosing the revalidation API

```
Mutation succeeded → data cached with 'use cache' + cacheTag?
├─ YES, user must see change now  →  updateTag('tag-name')
├─ YES, background refresh OK     →  revalidateTag('tag-name', 'hours')
└─ NO, data is not cached         →  refresh()
```

### useActionState vs useTransition for calling actions

| Scenario | Use |
|----------|-----|
| HTML form with inputs, progressive enhancement needed | `useActionState` — manages form state, works without JS |
| Button click, no form inputs | `useTransition` + direct action call — simpler API |
| Form with optimistic updates | `useActionState` + `useOptimistic` — full form lifecycle |

### When to split action files

| Condition | Action |
|-----------|--------|
| File exceeds ~150 lines | Split by sub-domain: `cart-items.ts`, `cart-coupons.ts` |
| Action needs different authorization | Separate file — makes auth boundaries visible |
| Single domain, few actions | One file: `src/actions/cart.ts` |

## Never

### Missing validation or authorization

```typescript
// WRONG — trusting client input, no auth
export async function deletePostAction(postId: string) {
  await deletePost(postId);
}

// RIGHT — validate, authenticate, authorize (IDOR check), then mutate
const session = await getServerSession();
if (!session) return { success: false, error: 'auth.required' };
const parsed = z.string().uuid().safeParse(formData.get('postId'));
if (!parsed.success) return { success: false, error: 'validation_failed' };
await deletePost(parsed.data); // the backend policy authorizes this session and resource
updateTag('posts');
return { success: true, data: undefined };
```

Server Actions are public HTTP endpoints: callers can POST directly. Validate with the repository's schema
tool, resolve the verified session, and require the backend to authorize the operation against the resource.
Never substitute an inbound workspace or role header for the session. See `references/security.md`.

### Throwing errors instead of returning

```typescript
// WRONG — .parse() throws, breaking the discriminated union contract
const data = updateProfileSchema.parse(formData);

// RIGHT — .safeParse() returns, map to ActionResult
const parsed = updateProfileSchema.safeParse(/* ... */);
if (!parsed.success) {
  return { success: false, error: 'validation_failed', fieldErrors: ... };
}
```

Use `safeParse`, not `parse`. Wrap API calls in try/catch and return `{ success: false, error: 'key' }` — never let exceptions escape.

### Other anti-patterns

- **No `useFormStatus` in the form component itself** — it reads the **parent** `<form>`, so it must be in a child component. Calling it in the same component that renders `<form>` always returns `{ pending: false }`.
- **No `revalidateTag(tag)` with one argument** — deprecated in Next.js 16. Always pass the `cacheLife` profile as the second argument: `revalidateTag('products', 'hours')`.
- **No ad hoc fetch in actions** — call the shared server domain module, which uses
  `src/lib/api/client.ts`. See `references/api-client-pattern.md`.
- **No `redirect()` inside try/catch** — `redirect()` throws internally. Calling it inside a `catch` block will swallow the redirect. Call `redirect()` after the try/catch.
- **No `'use server'` on individual functions** — put it at the file top. One directive covers all exports and keeps actions co-located by domain.
- **No hardcoded error messages** — return translation keys (`'cart.addFailed'`). The form component calls `t(key)` to display the translated message.
- **No relying on a layout redirect as action authorization** — an action is a separate entry point. Resolve
  the verified session again and let the backend policy make the final resource decision. See
  `references/auth.md`.
