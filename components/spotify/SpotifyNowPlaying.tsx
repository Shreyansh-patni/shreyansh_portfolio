"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import type { SpotifyNowPlayingData } from "@/lib/spotify";

function formatMs(ms: number): string {
  if (!ms || isNaN(ms) || ms < 0) return "0:00";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function formatPlayedAt(playedAt?: string): string {
  if (!playedAt) return "";
  const date = new Date(playedAt);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday) {
    return `Played at ${timeStr}`;
  }

  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  return `Played ${dateStr} at ${timeStr}`;
}

export function SpotifyNowPlaying() {
  const [data, setData] = useState<SpotifyNowPlayingData>({ status: "idle" });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [progressMs, setProgressMs] = useState<number>(0);
  
  const lastFetchedAtRef = useRef<number>(Date.now());
  const trackIdRef = useRef<string>("");

  const fetchNowPlaying = useCallback(async () => {
    try {
      const res = await fetch("/api/spotify/now-playing", {
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const json: SpotifyNowPlayingData = await res.json();
      setData(json);
      setIsLoading(false);
      lastFetchedAtRef.current = Date.now();

      if (json.status === "playing" || json.status === "paused") {
        if (json.track.progressMs !== undefined) {
          setProgressMs(json.track.progressMs);
        }
        trackIdRef.current = `${json.track.title}-${json.track.artist}`;
      }
    } catch (err) {
      console.error("Failed to fetch live Spotify state:", err);
      setIsLoading(false);
    }
  }, []);

  // Initial fetch and setup event listeners for tab focus / visibility
  useEffect(() => {
    fetchNowPlaying();

    const handleFocus = () => {
      fetchNowPlaying();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchNowPlaying();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchNowPlaying]);

  // Polling interval logic: 4s when playing, 10s otherwise
  useEffect(() => {
    const isPlaying = data.status === "playing";
    const pollIntervalMs = isPlaying ? 4000 : 10000;

    const intervalId = setInterval(() => {
      fetchNowPlaying();
    }, pollIntervalMs);

    return () => clearInterval(intervalId);
  }, [data.status, fetchNowPlaying]);

  // Real-time track position tick (every 1 second when active)
  useEffect(() => {
    if (data.status !== "playing") return;

    const tickId = setInterval(() => {
      setProgressMs((prevMs) => {
        const duration = data.track.durationMs || 0;
        const nextMs = prevMs + 1000;
        if (duration > 0 && nextMs >= duration) {
          // Song finished, re-fetch immediately
          fetchNowPlaying();
          return duration;
        }
        return nextMs;
      });
    }, 1000);

    return () => clearInterval(tickId);
  }, [data, fetchNowPlaying]);

  const durationMs =
    (data.status === "playing" || data.status === "paused") && data.track.durationMs
      ? data.track.durationMs
      : 0;

  const progressPercent =
    durationMs > 0 ? Math.min(100, Math.max(0, (progressMs / durationMs) * 100)) : 0;

  return (
    <section className="mb-14" data-purpose="spotify-now-playing-section">
      <div className="flex items-center justify-between gap-2 mb-6">
        <div className="text-[11px] font-mono tracking-widest uppercase text-muted-foreground font-medium flex items-center gap-2">
          <span>WHAT I&apos;M LISTENING TO</span>
          {data.status === "playing" && (
            <div className="flex items-end gap-[2px] h-3 w-3.5 pb-0.5">
              <span className="w-[2.5px] bg-emerald-500 rounded-full animate-[bounce_1s_infinite_100ms] h-full" />
              <span className="w-[2.5px] bg-emerald-500 rounded-full animate-[bounce_1s_infinite_300ms] h-3/4" />
              <span className="w-[2.5px] bg-emerald-500 rounded-full animate-[bounce_1s_infinite_200ms] h-1/2" />
            </div>
          )}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-surface/40 border border-border/60 transition-all duration-300">
        {isLoading && data.status === "idle" ? (
          <div className="flex items-center gap-3 py-1">
            <div className="w-10 h-10 rounded-lg bg-surface border border-border/50 animate-pulse shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3 w-28 bg-surface border border-border/40 rounded animate-pulse" />
              <div className="h-2.5 w-40 bg-surface border border-border/40 rounded animate-pulse" />
            </div>
          </div>
        ) : data.status === "unconfigured" ? (
          <div className="text-[13px] text-muted-foreground font-medium py-1">
            Spotify isn&apos;t connected yet.
          </div>
        ) : data.status === "error" ? (
          <div className="text-[13px] text-muted-foreground font-medium py-1">
            Spotify is temporarily unavailable.
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
            <div>
              <div className="text-[13px] text-muted-foreground font-medium">
                Not listening right now
              </div>
              <div className="text-[12px] text-muted-foreground/70">
                Spotify is connected, but nothing is currently playing.
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                {data.track.albumImageUrl ? (
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-border/40 bg-surface shadow-sm group">
                    <Image
                      src={data.track.albumImageUrl}
                      alt={`${data.track.album || data.track.title} album cover`}
                      fill
                      sizes="56px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
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
                    ) : data.status === "recent" ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground font-medium">
                        <span className="h-2 w-2 rounded-full bg-muted-foreground/50"></span>
                        Last played
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground font-medium">
                        <span className="h-2 w-2 rounded-full bg-amber-500/80"></span>
                        Paused
                      </span>
                    )}
                  </div>

                  <a
                    href={data.track.songUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block font-medium text-[14px] text-foreground hover:underline truncate transition-colors"
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

                  {data.status === "recent" && data.track.playedAt && (
                    <div className="text-[12px] text-muted-foreground/70 font-mono mt-0.5">
                      {formatPlayedAt(data.track.playedAt)}
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

            {/* Real-time playback progress bar for playing / paused state */}
            {(data.status === "playing" || data.status === "paused") && durationMs > 0 && (
              <div className="pt-2 border-t border-border/30">
                <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground/80 mb-1.5">
                  <span>{formatMs(progressMs)}</span>
                  <span>{formatMs(durationMs)}</span>
                </div>
                <div className="h-1.5 w-full bg-surface border border-border/40 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ease-linear ${
                      data.status === "playing"
                        ? "bg-emerald-500"
                        : "bg-muted-foreground/60"
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
