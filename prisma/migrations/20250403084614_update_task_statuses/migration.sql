/*
  Warnings:

  - The values [ARCHIVED] on the enum `tasks_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `tasks` MODIFY `status` ENUM('TODO', 'WAITING', 'HOLD', 'IN_PROGRESS', 'DONE') NOT NULL DEFAULT 'TODO';
