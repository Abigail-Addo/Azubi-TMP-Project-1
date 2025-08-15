import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// CREATE a new invoice
export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Token is required" },
        { status: 400 }
      );
    }

    const invoiceData = await req.json();
    console.log(invoiceData);
    const response = await fetch(`${process.env.API_URL}invoices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(invoiceData),
    });

    const data = await response.json();
    console.log(data);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// GET invoice(s)
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
    const invoiceId = searchParams.get("invoiceId");

    if (invoiceId) {
      // Fetch single invoice by ID
      const response = await fetch(
        `${process.env.API_URL}invoices/${invoiceId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      return NextResponse.json(data, { status: response.status });
    } else {
      // fetch all invoices
      const response = await fetch(`${process.env.API_URL}invoices`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      const data = await response.json();
      console.log(data);
      if (!response.ok) throw new Error(data.message);

      return NextResponse.json(data, { status: response.status });
    }
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

// UPDATE an invoice
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
    const invoiceId = searchParams.get("invoiceId");

    if (!invoiceId) {
      return NextResponse.json(
        { message: "invoiceId is required" },
        { status: 400 }
      );
    }

    const invoiceData = await req.json();

    const response = await fetch(
      `${process.env.API_URL}invoices/${invoiceId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(invoiceData),
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// DELETE an invoice
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
    const invoiceId = searchParams.get("invoiceId");

    if (!invoiceId) {
      return NextResponse.json(
        { message: "invoiceId is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${process.env.API_URL}invoices/${invoiceId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
