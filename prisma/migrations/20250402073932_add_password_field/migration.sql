-- AlterTable
ALTER TABLE `users` ADD COLUMN `password` VARCHAR(191) NOT NULL DEFAULT '';

-- Update existing users with a default password
UPDATE `users` SET `password` = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyDAX3YQYwZQeG' WHERE `password` = ''; 