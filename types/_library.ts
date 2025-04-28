import { z } from 'zod';

export const LIBRARY_ITEM_TYPES = [
    'answer',
    'file'
] as const;

export type LibraryItemType = typeof LIBRARY_ITEM_TYPES[number];

export const BaseLibraryItemSchema = z.object({
    id: z.string().length(12),
    userId: z.string().max(255),
    projectId: z.string().length(12).optional(),
    title: z.string().max(255),
    description: z.string().max(512).optional(),
    metadata: z.record(z.any()).optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

const AnswerContentSchema = z.object({
    question: z.string(),
    answer: z.string(),
    citations: z.array(z.any()).optional(),
});

const FileContentSchema = z.object({
    fileName: z.string(),
    fileSize: z.number(),
    fileUrl: z.string(),
});

export const LibraryItemSchema = z.discriminatedUnion('type', [
    z.object({
        type: z.literal('answer'),
        content: AnswerContentSchema,
        ...BaseLibraryItemSchema.shape,
    }),
    z.object({
        type: z.literal('file'),
        content: FileContentSchema,
        ...BaseLibraryItemSchema.shape,
    }),
]);

export type LibraryItem = z.infer<typeof LibraryItemSchema>;


