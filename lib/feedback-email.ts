import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendFeedbackEmail({
  feedback,
  page,
  userId,
}: {
  feedback: string
  page?: string
  userId?: string | null
}) {
  if (!process.env.FEEDBACK_EMAIL_TO) {
    throw new Error('FEEDBACK_EMAIL_TO env var not set')
  }
  if (!process.env.FEEDBACK_EMAIL_FROM) {
    throw new Error('FEEDBACK_EMAIL_FROM env var not set')
  }
  const subject = 'New User Feedback'
  const text = `Feedback: ${feedback}\nPage: ${page || 'unknown'}\nUserId: ${userId || 'anonymous'}`
  await resend.emails.send({
    from: process.env.FEEDBACK_EMAIL_FROM,
    to: process.env.FEEDBACK_EMAIL_TO,
    subject,
    text,
  })
}
