import { NextResponse } from "next/server";

export async function GET() {
  const backendUrl = process.env.PYTHON_BACKEND_URL || "http://localhost:8000";
  
  try {
    const response = await fetch(`${backendUrl}/api/v1/snapshots/fleet`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("BFF Fleet Route Error:", error);
    return NextResponse.json({ error: "Failed to fetch fleet data" }, { status: 500 });
  }
}
