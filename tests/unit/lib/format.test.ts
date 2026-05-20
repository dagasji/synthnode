import { describe, it, expect } from "vitest";
import { formatDate, formatViews, relativeTime } from "@/lib/format";

describe("formatDate", () => {
  it("formats an ISO date string to Spanish locale format", () => {
    // Given a known ISO date
    const iso = "2026-05-12T08:00:00Z";
    // When formatted
    const result = formatDate(iso);
    // Then it contains the year and is a non-empty string
    expect(result).toContain("2026");
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns a string for any valid ISO date", () => {
    expect(typeof formatDate("2020-01-01T00:00:00Z")).toBe("string");
  });
});

describe("formatViews", () => {
  it("formats numbers >= 1000 with k suffix", () => {
    expect(formatViews(1000)).toBe("1.0k");
    expect(formatViews(8420)).toBe("8.4k");
    expect(formatViews(1500)).toBe("1.5k");
  });

  it("returns plain string for numbers < 1000", () => {
    expect(formatViews(999)).toBe("999");
    expect(formatViews(0)).toBe("0");
  });
});

describe("relativeTime", () => {
  it("returns a non-empty string for any ISO date", () => {
    const result = relativeTime("2026-01-01T00:00:00Z");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns formatted date for dates older than 30 days", () => {
    const oldDate = new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString();
    const result = relativeTime(oldDate);
    // Should fall back to formatDate — contains a year
    expect(result).toMatch(/\d{4}/);
  });
});
