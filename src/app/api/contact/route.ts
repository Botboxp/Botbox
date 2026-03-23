import { NextResponse } from 'next/server'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function POST(req: Request) {
  try {
    const { name, email, company, projectType, message, website } = await req.json()

    if (website) {
      return NextResponse.json({ success: true })
    }

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const safeName = escapeHtml(name)
    const safeEmail = escapeHtml(email)
    const safeCompany = escapeHtml(company || 'N/A')
    const safeType = escapeHtml(projectType)
    const safeMessage = escapeHtml(message || 'No message provided.')

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Botbox Website <noreply@botboxp.com>',
        to: 'info@botboxp.com',
        subject: `New Project Inquiry - ${safeType}`,
        reply_to: email,
        html: `
          <h2>New Project Inquiry</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Company:</strong> ${safeCompany}</p>
          <p><strong>Project Type:</strong> ${safeType}</p>
          <p><strong>Message:</strong></p>
          <p>${safeMessage}</p>
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
