import { z } from "zod";

export const CreateTaskInputSchema = z
  .object({
    _id: z.string().trim().optional(),
    title: z.string().trim(),
    description: z.string().trim().optional(),
    dueDate: z.iso.datetime().optional(),
    priority: z
      .enum(["low", "medium", "high", "critical"])
      .default("low")
      .optional(),
    position: z.number().optional(),
    listId: z.string().trim(),
  })
  .strict();

export type CreateTaskInputType = z.infer<typeof CreateTaskInputSchema>;

const CreateTaskOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  task: z
    .object({
      id: z.string(),
      title: z.string(),
      listId: z.string(),
      description: z.string(),
      dueDate: z.iso.datetime(),
      priority: z.enum(["low", "medium", "high", "critical"]),
      position: z.number(),
    })
    .optional(),
});

export type CreateTaskOutputType = z.infer<typeof CreateTaskOutputSchema>;

export const UpdateTaskInputSchema = z
  .object({
    title: z.string().min(2, "Minimum of two characters required").optional(),
    description: z
      .string()
      .max(512, "Maximum of 512 characters allowed")
      .optional(),
    dueDate: z.iso.datetime().optional(),
    priority: z.enum(["low", "medium", "high", "critical"]).optional(),
    position: z.number().optional(),
    listId: z.string().nonempty().optional(),
  })
  .strict();

export type UpdateTaskInputType = z.infer<typeof UpdateTaskInputSchema>;

const DeleteTaskOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  task: z
    .object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      dueDate: z.string(),
      priority: z.string(),
      position: z.number(),
      listId: z.string(),
    })
    .optional(),
});

export type DeleteTaskOutputType = z.infer<typeof DeleteTaskOutputSchema>;

const UpdateTaskOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  task: z
    .object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      dueDate: z.iso.datetime(),
      priority: z.enum(["low", "medium", "high", "critical"]),
      position: z.number(),
      listId: z.string(),
    })
    .optional(),
});

export type UpdateTaskOutputType = z.infer<typeof UpdateTaskOutputSchema>;

export const TaskSchema = z.object({
  _id: z.string(),
  title: z.string().min(2, "Minimum of two characters required"),
    description: z
      .string()
      .max(512, "Maximum of 512 characters allowed"),
    dueDate: z.iso.datetime(),
    priority: z.enum(["low", "medium", "high", "critical"]),
    position: z.number(),
    listId: z.string().nonempty()
})

export type TaskType = z.infer<typeof TaskSchema>
