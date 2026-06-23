import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields.",
        },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("[CONTACT_API] DISCORD_WEBHOOK_URL is not defined in environment variables.");
      return NextResponse.json(
        {
          success: false,
          error: "Backend contact configuration error. Please check environment variables.",
        },
        { status: 500 }
      );
    }

    // Format rich embed for Discord (Cyan color theme matching Paraline branding)
    const discordPayload = {
      embeds: [
        {
          title: "📬 New Contact Form Submission",
          color: 58879, // #00e5ff in decimal
          timestamp: new Date().toISOString(),
          fields: [
            {
              name: "Name",
              value: name,
              inline: true,
            },
            {
              name: "Email",
              value: email,
              inline: true,
            },
            {
              name: "Subject",
              value: subject || "N/A",
              inline: false,
            },
            {
              name: "Message",
              value: message,
              inline: false,
            },
          ],
          footer: {
            text: "Paraline Contact Bot",
          },
        },
      ],
    };

    const discordResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(discordPayload),
    });

    if (!discordResponse.ok) {
      const errorText = await discordResponse.text();
      console.error("[CONTACT_API] Discord API response error:", errorText);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to dispatch message to notification endpoint.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Message received and dispatched successfully.",
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