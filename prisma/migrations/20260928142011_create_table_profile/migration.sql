/*
  Warnings:

  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `post_comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `posts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "post_comments" DROP CONSTRAINT "post_comments_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "post_comments" DROP CONSTRAINT "post_comments_postId_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_categoryId_fkey";

-- DropTable
DROP TABLE "categories";

-- DropTable
DROP TABLE "post_comments";

-- DropTable
DROP TABLE "posts";

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "imageUrl" TEXT,
    "pdfUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);
