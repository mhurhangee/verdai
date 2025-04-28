import { auth } from '@clerk/nextjs/server'
import { ApiError, HTTP_STATUS } from '@/lib/api-error'

// Get user ID or throw error
export async function getUserId() {
  const { userId } = await auth()
  if (!userId) throw new ApiError('Unauthorized', HTTP_STATUS.UNAUTHORIZED)
  return userId
}