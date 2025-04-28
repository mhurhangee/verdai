import { toast } from 'sonner'
import { ZodSchema } from 'zod'

/**
 * Parses input using a Zod schema on the client. Shows toast error if invalid.
 * Returns { success, data, error }.
 */
export function parseClientIO<T>(schema: ZodSchema<T>, data: unknown) {
  const result = schema.safeParse(data)
  if (!result.success) {
    const msg = result.error.errors[0]?.message || 'Invalid input'
    toast.error(msg)
    return { success: false, error: msg, data: undefined }
  }
  return { success: true, error: null, data: result.data }
}
