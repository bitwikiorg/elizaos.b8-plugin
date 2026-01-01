/**
 * WHY: To enforce strict data contracts for Bithub synaptic transmissions.
 * WHAT: Zod schemas and TypeScript types for messages, topics, and posts.
 * HOW: Uses Zod for runtime validation and type inference.
 */

import { z } from 'zod';

export const SendPrivateMessageSchema = z.object({
    recipients: z.array(z.string()).min(1),
    title: z.string().min(1),
    raw: z.string().min(1),
});

export type SendPrivateMessage = z.infer<typeof SendPrivateMessageSchema>;

export const ReplyToPostSchema = z.object({
    topic_id: z.number().int(),
    raw: z.string().min(1),
    reply_to_post_number: z.number().int().optional(),
});

export type ReplyToPost = z.infer<typeof ReplyToPostSchema>;

export const TopicSchema = z.object({
    id: z.number(),
    title: z.string(),
    post_stream: z.object({
        posts: z.array(z.any())
    }).optional()
});

export const PostSchema = z.object({
    id: z.number(),
    topic_id: z.number(),
    raw: z.string()
});
