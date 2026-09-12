import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.API_URL;

export async function GET(
  request: NextRequest,
  // Update the type to reflect that params is a Promise
  { params }: { params: Promise<{ id: string }> } 
) {
  // AWAIT the params object before accessing properties
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const backendResponse = await fetch(`${BACKEND_URL}/blogs/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });   

  const data = await backendResponse.json();

  return NextResponse.json(data, { status: backendResponse.status });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Next.js 15+ async params
) {
  try {
    // 1. Resolve the dynamic ID from the URL
    const resolvedParams = await params;
    const id = resolvedParams.id;

    // 2. Extract the request body sent from the frontend
    const body = await request.json();


    // 4. Forward the PUT request to FastAPI
    const backendResponse = await fetch(`${BACKEND_URL}/blogs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // Forward the cookie so FastAPI can authenticate the user
      },
      body: JSON.stringify(body),
    });

    // 5. Parse and return the FastAPI response
    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
    
  } catch (error) {
    console.error("Next.js Proxy Error:", error);
    return NextResponse.json(
      { detail: "Internal Server Error" },
      { status: 500 }
    );
  }
}



export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    // 1. Extract auth cookie (Required for protected backend routes)
    // const cookieStore = cookies();
    // const token = cookieStore.get("access_token")?.value;

    // 2. Forward the DELETE request to FastAPI
    const backendResponse = await fetch(`${BACKEND_URL}/blogs/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // ...(token && { Cookie: `access_token=${token}` }),
      },
    });

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });

  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json(
      { detail: "Internal Server Error" },
      { status: 500 }
    );
  }
}