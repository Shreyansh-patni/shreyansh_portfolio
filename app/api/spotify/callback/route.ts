import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const storedState = request.cookies.get("spotify_auth_state")?.value;

  if (error) {
    return NextResponse.json(
      { error: "Authorization was denied or failed." },
      { status: 400 }
    );
  }

  if (!state || (storedState && state !== storedState)) {
    return NextResponse.json(
      { error: "Invalid or mismatched state parameter." },
      { status: 400 }
    );
  }

  if (!code) {
    return NextResponse.json(
      { error: "Missing code parameter." },
      { status: 400 }
    );
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "Spotify credentials are not configured on the server." },
      { status: 500 }
    );
  }

  const redirectUri =
    process.env.SPOTIFY_REDIRECT_URI ||
    `${request.nextUrl.origin}/api/spotify/callback`;
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to exchange authorization code for tokens." },
        { status: 400 }
      );
    }

    const data = await response.json();

    const res = NextResponse.json({
      message:
        "Authorization successful! Copy your refresh_token into your SPOTIFY_REFRESH_TOKEN environment variable.",
      refresh_token: data.refresh_token,
    });

    res.cookies.delete("spotify_auth_state");

    return res;
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred during token exchange." },
      { status: 500 }
    );
  }
}
