/*
  Warnings:

  - You are about to drop the column `createdAt` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `bookId` on the `borrow_history` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `borrow_history` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `borrow_history` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `borrow_history` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `book_id` to the `borrow_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `borrow_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `borrow_history` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "borrow_history" DROP CONSTRAINT "borrow_history_bookId_fkey";

-- DropForeignKey
ALTER TABLE "borrow_history" DROP CONSTRAINT "borrow_history_userId_fkey";

-- AlterTable
ALTER TABLE "books" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "borrow_history" DROP COLUMN "bookId",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "book_id" INTEGER NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "borrow_history" ADD CONSTRAINT "borrow_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "borrow_history" ADD CONSTRAINT "borrow_history_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
