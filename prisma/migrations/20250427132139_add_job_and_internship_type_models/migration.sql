-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('hour', 'day', 'week', 'month', 'finish');

-- CreateTable
CREATE TABLE "InternshipType" (
    "id" VARCHAR(36) NOT NULL,
    "name_th" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InternshipType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" VARCHAR(36) NOT NULL,
    "name_th" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "description" TEXT,
    "requirement" TEXT,
    "payment" DOUBLE PRECISION,
    "payment_type" "PaymentType",
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "position_count" INTEGER NOT NULL DEFAULT 1,
    "status" "PublishStatus" NOT NULL DEFAULT 'draft',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT NOT NULL,
    "internshipTypeId" TEXT NOT NULL,
    "createdById" TEXT,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FacultyToJob" (
    "A" VARCHAR(36) NOT NULL,
    "B" VARCHAR(36) NOT NULL,

    CONSTRAINT "_FacultyToJob_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_DepartmentToJob" (
    "A" VARCHAR(36) NOT NULL,
    "B" VARCHAR(36) NOT NULL,

    CONSTRAINT "_DepartmentToJob_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "InternshipType_name_th_key" ON "InternshipType"("name_th");

-- CreateIndex
CREATE UNIQUE INDEX "InternshipType_name_en_key" ON "InternshipType"("name_en");

-- CreateIndex
CREATE INDEX "_FacultyToJob_B_index" ON "_FacultyToJob"("B");

-- CreateIndex
CREATE INDEX "_DepartmentToJob_B_index" ON "_DepartmentToJob"("B");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_internshipTypeId_fkey" FOREIGN KEY ("internshipTypeId") REFERENCES "InternshipType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FacultyToJob" ADD CONSTRAINT "_FacultyToJob_A_fkey" FOREIGN KEY ("A") REFERENCES "Faculty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FacultyToJob" ADD CONSTRAINT "_FacultyToJob_B_fkey" FOREIGN KEY ("B") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DepartmentToJob" ADD CONSTRAINT "_DepartmentToJob_A_fkey" FOREIGN KEY ("A") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DepartmentToJob" ADD CONSTRAINT "_DepartmentToJob_B_fkey" FOREIGN KEY ("B") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
