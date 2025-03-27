/*
  Warnings:

  - You are about to drop the column `content` on the `task` table. All the data in the column will be lost.
  - Added the required column `dueDate` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `task` DROP COLUMN `content`,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `dueDate` DATETIME(3) NOT NULL,
    ADD COLUMN `priority` ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL DEFAULT 'MEDIUM',
    ADD COLUMN `title` VARCHAR(191) NOT NULL;
