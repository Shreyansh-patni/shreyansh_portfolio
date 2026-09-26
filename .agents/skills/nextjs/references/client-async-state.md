# Client Async State — Entity Safety, Ordering, Polling and Autosave

Use this reference for interactive Client Components and hooks that poll, paginate, autosave, react
to route/entity changes, or combine REST with realtime events. Browser data access is allowed through
the approved domain modules in `api-client-pattern.md`; the hard requirement is that stale work can
never mutate the wrong active entity.

## Request identity invariant

Every async operation captures the entity and request generation when it starts. Before applying a
response or error, confirm that the same entity is still active and the generation is still current.

```typescript
const generationRef = useRef(0);

useEffect(() => {
  generationRef.current += 1;
  const generation = generationRef.current;
  const requestedThreadId = threadId;
  const controller = new AbortController();

  void loadThread(requestedThreadId, controller.signal).then((response) => {
    if (controller.signal.aborted) return;
    if (generation !== generationRef.current) return;
    if (requestedThreadId !== activeThreadIdRef.current) return;
    setThread(response);
  }).catch((error: unknown) => {
    if (controller.signal.aborted) return;
    if (generation !== generationRef.current) return;
    setLoadError(toVisibleError(error));
  });

  return () => controller.abort();
}, [threadId]);
```

Abort obsolete work on route, workspace, thread, campaign, flow, or other entity changes. Abort is
not sufficient by itself: a promise may already have completed, a library may ignore the signal, or
multiple operations may share a controller. Use a monotonically increasing generation counter when
stale completion is still possible.

## Merging polling, realtime and pagination

Use functional state updates whenever the next state depends on current state:

```typescript
setMessages((current) => mergeMessagesById(current, incoming));
setPages((current) => appendPageWithoutDuplicates(current, page));
```

Never rebuild state from a render closure captured before a poll, load-more request, or Reverb event
completed. Define deterministic merge rules for IDs, ordering, deletion/tombstones, and newer
versions. Keep cursor/page metadata associated with the filter and entity that produced it.

Preserve active filters, date ranges, search terms, and sort order on refresh and retry. A retry must
reissue the same query the failed request represented unless the user has deliberately changed it.

## Shared stores and route changes

Namespace shared client stores by the route entity ID, or reset the owned slice synchronously when
that ID changes. A store holding thread A, workspace A, or flow A must not briefly expose it as the
state for B while B loads.

Derived request keys should include every input that changes the result: entity ID, workspace,
filters, date range, cursor, relevant version, and mutation idempotency key where applicable. Do not
use a global `isLoading` or error flag for multiple independent entities.

A mutation started for entity A must not clear input, stop loading, refresh detail, or show an error
for entity B after the user switches. Optimistic updates retain enough entity-scoped information to
roll back only the affected record; never restore an entire current view from a stale snapshot.

## Autosave

Autosave payloads bind to the entity ID and revision captured when scheduled. Before sending and
before applying success/failure, verify both still belong to the active editor.

```typescript
const save = async (snapshot: DraftSnapshot) => {
  const { flowId, revision, body } = snapshot;
  const result = await saveFlow(flowId, body);
  if (flowId !== activeFlowIdRef.current) return;
  if (revision !== latestRevisionRef.current) return;
  markSaved(result.version);
};
```

Changing from entity A to B cancels or invalidates A's pending debounce, request, success callback,
and retry. Never read the current editor state at send time while retaining an older entity ID, and
never write B's state to A because a debounced closure mixed old and new values.

## Pending, timeout and retry states

A timeout or exhausted poll is a visible terminal state, not an indefinitely pending spinner. Show
what timed out, retain the user's context, and provide an accessible retry action. Retrying creates a
new generation and invalidates the old one.

Do not turn a timeout into silent success or clear an earlier error because an unrelated request
completed. Track status per operation/entity.

Prefer the repository's same-route refresh mechanism (commonly `router.refresh()`) when server data
must be refreshed. Do not invent a synthetic query parameter that drops active filters or becomes a
no-op on the second click. Define the exact settled resource identity—including version or price ID
when a slug is not unique enough—before declaring polling complete.

## Required tests with deferred promises

Use controllable deferred promises to force completion out of order:

```typescript
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

it('does not apply thread A after the route switches to thread B', async () => {
  const a = deferred<Thread>();
  const b = deferred<Thread>();
  mockLoadThread.mockImplementation((id) => id === 'a' ? a.promise : b.promise);

  const view = render(<Inbox threadId="a" />);
  view.rerender(<Inbox threadId="b" />);
  b.resolve(threadB);
  await screen.findByText('Thread B');
  a.resolve(threadA);
  await waitFor(() => expect(screen.queryByText('Thread A')).not.toBeInTheDocument());
});
```

Cover at least:

- old entity finishes after the new entity;
- a poll finishes after load-more and both merge without loss/duplicates;
- a stale error cannot replace the active entity's success state;
- a mutation or optimistic rollback for A cannot clear or replace B's input/state;
- changing filters while a request is active does not restore old results or old cursors;
- autosave A cannot send or acknowledge B's state;
- unmount/route change aborts obsolete work;
- timeout renders a retry and retry starts a fresh generation.

## Never

- No response application without checking its captured entity/request identity.
- No stale render-closure merge for polling, realtime, pagination, or autosave.
- No abort check only on the failure path; guard successful completion too.
- No entity-A mutation completion or rollback applied to the entity-B view.
- No shared store reused across route entities without namespacing or reset.
- No retry that silently drops active filters or date ranges.
- No timeout state that remains falsely pending forever.
- No synthetic refresh that drops active URL state or becomes idempotently inert.
- No race test that resolves promises only in request order; force the failure order explicitly.
