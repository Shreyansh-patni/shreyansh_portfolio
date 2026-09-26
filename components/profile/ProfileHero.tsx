import Image from "next/image";
import { profile as defaultProfile, type Profile } from "@/content/profile";

interface ProfileHeroProps {
  profile?: Profile;
}

export function ProfileHero({ profile = defaultProfile }: ProfileHeroProps) {
  return (
    <section className="mb-12" data-purpose="hero-section">
      {/* Banner Header Container */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-black mb-3 border border-border/80 shadow-lg">
        <div className="w-full h-44 sm:h-52 relative overflow-hidden bg-black">
          <Image
            src={profile.banner}
            alt={`${profile.name}'s cover banner`}
            fill
            sizes="(max-width: 640px) 100vw, 620px"
            priority
            className="object-cover filter grayscale contrast-125"
          />

        </div>
      </div>

      {/* Profile Info Area with Overlapping Avatar */}
      <div className="px-1.5 relative">
        <div className="flex justify-between items-end -mt-14 sm:-mt-16 mb-3">
          {/* Circular Profile Avatar */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-background bg-surface overflow-hidden shadow-xl ring-1 ring-border shrink-0">
            <Image
              src={profile.avatar}
              alt={profile.name}
              fill
              sizes="(max-width: 640px) 80px, 96px"
              priority
              className="object-cover"
            />
          </div>
        </div>

        {/* Name & Verified Check */}
        <div className="flex items-center gap-1.5 mb-0.5">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            {profile.name}
          </h1>
          {profile.verified && (
            <span
              className="inline-flex items-center"
              title="Verified Profile"
              aria-label="Verified Profile"
            >
              <svg
                className="w-4 h-4 text-blue-500 fill-current shrink-0"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.79-4-4-4-.495 0-.965.084-1.4.238C14.55 2.475 13.18 1.6 11.6 1.6c-1.58 0-2.95.875-3.6 2.148-.435-.154-.905-.238-1.4-.238-2.21 0-4 1.79-4 4 0 .495.084.965.238 1.4C1.575 10.45.7 11.82.7 13.4c0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.79 4 4 4 .495 0 .965-.084 1.4-.238 1.4.873 2.77 1.748 4.35 1.748 1.58 0 2.95-.875 3.6-2.148.435.154.905.238 1.4.238 2.21 0 4-1.79 4-4 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6zm-12.71 4.29l-4.29-4.29 1.41-1.41 2.88 2.88 6.88-6.88 1.41 1.41-8.29 8.29z" />
              </svg>
            </span>
          )}
        </div>

        {/* Handle */}
        <div className="text-[13px] font-sans text-muted-foreground mb-3">
          {profile.handle}
        </div>

        {/* Bio */}
        <p className="text-[14px] leading-relaxed text-foreground/90 mb-3 font-normal">
          {profile.shortBio}
        </p>

        {/* Metadata: Location & Joined Date */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-muted-foreground">
          {profile.location && (
            <div className="flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5 text-muted-foreground/70 fill-none stroke-current"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M12 21s-6-5.686-6-10A6 6 0 0 1 18 11c0 4.314-6 10-6 10z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="11" r="2" />
              </svg>
              <span>{profile.location}</span>
            </div>
          )}
          {profile.joinedDate && (
            <div className="flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5 text-muted-foreground/70 fill-none stroke-current"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              <span>Joined {profile.joinedDate}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
