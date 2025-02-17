-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "isTokenChat" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tokenData" TEXT;
