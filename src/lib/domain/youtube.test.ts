import { describe, expect, it } from "vitest";
import { parseYouTubeVideoLink } from "./youtube";

describe("YouTube video links", () => {
  it("accepts standard watch links", () => {
    expect(parseYouTubeVideoLink("https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=abc")).toMatchObject({
      videoId: "dQw4w9WgXcQ",
      canonicalUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      embedUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    });
  });

  it("accepts short, embed, shorts and live links", () => {
    expect(parseYouTubeVideoLink("https://youtu.be/dQw4w9WgXcQ")?.videoId).toBe("dQw4w9WgXcQ");
    expect(parseYouTubeVideoLink("https://youtube.com/embed/dQw4w9WgXcQ")?.videoId).toBe("dQw4w9WgXcQ");
    expect(parseYouTubeVideoLink("https://youtube.com/shorts/dQw4w9WgXcQ")?.videoId).toBe("dQw4w9WgXcQ");
    expect(parseYouTubeVideoLink("https://youtube.com/live/dQw4w9WgXcQ")?.videoId).toBe("dQw4w9WgXcQ");
  });

  it("rejects non-video and non-YouTube URLs", () => {
    expect(parseYouTubeVideoLink("https://youtube.com/playlist?list=abc")).toBeNull();
    expect(parseYouTubeVideoLink("https://example.com/watch?v=dQw4w9WgXcQ")).toBeNull();
    expect(parseYouTubeVideoLink("not a url")).toBeNull();
  });
});
