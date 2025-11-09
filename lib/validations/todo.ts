import { z } from "zod"

export const TodoSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().optional(),
  completed: z.boolean().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
})

export const UpdateTodoSchema = TodoSchema.partial()

export type TodoInput = z.infer<typeof TodoSchema>
export type UpdateTodoInput = z.infer<typeof UpdateTodoSchema>

export const TodoResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  completed: z.boolean(),
  priority: z.string(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
})

export type TodoResponse = z.infer<typeof TodoResponseSchema>

export const TodosQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "all"]).default("all"),
  status: z.enum(["completed", "pending", "all"]).default("all"),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
})

export type TodosQuery = z.infer<typeof TodosQuerySchema>

export const PaginatedTodosResponseSchema = z.object({
  data: z.array(TodoResponseSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    pages: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }),
})

export type PaginatedTodosResponse = z.infer<typeof PaginatedTodosResponseSchema>
