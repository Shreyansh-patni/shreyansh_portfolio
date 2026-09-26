import React from "react";
import Image from "next/image";
import { getNowPlaying } from "@/lib/spotify";

export async function SpotifyNowPlaying() {
  const data = await getNowPlaying();

  return (
    <section className="mb-14" data-purpose="spotify-now-playing-section">
      <div className="flex items-center justify-between gap-2 mb-6">
        <div className="text-[11px] font-mono tracking-widest uppercase text-muted-foreground font-medium">
          WHAT I&apos;M LISTENING TO
        </div>
      </div>

      <div className="p-4 rounded-xl bg-surface/40 border border-border/60">
        {data.status === "unconfigured" || data.status === "error" ? (
          <div className="text-[13px] text-muted-foreground font-medium py-1">
            Spotify isn&apos;t connected yet.
          </div>
        ) : data.status === "idle" ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-surface border border-border/50 flex items-center justify-center text-muted-foreground shrink-0">
              <svg
                className="w-5 h-5 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
            <div className="text-[13px] text-muted-foreground font-medium">
              Not playing right now
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              {data.track.albumImageUrl ? (
                <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-border/40 bg-surface">
                  <Image
                    src={data.track.albumImageUrl}
                    alt={`${data.track.album || data.track.title} album cover`}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-lg bg-surface border border-border/40 flex items-center justify-center text-muted-foreground shrink-0">
                  <svg
                    className="w-6 h-6 fill-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                  </svg>
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {data.status === "playing" ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-500 font-medium">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      Listening now
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground font-medium">
                      <span className="h-2 w-2 rounded-full bg-muted-foreground/50"></span>
                      Paused
                    </span>
                  )}
                </div>

                <a
                  href={data.track.songUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-medium text-[14px] text-foreground hover:underline truncate"
                >
                  {data.track.title}
                </a>

                <div className="text-[13px] text-muted-foreground truncate">
                  {data.track.artist}
                </div>

                {data.track.album && (
                  <div className="text-[12px] text-muted-foreground/70 truncate">
                    {data.track.album}
                  </div>
                )}
              </div>
            </div>

            <div className="shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40 flex items-center justify-end">
              <a
                href={data.track.songUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Listen to ${data.track.title} on Spotify`}
                className="group inline-flex items-center gap-1.5 text-[12px] font-mono text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>Open in Spotify</span>
                <svg
                  className="w-3.5 h-3.5 text-muted-foreground/70 stroke-current fill-none group-hover:text-foreground transition-colors"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M7 17L17 7M17 7H7M17 7V17"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
