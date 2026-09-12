import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.API_URL 

export async function POST(request: NextRequest) {
  try {
    // 1. (Optional) Read the cookie if you still need to notify FastAPI
    const token = request.cookies.get("access_token")?.value;
    
    if (token) {
      await fetch(`${BACKEND_URL}/auth/logout`, {
        method: "POST",
        headers: { Cookie: `access_token=${token}` },
      }).catch(console.error); 
    }

    // 2. Create the response object first
    const response = NextResponse.json(
      { details: "Logged out successfully" }, 
      { status: 200 }
    );

    response.cookies.delete("access_token");
    request.cookies.delete("access_token");
    


    return response;
    
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}