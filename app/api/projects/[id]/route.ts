import { db } from '@/lib/db/drizzle'
import { userProjects } from '@/lib/db/schema'
import { createErrorResponse, HTTP_STATUS, ApiError } from '@/lib/api-error'
import { ProjectPatchSchema } from '@/types/project'
import { getUserId } from '@/lib/get-user-id'
import { eq, and } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { parseIO } from '@/lib/parse-io'

export const runtime = 'edge'

// Get a single project by id for the authenticated user
export async function GET({ params }: { params: Promise<{ id: string }> }) {
  try {
    // Auth user or throw error
    const userId = await getUserId()
    const id = (await params).id

    // Get project by id and user
    const project = await db.query.userProjects.findFirst({
      where: (p, { eq, and }) => and(eq(p.projectId, id), eq(p.userId, userId))
    })

    if (!project) {
      throw new ApiError('Project not found or access denied', HTTP_STATUS.NOT_FOUND)
    }

    // Return success response and project
    return NextResponse.json({ project, success: true })
  } catch (err) {
    // Handle errors and return error response
    return createErrorResponse('Failed to get project', HTTP_STATUS.INTERNAL_SERVER_ERROR, err)
  }
}

// Update a project by id for the authenticated user
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Auth user or throw error
    const userId = await getUserId()
    const id = (await params).id

    // Parse request body or throw error
    const { projectName, description } = parseIO(ProjectPatchSchema, await req.json())

    // Build update data
    const updateData = { ...Object.fromEntries(Object.entries({ projectName, description }).filter(([_, v]) => v !== undefined)), updatedAt: new Date() }

    // Update project
    const updated = await db
      .update(userProjects)
      .set(updateData)
      .where(and(eq(userProjects.projectId, id), eq(userProjects.userId, userId)))
      .returning()

    // Return success response and updated project
    const project = updated[0]

    return NextResponse.json({ project, success: true })
  } catch (err) {
    // Handle errors and return error response
    return createErrorResponse('Failed to update project', HTTP_STATUS.INTERNAL_SERVER_ERROR, err)
  }
}

// Delete a project by id for the authenticated user
export async function DELETE({ params }: { params: Promise<{ id: string }> }) {
  try {
    // Auth user or throw error
    const userId = await getUserId()
    const id = (await params).id

    // Delete project
    const result = await db.delete(userProjects)
      .where(and(eq(userProjects.projectId, id), eq(userProjects.userId, userId)))
      .returning()

    if (result.length === 0) {
      throw new ApiError('Project not found', HTTP_STATUS.NOT_FOUND)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    // Handle errors and return error response
    return createErrorResponse('Failed to delete project', HTTP_STATUS.INTERNAL_SERVER_ERROR, err)
  }
}