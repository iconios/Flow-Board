import { z } from "zod";
export declare const CreateListInputSchema: z.ZodObject<
  {
    title: z.ZodString;
    position: z.ZodNumber;
    boardId: z.ZodString;
    status: z.ZodEnum<{
      active: "active";
      archive: "archive";
    }>;
  },
  z.core.$strict
>;
export type CreateListInputType = z.infer<typeof CreateListInputSchema>;
declare const CreateListOutputSchema: z.ZodObject<
  {
    success: z.ZodBoolean;
    message: z.ZodString;
    list: z.ZodOptional<
      z.ZodObject<
        {
          id: z.ZodString;
          title: z.ZodString;
          position: z.ZodNumber;
          status: z.ZodEnum<{
            active: "active";
            archive: "archive";
          }>;
          boardId: z.ZodString;
        },
        z.core.$strip
      >
    >;
  },
  z.core.$strip
>;
export type CreateListOutputType = z.infer<typeof CreateListOutputSchema>;
declare const ReadListOutputSchema: z.ZodObject<
  {
    message: z.ZodString;
    success: z.ZodBoolean;
    lists: z.ZodOptional<
      z.ZodArray<
        z.ZodObject<
          {
            id: z.ZodString;
            title: z.ZodString;
            position: z.ZodNumber;
            status: z.ZodEnum<{
              active: "active";
              archive: "archive";
            }>;
            boardId: z.ZodString;
            tasks: z.ZodArray<
              z.ZodObject<
                {
                  _id: z.ZodString;
                  title: z.ZodString;
                  description: z.ZodString;
                  dueDate: z.ZodISODateTime;
                  priority: z.ZodEnum<{
                    low: "low";
                    medium: "medium";
                    high: "high";
                    critical: "critical";
                  }>;
                  position: z.ZodNumber;
                  listId: z.ZodString;
                },
                z.core.$strip
              >
            >;
          },
          z.core.$strip
        >
      >
    >;
  },
  z.core.$strip
>;
export type ReadListOutputType = z.infer<typeof ReadListOutputSchema>;
declare const ListOutputSchema: z.ZodObject<
  {
    _id: z.ZodString;
    title: z.ZodString;
    userId: z.ZodString;
    position: z.ZodNumber;
    status: z.ZodEnum<{
      active: "active";
      archive: "archive";
    }>;
    boardId: z.ZodString;
    tasks: z.ZodArray<
      z.ZodObject<
        {
          _id: z.ZodString;
          title: z.ZodString;
          description: z.ZodString;
          dueDate: z.ZodISODateTime;
          priority: z.ZodEnum<{
            low: "low";
            medium: "medium";
            high: "high";
            critical: "critical";
          }>;
          position: z.ZodNumber;
          listId: z.ZodString;
        },
        z.core.$strip
      >
    >;
  },
  z.core.$strip
>;
export type ListsOutputType = z.infer<typeof ListOutputSchema>;
export declare const UpdateListInputSchema: z.ZodObject<
  {
    title: z.ZodOptional<z.ZodString>;
    position: z.ZodOptional<z.ZodNumber>;
    status: z.ZodOptional<
      z.ZodEnum<{
        active: "active";
        archive: "archive";
      }>
    >;
  },
  z.core.$strict
>;
export type UpdateListInputType = z.infer<typeof UpdateListInputSchema>;
declare const UpdateListOutputSchema: z.ZodObject<
  {
    success: z.ZodBoolean;
    message: z.ZodString;
    list: z.ZodOptional<
      z.ZodObject<
        {
          title: z.ZodString;
          id: z.ZodString;
          status: z.ZodEnum<{
            active: "active";
            archive: "archive";
          }>;
          position: z.ZodNumber;
          userId: z.ZodString;
          boardId: z.ZodString;
          tasks: z.ZodArray<z.ZodString>;
        },
        z.core.$strip
      >
    >;
  },
  z.core.$strip
>;
export type UpdateListOutputType = z.infer<typeof UpdateListOutputSchema>;
declare const DeleteListOutputSchema: z.ZodObject<
  {
    success: z.ZodBoolean;
    message: z.ZodString;
    list: z.ZodOptional<
      z.ZodObject<
        {
          title: z.ZodString;
          position: z.ZodNumber;
          status: z.ZodEnum<{
            active: "active";
            archive: "archive";
          }>;
          boardId: z.ZodString;
          userId: z.ZodString;
          id: z.ZodString;
          tasks: z.ZodArray<z.ZodString>;
        },
        z.core.$strip
      >
    >;
  },
  z.core.$strip
>;
export type DeleteListOutputType = z.infer<typeof DeleteListOutputSchema>;
export declare const ListReorderInputSchema: z.ZodObject<
  {
    data: z.ZodObject<
      {
        listId: z.ZodString;
        position: z.ZodNumber;
      },
      z.core.$strip
    >;
  },
  z.core.$strict
>;
export type ListReorderInputType = z.infer<typeof ListReorderInputSchema>;
export {};
//# sourceMappingURL=list.type.d.ts.map
