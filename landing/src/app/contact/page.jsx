

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Parse the incoming JSON body
    const body = await request.json();
    const { name, email, subject, message, consent } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields. Please provide name, email, and message.' 
        },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // Log the submission (in production, you'd send to a service like Resend, SendGrid, etc.)
    console.log(`[CONTACT_FORM] New submission from ${name} (${email})`);
    console.log(`Subject: ${subject || 'General Inquiry'}`);
    console.log(`Message: ${message.substring(0, 200)}${message.length > 200 ? '...' : ''}`);
    console.log(`Consent given: ${consent ? 'Yes' : 'No'}`);

    // === EXAMPLE: Send email using a service like Resend ===
    // Uncomment and configure if using Resend:
    /*
    import { Resend } from 'resend';
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
      from: 'Paraline Contact <noreply@paraline.io>',
      to: ['support@paraline.io'],
      replyTo: email,
      subject: `[Paraline Contact] ${subject || 'New inquiry'} from ${name}`,
      html: `
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        ${consent ? '<p><em>User agreed to follow-up communication.</em></p>' : ''}
      `,
    });
    */

    // === EXAMPLE: Store in database (if using Prisma, etc.) ===
    /*
    import { prisma } from '@/lib/prisma';
    await prisma.contactSubmission.create({
      data: {
        name,
        email,
        subject: subject || 'General Inquiry',
        message,
        consent: consent || false,
        createdAt: new Date(),
      },
    });
    */

    // === Example: Send to Discord webhook ===
    // Uncomment and configure if using webhook:
    /*
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `📬 **New Contact Form Submission**\n**From:** ${name} (${email})\n**Subject:** ${subject || 'General'}\n**Message:** ${message.substring(0, 400)}`,
        }),
      });
    }
    */

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully! Our team will get back to you within 24-48 hours.',
      timestamp: new Date().toISOString(),
    }, { status: 200 });

  } catch (error) {
    console.error('[CONTACT_API_ERROR]', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'An internal server error occurred. Please try again later or contact us directly at support@paraline.io.' 
      },
      { status: 500 }
    );
  }
}

// Optional: Handle GET requests for testing or to return API info
export async function GET() {
  return NextResponse.json({
    name: 'Paraline Contact API',
    version: '1.0.0',
    description: 'Endpoint for contact form submissions',
    methods: ['POST'],
    status: 'operational',
  }, { status: 200 });
}