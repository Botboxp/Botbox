import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { name, email, company, projectType, message, website } = await req.json()

    if (website) {
      return NextResponse.json({ success: true })
    }

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Botbox Website <noreply@botboxp.com>',
        to: 'info@botboxp.com',
        subject: `New Project Inquiry - ${projectType}`,
        reply_to: email,
        html: `
          <h2>New Project Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company || 'N/A'}</p>
          <p><strong>Project Type:</strong> ${projectType}</p>
          <p><strong>Message:</strong></p>
          <p>${message || 'No message provided.'}</p>
        `,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      return NextResponse.json({ error: data.message || 'Failed to send' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
