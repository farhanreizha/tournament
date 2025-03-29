/*
  Warnings:

  - You are about to drop the column `userId` on the `player` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[gameId]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gameId` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nickname` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `player` DROP FOREIGN KEY `Player_userId_fkey`;

-- DropIndex
DROP INDEX `Player_userId_fkey` ON `player`;

-- AlterTable
ALTER TABLE `player` DROP COLUMN `userId`,
    ADD COLUMN `gameId` VARCHAR(191) NOT NULL,
    ADD COLUMN `nickname` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Player_gameId_key` ON `Player`(`gameId`);
