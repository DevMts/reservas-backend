import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type {
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
}