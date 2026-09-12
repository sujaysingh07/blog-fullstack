// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.API_URL ;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const backendResponse = await fetch(`${BACKEND_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();

    return NextResponse.json(data, { status: backendResponse.status });
    
  } catch (error) {
    console.error("Registration Proxy Error:", error);
    return NextResponse.json(
      { detail: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}