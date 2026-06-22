const YOUTUBE_VIDEO_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

export type YouTubeVideoLink = {
  videoId: string;
  canonicalUrl: string;
  embedUrl: string;
};

export function parseYouTubeVideoLink(input: string): YouTubeVideoLink | null {
  const raw = input.trim();
  if (!raw) return null;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  const hostname = normalizedHostname(url.hostname);
  const videoId = extractYouTubeVideoId(url, hostname);
  if (!videoId || !YOUTUBE_VIDEO_ID_PATTERN.test(videoId)) return null;

  return {
    videoId,
    canonicalUrl: `https://www.youtube.com/watch?v=${videoId}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
  };
}

function normalizedHostname(hostname: string) {
  return hostname.toLowerCase().replace(/^www\./, "").replace(/^m\./, "");
}

function extractYouTubeVideoId(url: URL, hostname: string) {
  if (hostname === "youtu.be") {
    return firstPathSegment(url);
  }

  if (hostname !== "youtube.com" && hostname !== "youtube-nocookie.com") {
    return null;
  }

  if (url.pathname === "/watch") {
    return url.searchParams.get("v");
  }

  const [kind, videoId] = url.pathname.split("/").filter(Boolean);
  if (kind === "embed" || kind === "shorts" || kind === "live") {
    return videoId ?? null;
  }

  return null;
}

function firstPathSegment(url: URL) {
  return url.pathname.split("/").filter(Boolean)[0] ?? null;
}
