import { fakerPT_BR as faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = [];
  const addresses = [];
  const houses = [];
  const rentals = [];

  // --------------- GERAR ENDEREÇOS E USUÁRIOS ---------------
  for (let i = 1; i <= 10; i++) {
    const addressId = `a${i}`;
    const userId = `u${i}`;

    // Endereço
    const addr = {
      id: addressId,
      cep: faker.location.zipCode("########"),
      road: faker.location.street(),
      neighborhood: faker.location.streetAddress(),
      house_number: faker.number.int({ min: 1, max: 500 }).toString(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: "Brasil",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    addresses.push(addr);

    // Usuário
    const user = {
      id: userId,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      emailVerified: faker.datatype.boolean(),
      date_birth: faker.date.birthdate({ min: 18, max: 60, mode: "age" }),
      cpf: faker.string.numeric(11),
      ddd: faker.string.numeric(2),
      phone: faker.phone.number({ style: 'national' }),
      id_address: addressId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.push(user);
  }

  // --------------- GERAR CASAS ---------------
  for (let i = 1; i <= 15; i++) {
    const ownerIndex = faker.number.int({ min: 0, max: users.length - 1 });
    const houseId = `h${i}`;
    const addressId = `a${faker.number.int({ min: 1, max: 10 })}`;

    const house = {
      id: houseId,
      price: parseFloat(faker.commerce.price({ min: 200000, max: 1000000 })),
      description: faker.commerce.productDescription(),
      createdAt: new Date(),
      updatedAt: new Date(),
      id_owner: users[ownerIndex].id,
      id_address: addressId,
    };
    houses.push(house);
  }

  // --------------- GERAR RESERVAS ---------------
  for (let i = 1; i <= 20; i++) {
    const userIndex = faker.number.int({ min: 0, max: users.length - 1 });
    const houseIndex = faker.number.int({ min: 0, max: houses.length - 1 });
    const checkIn = faker.date.future({ years: 1 });
    const checkOut = new Date(
      checkIn.getTime() +
      1000 * 60 * 60 * 24 * faker.number.int({ min: 1, max: 10 }),
    );

    const rental = {
      id: `r${i}`,
      check_in: checkIn,
      check_out: checkOut,
      id_user: users[userIndex].id,
      id_house: houses[houseIndex].id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    rentals.push(rental);
  }

  // ---------------- INSERÇÃO ----------------
  console.log("Inserindo endereços...");
  for (const addr of addresses) await prisma.address.create({ data: addr });

  console.log("Inserindo usuários...");
  for (const user of users) await prisma.user.create({ data: user });

  console.log("Inserindo casas...");
  for (const house of houses) await prisma.house.create({ data: house });

  console.log("Inserindo reservas...");
  for (const rental of rentals) await prisma.rental.create({ data: rental });

  console.log("Seed completa com dados aleatórios inserida com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
