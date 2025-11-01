import { z } from "zod";
export declare const CreateTaskInputSchema: z.ZodObject<{
    _id: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    dueDate: z.ZodOptional<z.ZodISODateTime>;
    priority: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        high: "high";
        low: "low";
        medium: "medium";
        critical: "critical";
    }>>>;
    position: z.ZodOptional<z.ZodNumber>;
    listId: z.ZodString;
}, z.core.$strict>;
export type CreateTaskInputType = z.infer<typeof CreateTaskInputSchema>;
declare const CreateTaskOutputSchema: z.ZodObject<{
    success: z.ZodBoolean;
    message: z.ZodString;
    task: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        listId: z.ZodString;
        description: z.ZodString;
        dueDate: z.ZodISODateTime;
        priority: z.ZodEnum<{
            high: "high";
            low: "low";
            medium: "medium";
            critical: "critical";
        }>;
        position: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type CreateTaskOutputType = z.infer<typeof CreateTaskOutputSchema>;
export declare const UpdateTaskInputSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    dueDate: z.ZodOptional<z.ZodISODateTime>;
    priority: z.ZodOptional<z.ZodEnum<{
        high: "high";
        low: "low";
        medium: "medium";
        critical: "critical";
    }>>;
    position: z.ZodOptional<z.ZodNumber>;
    listId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export type UpdateTaskInputType = z.infer<typeof UpdateTaskInputSchema>;
declare const DeleteTaskOutputSchema: z.ZodObject<{
    success: z.ZodBoolean;
    message: z.ZodString;
    task: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        description: z.ZodString;
        dueDate: z.ZodString;
        priority: z.ZodString;
        position: z.ZodNumber;
        listId: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type DeleteTaskOutputType = z.infer<typeof DeleteTaskOutputSchema>;
declare const UpdateTaskOutputSchema: z.ZodObject<{
    success: z.ZodBoolean;
    message: z.ZodString;
    task: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        description: z.ZodString;
        dueDate: z.ZodISODateTime;
        priority: z.ZodEnum<{
            high: "high";
            low: "low";
            medium: "medium";
            critical: "critical";
        }>;
        position: z.ZodNumber;
        listId: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type UpdateTaskOutputType = z.infer<typeof UpdateTaskOutputSchema>;
export declare const TaskSchema: z.ZodObject<{
    _id: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    dueDate: z.ZodISODateTime;
    priority: z.ZodEnum<{
        high: "high";
        low: "low";
        medium: "medium";
        critical: "critical";
    }>;
    position: z.ZodNumber;
    listId: z.ZodString;
}, z.core.$strip>;
export type TaskType = z.infer<typeof TaskSchema>;
export declare const TaskReorderInputSchema: z.ZodObject<{
    data: z.ZodObject<{
        taskId: z.ZodString;
        listId: z.ZodString;
        position: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strict>;
export type TaskReorderInputType = z.infer<typeof TaskReorderInputSchema>;
export declare const TaskMoveInputSchema: z.ZodObject<{
    data: z.ZodObject<{
        taskId: z.ZodString;
        listId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strict>;
export type TaskMoveInputType = z.infer<typeof TaskMoveInputSchema>;
export {};
//# sourceMappingURL=task.type.d.ts.map