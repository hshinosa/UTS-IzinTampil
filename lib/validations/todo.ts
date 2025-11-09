import { z } from "zod"

export const TodoSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().optional(),
  completed: z.boolean().optional(),
})

export const UpdateTodoSchema = TodoSchema.partial()

export type TodoInput = z.infer<typeof TodoSchema>
export type UpdateTodoInput = z.infer<typeof UpdateTodoSchema>

export const TodoResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  completed: z.boolean(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
})

export type TodoResponse = z.infer<typeof TodoResponseSchema>
