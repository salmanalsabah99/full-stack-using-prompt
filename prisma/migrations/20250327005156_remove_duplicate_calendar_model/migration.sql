/*
  Warnings:

  - You are about to drop the `calendarevent` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `CalendarEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `calendarentry` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `calendarevent`;
