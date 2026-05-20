import { NextResponse } from "next/server";

export function GET(): NextResponse {
  const content = process.env.ADS_TXT_CONTENT ?? "";
  return new NextResponse(content, {
    headers: { "Content-Type": "text/plain" },
  });
}
