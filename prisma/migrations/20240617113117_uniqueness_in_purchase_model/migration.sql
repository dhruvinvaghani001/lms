/*
  Warnings:

  - A unique constraint covering the columns `[userId,courseId]` on the table `Purchase` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `chapter` MODIFY `videoUrl` TEXT NULL,
    MODIFY `position` INTEGER NULL;

-- CreateIndex
CREATE FULLTEXT INDEX `Course_title_idx` ON `Course`(`title`);

-- CreateIndex
CREATE UNIQUE INDEX `Purchase_userId_courseId_key` ON `Purchase`(`userId`, `courseId`);
