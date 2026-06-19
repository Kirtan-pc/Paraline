import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Protect against oversized payloads by checking content-length header
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > 100 * 1024) { // 100KB limit
      return NextResponse.json(
        {
          success: false,
          error: "Payload too large. Maximum size is 100KB.",
        },
        { status: 413 }
      );
    }

    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate presence of required fields first
    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, email, and message are required and cannot be empty.",
        },
        { status: 400 }
      );
    }

    // Validate that inputs are strings
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string" ||
      (subject !== undefined && typeof subject !== "string")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input types. Fields must be strings.",
        },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();
    const trimmedSubject = subject ? subject.trim() : "";

    // Validate trimmed fields are not empty
    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, email, and message are required and cannot be empty.",
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email format.",
        },
        { status: 400 }
      );
    }

    // Validate reasonable maximum character lengths
    if (trimmedName.length > 100) {
      return NextResponse.json(
        {
          success: false,
          error: "Name cannot exceed 100 characters.",
        },
        { status: 400 }
      );
    }

    if (trimmedEmail.length > 256) {
      return NextResponse.json(
        {
          success: false,
          error: "Email cannot exceed 256 characters.",
        },
        { status: 400 }
      );
    }

    if (trimmedSubject.length > 200) {
      return NextResponse.json(
        {
          success: false,
          error: "Subject cannot exceed 200 characters.",
        },
        { status: 400 }
      );
    }

    if (trimmedMessage.length > 5000) {
      return NextResponse.json(
        {
          success: false,
          error: "Message cannot exceed 5000 characters.",
        },
        { status: 400 }
      );
    }

    console.info("[CONTACT_FORM] submission received", {
      hasSubject: Boolean(trimmedSubject),
      messageLength: trimmedMessage.length,
    });

    return NextResponse.json({
      success: true,
      message: "Message received successfully.",
    });
  } catch (error) {
    console.error("[CONTACT_API_ERROR]", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "Contact API Working",
  });
}