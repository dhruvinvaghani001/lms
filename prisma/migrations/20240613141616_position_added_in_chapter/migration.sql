/*
  Warnings:

  - Added the required column `position` to the `Chapter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `chapter` ADD COLUMN `position` INTEGER NOT NULL;
