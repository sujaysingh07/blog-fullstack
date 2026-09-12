import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.API_URL;

export async function GET(request: NextRequest) {
  const cookie = request.headers.get("cookie");
  console.log(request)
  const backendResponse = await fetch(
    `${BACKEND_URL}/auth/me`,
    {
      method: "GET",
      headers: {
        Cookie: cookie ?? "",
      },
    }
  );

  const data = await backendResponse.json();

  return NextResponse.json(
    data,
    { status: backendResponse.status }
  );
}