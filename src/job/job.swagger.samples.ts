/**
 * Job Swagger Sample Requests and Responses
 * These samples can be used as examples in Swagger documentation.
 */

import { PaymentType, PublishStatus } from '@prisma/client';

// Create Job Sample Request
export const createJobSample = {
  name_th: 'โปรแกรมเมอร์ฝึกงาน',
  name_en: 'Internship Programmer',
  description: 'ฝึกงานพัฒนาเว็บแอปพลิเคชันด้วย React และ Node.js',
  requirement:
    '- กำลังศึกษาปีที่ 3-4 สาขาวิทยาการคอมพิวเตอร์หรือสาขาที่เกี่ยวข้อง\n- มีความรู้พื้นฐานเกี่ยวกับ JavaScript, HTML, CSS\n- มีความสนใจในการพัฒนา Web Application',
  payment: 15000,
  payment_type: PaymentType.month,
  start_date: '2025-06-01T00:00:00.000Z',
  end_date: '2025-07-31T00:00:00.000Z',
  position_count: 2,
  companyId: 'cl1a2b3c4d5e6f7g8h9i0j',
  internshipTypeId: 'cl2b3c4d5e6f7g8h9i0j1k',
  faculties: [
    {
      id: 'cl3c4d5e6f7g8h9i0j1k2l',
    },
  ],
  departments: [
    {
      id: 'cl4d5e6f7g8h9i0j1k2l3m',
    },
    {
      id: 'cl5e6f7g8h9i0j1k2l3m4n',
    },
  ],
  isActive: true,
  createdById: 'cl6f7g8h9i0j1k2l3m4n5o',
};

// Update Job Sample Request
export const updateJobSample = {
  name_th: 'นักพัฒนาซอฟต์แวร์ฝึกงาน',
  name_en: 'Internship Software Developer',
  description: 'ฝึกงานพัฒนาโมบายล์แอปพลิเคชันด้วย Flutter และ Firebase',
  requirement:
    '- กำลังศึกษาปีที่ 3-4 สาขาวิทยาการคอมพิวเตอร์หรือสาขาที่เกี่ยวข้อง\n- มีความรู้พื้นฐานเกี่ยวกับการพัฒนาแอปพลิเคชันมือถือ\n- มีความสนใจในการใช้งาน Flutter และ Firebase',
  payment: 18000,
  payment_type: PaymentType.month,
  start_date: '2025-06-15T00:00:00.000Z',
  end_date: '2025-08-15T00:00:00.000Z',
  position_count: 3,
  status: PublishStatus.published,
  faculties: [
    {
      id: 'cl3c4d5e6f7g8h9i0j1k2l',
    },
  ],
  departments: [
    {
      id: 'cl4d5e6f7g8h9i0j1k2l3m',
    },
  ],
  isActive: true,
};

// Query Job Sample Request
export const queryJobSample = {
  search: 'โปรแกรมเมอร์',
  companyId: 'cl1a2b3c4d5e6f7g8h9i0j',
  internshipTypeId: 'cl2b3c4d5e6f7g8h9i0j1k',
  facultyIds: ['cl3c4d5e6f7g8h9i0j1k2l'],
  departmentIds: ['cl4d5e6f7g8h9i0j1k2l3m'],
  status: PublishStatus.published,
  paymentType: PaymentType.month,
  minPayment: 15000,
  maxPayment: 30000,
  startDateFrom: '2025-06-01T00:00:00.000Z',
  endDateTo: '2025-08-31T00:00:00.000Z',
  isActive: true,
  page: 1,
  limit: 10,
  sortBy: 'payment',
  sortOrder: 'desc',
};

// Sample Response for Get Job By ID
export const getJobByIdResponse = {
  id: 'cl7g8h9i0j1k2l3m4n5o6p',
  name_th: 'โปรแกรมเมอร์ฝึกงาน',
  name_en: 'Internship Programmer',
  description: 'ฝึกงานพัฒนาเว็บแอปพลิเคชันด้วย React และ Node.js',
  requirement:
    '- กำลังศึกษาปีที่ 3-4 สาขาวิทยาการคอมพิวเตอร์หรือสาขาที่เกี่ยวข้อง\n- มีความรู้พื้นฐานเกี่ยวกับ JavaScript, HTML, CSS\n- มีความสนใจในการพัฒนา Web Application',
  payment: 15000,
  payment_type: PaymentType.month,
  start_date: '2025-06-01T00:00:00.000Z',
  end_date: '2025-07-31T00:00:00.000Z',
  position_count: 2,
  status: PublishStatus.published,
  isActive: true,
  createdAt: '2025-04-26T12:34:56.789Z',
  updatedAt: '2025-04-27T12:34:56.789Z',
  companyId: 'cl1a2b3c4d5e6f7g8h9i0j',
  internshipTypeId: 'cl2b3c4d5e6f7g8h9i0j1k',
  createdById: 'cl6f7g8h9i0j1k2l3m4n5o',
  company: {
    id: 'cl1a2b3c4d5e6f7g8h9i0j',
    name_th: 'บริษัท เทคโนโลยี จำกัด',
    name_en: 'Technology Co., Ltd.',
    address: '123 ถนนสุขุมวิท',
    sub_district: 'คลองเตย',
    district: 'คลองเตย',
    province: 'กรุงเทพมหานคร',
    postcode: '10110',
    email: 'info@techcompany.com',
    phone: '02-123-4567',
  },
  internshipType: {
    id: 'cl2b3c4d5e6f7g8h9i0j1k',
    name_th: 'สหกิจศึกษา',
    name_en: 'Cooperative Education',
    isActive: true,
  },
  faculties: [
    {
      id: 'cl3c4d5e6f7g8h9i0j1k2l',
      name_th: 'คณะวิทยาการสารสนเทศ',
      name_en: 'Faculty of Informatics',
      code: 'IF',
    },
  ],
  departments: [
    {
      id: 'cl4d5e6f7g8h9i0j1k2l3m',
      name_th: 'วิทยาการคอมพิวเตอร์',
      name_en: 'Computer Science',
      code: 'CS',
    },
    {
      id: 'cl5e6f7g8h9i0j1k2l3m4n',
      name_th: 'วิศวกรรมซอฟต์แวร์',
      name_en: 'Software Engineering',
      code: 'SE',
    },
  ],
  createdBy: {
    id: 'cl6f7g8h9i0j1k2l3m4n5o',
    firstname: 'สมชาย',
    lastname: 'ใจดี',
    email: 'somchai@techcompany.com',
    role: 'company',
  },
};

// Sample Response for Get All Jobs
export const getAllJobsResponse = {
  data: [
    // Item 1
    {
      id: 'cl7g8h9i0j1k2l3m4n5o6p',
      name_th: 'โปรแกรมเมอร์ฝึกงาน',
      name_en: 'Internship Programmer',
      description: 'ฝึกงานพัฒนาเว็บแอปพลิเคชันด้วย React และ Node.js',
      payment: 15000,
      payment_type: PaymentType.month,
      start_date: '2025-06-01T00:00:00.000Z',
      end_date: '2025-07-31T00:00:00.000Z',
      position_count: 2,
      status: PublishStatus.published,
      isActive: true,
      company: {
        id: 'cl1a2b3c4d5e6f7g8h9i0j',
        name_th: 'บริษัท เทคโนโลยี จำกัด',
        name_en: 'Technology Co., Ltd.',
      },
      internshipType: {
        id: 'cl2b3c4d5e6f7g8h9i0j1k',
        name_th: 'สหกิจศึกษา',
        name_en: 'Cooperative Education',
      },
    },
    // Item 2
    {
      id: 'cl8h9i0j1k2l3m4n5o6p7q',
      name_th: 'นักวิเคราะห์ข้อมูลฝึกงาน',
      name_en: 'Internship Data Analyst',
      description: 'ฝึกงานวิเคราะห์ข้อมูลด้วย Python และ SQL',
      payment: 16000,
      payment_type: PaymentType.month,
      start_date: '2025-06-15T00:00:00.000Z',
      end_date: '2025-08-15T00:00:00.000Z',
      position_count: 1,
      status: PublishStatus.published,
      isActive: true,
      company: {
        id: 'cl9i0j1k2l3m4n5o6p7q8r',
        name_th: 'บริษัท ดาต้า จำกัด',
        name_en: 'Data Co., Ltd.',
      },
      internshipType: {
        id: 'cl2b3c4d5e6f7g8h9i0j1k',
        name_th: 'สหกิจศึกษา',
        name_en: 'Cooperative Education',
      },
    },
  ],
  meta: {
    total: 24,
    page: 1,
    limit: 10,
    totalPages: 3,
  },
};

// Sample Response for Update Job Status
export const updateJobStatusResponse = {
  id: 'cl7g8h9i0j1k2l3m4n5o6p',
  name_th: 'โปรแกรมเมอร์ฝึกงาน',
  name_en: 'Internship Programmer',
  status: PublishStatus.published,
  updatedAt: '2025-04-27T15:30:45.123Z',
};
