import { z } from 'zod';

export const IndustrySchema = z.object({
  name_th: z.string().min(1, 'Thai name is required'),
  name_en: z.string().min(1, 'English name is required'),
});

export type IndustryType = z.infer<typeof IndustrySchema>;
