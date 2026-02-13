/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `restaurant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "restaurant_slug_key" ON "restaurant"("slug");
