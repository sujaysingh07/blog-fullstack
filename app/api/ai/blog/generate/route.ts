import { type NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.API_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cookie = request.headers.get("cookie");

    const backendResponse = await fetch(`${BACKEND_URL}/ai/blog/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie ?? "",
      },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error("AI Blog Generate BFF error:", error);
    return NextResponse.json(
      { detail: "Something went wrong" },
      { status: 500 }
    );
  }
}
