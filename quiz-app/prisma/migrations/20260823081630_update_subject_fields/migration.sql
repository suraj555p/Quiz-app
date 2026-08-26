/*
  Warnings:

  - Added the required column `negativeMarking` to the `Subject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `positiveMarking` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "negativeMarking" INTEGER NOT NULL,
ADD COLUMN     "positiveMarking" INTEGER NOT NULL;
