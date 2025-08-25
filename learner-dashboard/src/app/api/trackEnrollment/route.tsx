// app/api/track-enrollment/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { track, amount, paystackCallbackUrl } = body;

        if (!track || !paystackCallbackUrl) {
            return NextResponse.json(
                { error: "track and paystackCallbackUrl are required" },
                { status: 400 }
            );
        }

        // Here you can save the enrollment data to your database if needed
        // For now, we just return the payload back
        return NextResponse.json({
            message: "Enrollment request received",
            enrollment: {
                track,
                amount: amount ?? null,
                paystackCallbackUrl,
            },
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
