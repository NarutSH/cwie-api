import { z } from 'zod';
import { PublishStatus } from '@prisma/client';

export const CompanySchema = z.object({
  name_th: z.string().min(1, 'Thai name is required'),
  name_en: z.string().min(1, 'English name is required'),
  industryId: z.string().min(1, 'Industry is required'),
  address: z.string().min(1, 'Address is required'),
  sub_district: z.string().min(1, 'Sub-district is required'),
  district: z.string().min(1, 'District is required'),
  province: z.string().min(1, 'Province is required'),
  postcode: z.string().min(1, 'Postcode is required'),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  email: z.string().email('Invalid email format').optional().nullable(),
  phone: z.string().optional().nullable(),
  status: z.nativeEnum(PublishStatus).default('draft'),
  facultyIds: z.array(z.string()).optional(),
  departmentIds: z.array(z.string()).optional(),
});

export const ContactListSchema = z.object({
  firstname: z.string().min(1, 'First name is required'),
  lastname: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(1, 'Phone is required'),
});

export type CompanyType = z.infer<typeof CompanySchema>;
export type ContactListType = z.infer<typeof ContactListSchema>;
