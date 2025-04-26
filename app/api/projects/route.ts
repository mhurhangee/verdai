import { db } from '@/lib/db/drizzle'
import { userProjects } from '@/lib/db/schema'
import { createErrorResponse, HTTP_STATUS } from '@/lib/api-error'
import { genId } from '@/lib/id'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { getUserId } from '@/lib/get-user-id'
import { ProjectPostSchema } from '@/types/project'
import { parseIO } from '@/lib/parse-io'

export const runtime = 'edge'

// Get all projects for the authenticated user
export async function GET() {
  try {
    // Auth user or throw error
    const userId = await getUserId()

    // Get projects for user
    const projects = await db.select().from(userProjects).where(eq(userProjects.userId, userId))

    // Return success response and projects
    return NextResponse.json({ projects, success: true })
  } catch (err) {
    // Handle errors and return error response
    return createErrorResponse('Internal server error', HTTP_STATUS.INTERNAL_SERVER_ERROR, err)
  }
}

// Create a new project for the authenticated user
export async function POST(req: NextRequest) {
  try {
    // Auth user or throw error
    const userId = await getUserId()

    // Parse request body or throw error
    const { projectName, description } = parseIO(ProjectPostSchema, await req.json())

    // Create new project
    const [project] = await db
      .insert(userProjects)
      .values({ userId, projectId: genId(), projectName, description })
      .returning()

    // Return success response and project
    return NextResponse.json({ project, success: true })
  } catch (err) {
    // Handle errors and return error response
    return createErrorResponse('Failed to create project', HTTP_STATUS.INTERNAL_SERVER_ERROR, err)
  }
}
