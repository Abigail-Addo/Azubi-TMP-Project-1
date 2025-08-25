import { NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    // const token = (await cookies()).get("token")?.value;

    // if (!token) {
    //   return NextResponse.json(
    //     { message: "Token is required" },
    //     { status: 400 }
    //   );
    // }
    const { searchParams } = new URL(req.url);
    const trackId = searchParams.get("trackId");

    if (trackId) {
      // Fetch single track by ID
      const response = await fetch(`${process.env.API_URL}tracks/${trackId}`, {
        headers: {
          "Content-Type": "application/json",
          //   Authorization: `Bearer ${token}`,
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
          //   Authorization: `Bearer ${token}`,
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
