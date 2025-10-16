/*
  Warnings:

  - You are about to drop the column `description` on the `project` table. All the data in the column will be lost.
  - Added the required column `filePath` to the `project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageKitId` to the `project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."project" DROP COLUMN "description",
ADD COLUMN     "filePath" TEXT NOT NULL,
ADD COLUMN     "imageKitId" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;
