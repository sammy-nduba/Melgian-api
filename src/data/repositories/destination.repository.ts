import { prisma } from "@/core/db/prisma.js";

export class DestinationRepository {
  async findAll() {
    return prisma.destination.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  async findPopular() {
    return prisma.destination.findMany({
      where: {
        isActive: true,
        isPopular: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  async findBySlug(slug: string) {
    return prisma.destination.findUnique({
      where: {
        slug,
      },
    });
  }

  async search(query: string) {
    return prisma.destination.findMany({
      where: {
        isActive: true,
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            country: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  async create(data: any, slug: string) {
    return prisma.destination.create({
      data: {
        ...data,
        slug,
      },
    });
  }

  async update(slug: string, data: any) {
    return prisma.destination.update({
      where: { slug },
      data,
    });
  }
}

