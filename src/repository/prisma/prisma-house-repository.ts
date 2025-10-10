import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type {
  FindByAddressData,
  House,
  HouseCreateInput,
  HouseRepository,
} from "../house-repository";

export class PrismaHouseRepository implements HouseRepository {
  async create(data: HouseCreateInput): Promise<House> {

    const formattedData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    );

    const house = await prisma.house.create({
      data: formattedData as Prisma.HouseCreateInput,
    });

    return house;
  }
  async findById(id: string): Promise<House | null> {
    const house = await prisma.house.findUnique({
      where: {
        id,
      },
    });

    return house;
  }
  async findMany(): Promise<House[]> {
    const houses = await prisma.house.findMany();

    return houses;
  }

  async findByAddressId(id: string): Promise<House | null> {
    const address = await prisma.house.findFirst({
      where: {
        id_address: id,
      },
    });

    return address;
  }

  async findByUser(id: string, name: string): Promise<House[] | null> {
    const houses = await prisma.house.findMany({
      where: {
        owner: {
          name: {
            contains: name,
            mode: "insensitive"
          },
          id: {
            contains: id,
            mode: "default"
          }
        }
      }

    });

    return houses;
  }

  async update(
    id: string,
    data: Partial<House>,
  ): Promise<House | null> {

    const formattedData: Prisma.HouseUpdateInput = Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
        if (value === undefined) return [key, undefined];
        return [key, { set: value }];
      })
    );

    const house = await prisma.house.update({
      where: {
        id,
      },
      data: formattedData,
    });

    return house;
  }
  async delete(id: string): Promise<boolean> {
    const house = await prisma.house.delete({
      where: {
        id,
      },
    });

    return !!house;
  }
  async findByAddress({
    cep,
    city,
    country,
    id,
    neighborhood,
    road,
    state
  }: FindByAddressData): Promise<House[] | null> {
    const houses = await prisma.house.findMany({
      where: {
        address: {
          city: {
            contains: city,
            mode: "insensitive"
          },
          cep: {
            contains: cep,
            mode: "insensitive"
          },
          country: {
            contains: country,
            mode: "insensitive"
          },
          neighborhood: {
            contains: neighborhood,
            mode: "insensitive"
          },
          road: {
            contains: road,
            mode: "insensitive"
          },
          state: {
            contains: state,
            mode: "insensitive"
          },
          id: {
            contains: id,
            mode: "default"
          }
        }
      }
    })
    return houses;
  }
  async findByOwner(id: string): Promise<House[] | null> {
    const houses = await prisma.house.findMany({
      where: {
        owner: {
          id,
        }
      }
    })
    return houses;
  }
  async findByDatesFree(check_in: Date, check_out: Date): Promise<House[] | null> {
    const houses = await prisma.house.findMany({
      where: {
        rentals: {
          none: {
            OR: [
              // New rental starts during an existing rental
              { check_in: { lt: check_out }, check_out: { gt: check_in } },
              // New rental ends during an existing rental
              { check_in: { lt: check_out }, check_out: { gt: check_in } },
              // New rental encloses an existing rental
              { check_in: { gte: check_in }, check_out: { lte: check_out } },
            ]
          }
        }
      }
    })
    return houses;
  }
}