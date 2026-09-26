export interface SpotifyTrack {
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
  isPlaying: boolean;
  progressMs?: number;
  durationMs?: number;
  playedAt?: string;
}

export type SpotifyNowPlayingData =
  | { status: "playing"; track: SpotifyTrack }
  | { status: "paused"; track: SpotifyTrack }
  | { status: "recent"; track: SpotifyTrack }
  | { status: "idle" }
  | { status: "unconfigured" }
  | { status: "error" };

const SPOTIFY_TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const SPOTIFY_CURRENTLY_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";
const SPOTIFY_RECENTLY_PLAYED_ENDPOINT =
  "https://api.spotify.com/v1/me/player/recently-played?limit=1";
const REVALIDATE_SECONDS = 30;
const TIMEOUT_MS = 5000;

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
}

interface SpotifyArtist {
  name: string;
}

interface SpotifyImage {
  url: string;
  height?: number;
  width?: number;
}

interface SpotifyAlbum {
  name: string;
  images: SpotifyImage[];
}

interface SpotifyItem {
  name: string;
  artists?: SpotifyArtist[];
  album?: SpotifyAlbum;
  external_urls?: {
    spotify?: string;
  };
  duration_ms?: number;
}

interface SpotifyCurrentlyPlayingResponse {
  is_playing: boolean;
  progress_ms?: number;
  currently_playing_type?: string;
  item?: SpotifyItem | null;
}

interface SpotifyRecentlyPlayedItem {
  track: SpotifyItem;
  played_at: string;
}

interface SpotifyRecentlyPlayedResponse {
  items?: SpotifyRecentlyPlayedItem[];
}

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(
        `Spotify token refresh failed with HTTP ${response.status}`
      );
      return null;
    }

    const data: SpotifyTokenResponse = await response.json();
    return data.access_token || null;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error(
      "Spotify token request failed:",
      error instanceof Error ? error.message : "Network error"
    );
    return null;
  }
}

export async function getNowPlaying(): Promise<SpotifyNowPlayingData> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return { status: "unconfigured" };
  }

  const accessToken = await getAccessToken();

  if (!accessToken) {
    return { status: "error" };
  }

  // 1. Try currently-playing endpoint
  let currentlyPlayingOk = false;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(SPOTIFY_CURRENTLY_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      signal: controller.signal,
      next: { revalidate: REVALIDATE_SECONDS },
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      currentlyPlayingOk = true;
      if (response.status !== 204 && response.status !== 202) {
        const json: SpotifyCurrentlyPlayingResponse = await response.json();

        if (json && json.item) {
          const item = json.item;
          const title = item.name || "Unknown Track";
          const artist = item.artists
            ? item.artists.map((a) => a.name).join(", ")
            : "Unknown Artist";
          const album = item.album?.name || "";
          const albumImageUrl = item.album?.images?.[0]?.url || "";
          const songUrl = item.external_urls?.spotify || "#";
          const isPlaying = Boolean(json.is_playing);

          const track: SpotifyTrack = {
            title,
            artist,
            album,
            albumImageUrl,
            songUrl,
            isPlaying,
            progressMs:
              typeof json.progress_ms === "number"
                ? json.progress_ms
                : undefined,
            durationMs:
              typeof item.duration_ms === "number"
                ? item.duration_ms
                : undefined,
          };

          return {
            status: isPlaying ? "playing" : "paused",
            track,
          };
        }
      }
    }
  } catch (error) {
    console.error(
      "Spotify currently-playing request failed:",
      error instanceof Error ? error.message : "Error"
    );
  }

  // 2. If nothing currently playing or 204, try recently-played endpoint
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const recentResponse = await fetch(SPOTIFY_RECENTLY_PLAYED_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      signal: controller.signal,
      next: { revalidate: REVALIDATE_SECONDS },
    });

    clearTimeout(timeoutId);

    if (recentResponse.ok) {
      const recentJson: SpotifyRecentlyPlayedResponse =
        await recentResponse.json();

      if (recentJson && recentJson.items && recentJson.items.length > 0) {
        const recentEntry = recentJson.items[0];
        const item = recentEntry.track;
        const title = item.name || "Unknown Track";
        const artist = item.artists
          ? item.artists.map((a) => a.name).join(", ")
          : "Unknown Artist";
        const album = item.album?.name || "";
        const albumImageUrl = item.album?.images?.[0]?.url || "";
        const songUrl = item.external_urls?.spotify || "#";

        const track: SpotifyTrack = {
          title,
          artist,
          album,
          albumImageUrl,
          songUrl,
          isPlaying: false,
          playedAt: recentEntry.played_at,
        };

        return {
          status: "recent",
          track,
        };
      }

      // Spotify API is connected and returned 200, but user has no recently played history
      return { status: "idle" };
    }
  } catch (error) {
    console.error(
      "Spotify recently-played request failed:",
      error instanceof Error ? error.message : "Error"
    );
  }

  // If currently-playing API succeeded with 204 (no active playback) but recently-played couldn't find items
  if (currentlyPlayingOk) {
    return { status: "idle" };
  }

  return { status: "error" };
}
