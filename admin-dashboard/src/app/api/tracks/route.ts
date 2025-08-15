import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// create a new track
export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Token is required" },
        { status: 400 }
      );
    }
    const formData = await req.formData();

    const response = await fetch(`${process.env.API_URL}tracks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Token is required" },
        { status: 400 }
      );
    }
    const { searchParams } = new URL(req.url);
    const trackId = searchParams.get("trackId");

    if (trackId) {
      // Fetch single track by ID
      const response = await fetch(`${process.env.API_URL}tracks/${trackId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      return NextResponse.json(data, { status: response.status });
    } else {
      // fetch all tracks
      const response = await fetch(`${process.env.API_URL}tracks`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      return NextResponse.json(data, { status: response.status });
    }
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Token is required" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);
    const trackId = searchParams.get("trackId");
    console.log("trackId:", trackId);

    if (!trackId) {
      return NextResponse.json(
        { message: "trackId is required" },
        { status: 400 }
      );
    }

    const formData = await req.formData();

    const response = await fetch(`${process.env.API_URL}tracks/${trackId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Token is required" },
        { status: 400 }
      );
    }
    const { searchParams } = new URL(req.url);
    const trackId = searchParams.get("trackId");

    const response = await fetch(`${process.env.API_URL}tracks/${trackId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    console.log(result);
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
