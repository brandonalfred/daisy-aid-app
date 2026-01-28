-- AlterTable
ALTER TABLE "admin" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "admin_deleted_at_idx" ON "admin"("deleted_at");
