/*
  Warnings:

  - You are about to drop the `match-teams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `refresh-tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `match-teams` DROP FOREIGN KEY `match-teams_matchId_fkey`;

-- DropForeignKey
ALTER TABLE `match-teams` DROP FOREIGN KEY `match-teams_teamId_fkey`;

-- DropForeignKey
ALTER TABLE `refresh-tokens` DROP FOREIGN KEY `refresh-tokens_userId_fkey`;

-- DropTable
DROP TABLE `match-teams`;

-- DropTable
DROP TABLE `refresh-tokens`;

-- CreateTable
CREATE TABLE `refresh_tokens` (
    `token` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expiryDate` DATETIME(3) NOT NULL,

    UNIQUE INDEX `refresh_tokens_token_key`(`token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `match_teams` (
    `matchId` VARCHAR(191) NOT NULL,
    `teamId` VARCHAR(191) NOT NULL,
    `isWinner` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`matchId`, `teamId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match_teams` ADD CONSTRAINT `match_teams_matchId_fkey` FOREIGN KEY (`matchId`) REFERENCES `matches`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match_teams` ADD CONSTRAINT `match_teams_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `teams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
