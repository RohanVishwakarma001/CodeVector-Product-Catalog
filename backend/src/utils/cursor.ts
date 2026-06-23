import { z } from 'zod';

const CursorPayloadSchema = z.object({
  updatedAt: z.string().datetime(),
  id: z.string().uuid(),
});

export type CursorPayload = z.infer<typeof CursorPayloadSchema>;

export function encodeCursor(payload: CursorPayload): string {
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

export function decodeCursor(cursor: string): CursorPayload {
  try {
    const json = Buffer.from(cursor, 'base64url').toString('utf-8');
    return CursorPayloadSchema.parse(JSON.parse(json));
  } catch {
    throw new Error('Invalid cursor');
  }
}
