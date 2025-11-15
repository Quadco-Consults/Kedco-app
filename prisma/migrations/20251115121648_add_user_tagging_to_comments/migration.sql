-- AlterTable
ALTER TABLE "document_comments" ADD COLUMN     "actionDueDate" TIMESTAMP(3),
ADD COLUMN     "nextAction" TEXT,
ADD COLUMN     "taggedUserId" TEXT;

-- AddForeignKey
ALTER TABLE "document_comments" ADD CONSTRAINT "document_comments_taggedUserId_fkey" FOREIGN KEY ("taggedUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
