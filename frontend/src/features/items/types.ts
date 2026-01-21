import { z } from "zod";

export const itemSchema = z.object({
  id: z.string(),
  name: z.string(),
  bought: z.boolean(),
});

export const itemsSchema = z.array(itemSchema);

export type Item = z.infer<typeof itemSchema>;
