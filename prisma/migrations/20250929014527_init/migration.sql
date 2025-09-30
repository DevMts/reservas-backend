-- CreateTable
CREATE TABLE "public"."User" (
    "id_user" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "date_birth" TIMESTAMP(3) NOT NULL,
    "cpf" TEXT NOT NULL,
    "ddd" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "id_address" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "public"."Address" (
    "id_address" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "house_number" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id_address")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_key" ON "public"."User"("cpf");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_id_address_fkey" FOREIGN KEY ("id_address") REFERENCES "public"."Address"("id_address") ON DELETE RESTRICT ON UPDATE CASCADE;
