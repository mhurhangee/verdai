import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/db/drizzle'
import { feedback } from '@/lib/db/schema'
import { sendFeedbackEmail } from '@/lib/feedback-email'
import { ApiError, HTTP_STATUS, createErrorResponse, genId, getUserId } from '@/lib/utils'

import { FeedbackSchema } from '@/types/feedback'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = FeedbackSchema.safeParse(body)
    if (!parsed.success) {
      return createErrorResponse('Invalid input', HTTP_STATUS.BAD_REQUEST)
    }
    const userId = await getUserId()
    const { message, page } = parsed.data
    // Save to DB
    await db.insert(feedback).values({
      id: genId(),
      message,
      page,
      userId,
      createdAt: new Date(),
    })
    // Send email (ignore error, not critical)
    try {
      await sendFeedbackEmail({ feedback: message, page, userId })
    } catch (err) {
      console.error('📧 Error sending feedback email:', err)
      // Optionally log
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof ApiError) {
      return createErrorResponse(err.message, err.status)
    }
    return createErrorResponse('Internal server error', HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }
}
