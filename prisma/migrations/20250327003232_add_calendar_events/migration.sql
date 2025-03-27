/*
  Warnings:

  - You are about to drop the column `order` on the `task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `task` DROP COLUMN `order`,
    ADD COLUMN `completed` BOOLEAN NOT NULL DEFAULT false;
