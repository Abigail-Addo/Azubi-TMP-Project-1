import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// sign up
export async function POST(req: NextRequest) {
  try {
    const { type, adminData } = await req.json();

    if (type === "signUp") {
      try {
        const response = await fetch(
          `${process.env.API_URL}auth/signup/admin`,
          {
            method: "POST",
            headers: {
              "Content-Type": "Application/json",
            },
            body: JSON.stringify(adminData),
          }
        );

        const data = await response.json();

        (await cookies()).set("token", data.token, {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
        });
        return NextResponse.json(data, { status: response.status });
      } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
      }
    }

    if (type === "login") {
      try {
        const response = await fetch(`${process.env.API_URL}auth/login/`, {
          method: "POST",
          headers: {
            "Content-Type": "Application/json",
          },
          body: JSON.stringify(adminData),
        });
        console.log(response);
        const data = await response.json();

        (await cookies()).set("token", data.token, {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
        });
        console.log(data);
        return NextResponse.json(data, { status: response.status });
      } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
      }
    }

    if (type === "forgotPassword") {
      try {
        const response = await fetch(
          `${process.env.API_URL}auth/forgot-password`,
          {
            method: "POST",
            headers: {
              "Content-Type": "Application/json",
            },
            body: JSON.stringify(adminData),
          }
        );
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
      } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
      }
    }

    if (type === "resetPassword") {
      try {
        const token = req.nextUrl.searchParams.get("token");

        const response = await fetch(
          `${process.env.API_URL}auth/reset-password/${token}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "Application/json",
            },
            body: JSON.stringify(adminData),
          }
        );
        const data = await response.json();

        return NextResponse.json(data, { status: response.status });
      } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
      }
    }

    if (type === "otpVerification") {
      try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        const response = await fetch(
          `${process.env.API_URL}auth/verify-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "Application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(adminData),
          }
        );
        const data = await response.json();

        return NextResponse.json(data, { status: response.status });
      } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
      }
    }

    if (type === "resendOtp") {
      try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const response = await fetch(
          `${process.env.API_URL}auth/resend-token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "Application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
      } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
      }
    }

    if (type === "logout") {
      const cookieStore = cookies();
      const token = (await cookieStore).get("token")?.value;

      if (!token) {
        return NextResponse.json(
          { message: "No token found" },
          { status: 401 }
        );
      }

      const response = await fetch(`${process.env.API_URL}auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      const res = NextResponse.json(data, { status: response.status });
      res.cookies.delete("token");

      return res;
    }

    if (type === "updateProfile") {
      try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        // Read the multipart/form-data from the request
        const formData = await req.formData();

        const response = await fetch(`${process.env.API_URL}auth/update`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        console.log(response);
        const data = await response.json();
        console.log(data);
        return NextResponse.json(data, { status: response.status });
      } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
      }
    }

    return NextResponse.json(
      { message: "Invalid type provided" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

// logout
