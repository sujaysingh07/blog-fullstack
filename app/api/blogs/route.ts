import { NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";

const BACKEND_URL = process.env.API_URL

export async function GET(request: NextRequest) {
  try {
    // const cookieStore = cookies();
    // const token = cookieStore.get("access_token")?.value;

    // 1. Extract pagination params from the incoming frontend request
    const searchParams = request.nextUrl.searchParams;
    const skip = searchParams.get("skip") || "0";
    const limit = searchParams.get("limit") || "10";
    const search = searchParams.get("search") || "";


    // 2. Append them to the FastAPI request
    const backendResponse = await fetch(
      `${BACKEND_URL}/blogs?skip=${skip}&limit=${limit}&search=${search}`, 
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // ...(token && { Cookie: `access_token=${token}` }),
        },
      }
    );

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error("Error fetching all blogs:", error);
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}



export async function POST(request: NextRequest) {
  try {
    // 1. Extract the JSON payload sent from your React Query mutation
    const body = await request.json();
    // 2. Extract the auth cookie to prove the user is logged in
    // const cookieStore = cookies();
    // const token = cookieStore.get("access_token")?.value;

    // 3. Forward the POST request to your FastAPI backend
    const backendResponse = await fetch(`${BACKEND_URL}/blogs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Forward the cookie so FastAPI can authenticate the user
        // ...(token && { Cookie: `access_token=${token}` }),
      },
      // Send the body exactly as received from the frontend
      body: JSON.stringify(body),
    });

    // 4. Parse the FastAPI response
    const data = await backendResponse.json();

    // 5. Return the response and the exact status code (e.g., 201 Created or 400 Bad Request)
    return NextResponse.json(data, { status: backendResponse.status });
    
  } catch (error) {
    console.error("Create Blog Error:", error);
    return NextResponse.json(
      { detail: "Internal Server Error" },
      { status: 500 }
    );
  }
}