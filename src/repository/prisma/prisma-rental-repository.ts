import { prisma } from "@/lib/prisma";
import type {
  Rental,
  RentalCreateInput,
  RentalRepository,
} from "../rental-repository";

export class PrismaRentalRepository implements RentalRepository {
  async create(data: RentalCreateInput): Promise<Rental> {
    const rental = await prisma.rental.create({
      data: {
        check_in: data.check_in,
        check_out: data.check_out,
        id_house: data.house,
        id_user: data.user,
      },
    });

    return rental;


  }
  async findById(id: string): Promise<Rental | null> {
    const rental = await prisma.rental.findUnique({
      where: {
        id,
      },
    });

    return rental
  }
  async findMany(): Promise<Rental[]> {
    const rentals = await prisma.rental.findMany();

    return rentals
  }
  async findByHouseId(id: string): Promise<Rental[]> {
    const rentals = await prisma.rental.findMany({
      where: {
        id_house: id,
      },
    });

    return rentals
  }
  async delete(id: string): Promise<boolean> {
    await prisma.rental.delete({
      where: {
        id,
      },
    });

    return true
  }
  async findByDateRange(check_in: Date, check_out: Date): Promise<Rental[]> {
    const rental = await prisma.rental.findMany({
      where: {
        check_in: {
          lte: check_out,
        },
        check_out: {
          gte: check_in,
        },
      },
    })
    return rental
  }
  async findByHouse(id_house: string): Promise<Rental[]> {
    throw new Error("Method not implemented.");
  }
  async findByHouseIdAndDateRange(
    id_house: string,
    check_in: Date,
    check_out: Date,
  ): Promise<Rental[]> {
    const rental = await prisma.rental.findMany({
      where: {
        id_house,
        check_in: {
          lte: check_out,
        },
        check_out: {
          gte: check_in,
        },
      },
    })
    return rental
  }
  async findByUserId(id_user: string): Promise<Rental[]> {
    const rental = await prisma.rental.findMany({
      where: {
        id_user,
      },
    })
    return rental
  }

  async findByUserIdAndDateRange(
    id_user: string,
    check_in: Date,
    check_out: Date,
  ): Promise<Rental[]> {
    const rental = await prisma.rental.findMany({
      where: {
        id_user,
        check_in: {
          lte: check_out,
        },
        check_out: {
          gte: check_in,
        },
      },
    })
    return rental
  }
  async findByUserIdAndHouseIdAndDateRange(
    id_user: string,
    id_house: string,
    check_in: Date,
    check_out: Date,
  ): Promise<Rental[]> {
    const rental = await prisma.rental.findMany({
      where: {
        id_user,
        id_house,
        check_in: {
          lte: check_out,
        },
        check_out: {
          gte: check_in,
        },
      },
    })
    return rental
  }
  async update(id: string, data: Partial<Rental>): Promise<Rental | null> {
    const rental = await prisma.rental.update({
      where: {
        id,
      },
      data,
    });

    return rental
  }
}
