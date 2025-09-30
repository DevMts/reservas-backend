/*
  Warnings:

  - A unique constraint covering the columns `[providerId,accountId]` on the table `account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cpf]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_address]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[identifier,value]` on the table `verification` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpf` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_birth` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ddd` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "cpf" CHAR(11) NOT NULL,
ADD COLUMN     "date_birth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "ddd" CHAR(2) NOT NULL,
ADD COLUMN     "id_address" TEXT,
ADD COLUMN     "phone" VARCHAR(15) NOT NULL;

-- CreateTable
CREATE TABLE "public"."address" (
    "id" TEXT NOT NULL,
    "cep" CHAR(8) NOT NULL,
    "road" VARCHAR(100) NOT NULL,
    "neighborhood" VARCHAR(100) NOT NULL,
    "house_number" VARCHAR(10) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "state" VARCHAR(45) NOT NULL,
    "country" VARCHAR(45) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."house" (
    "id" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_owner" TEXT NOT NULL,
    "id_address" TEXT NOT NULL,

    CONSTRAINT "house_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."rental" (
    "id" TEXT NOT NULL,
    "check_in" TIMESTAMP NOT NULL,
    "check_out" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_user" TEXT NOT NULL,
    "id_house" TEXT NOT NULL,

    CONSTRAINT "rental_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "house_id_address_key" ON "public"."house"("id_address");

-- CreateIndex
CREATE UNIQUE INDEX "account_providerId_accountId_key" ON "public"."account"("providerId", "accountId");

-- CreateIndex
CREATE UNIQUE INDEX "user_cpf_key" ON "public"."user"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "user_id_address_key" ON "public"."user"("id_address");

-- CreateIndex
CREATE UNIQUE INDEX "verification_identifier_value_key" ON "public"."verification"("identifier", "value");

-- AddForeignKey
ALTER TABLE "public"."user" ADD CONSTRAINT "user_id_address_fkey" FOREIGN KEY ("id_address") REFERENCES "public"."address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."house" ADD CONSTRAINT "house_id_owner_fkey" FOREIGN KEY ("id_owner") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."house" ADD CONSTRAINT "house_id_address_fkey" FOREIGN KEY ("id_address") REFERENCES "public"."address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."rental" ADD CONSTRAINT "rental_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."rental" ADD CONSTRAINT "rental_id_house_fkey" FOREIGN KEY ("id_house") REFERENCES "public"."house"("id") ON DELETE CASCADE ON UPDATE CASCADE;
