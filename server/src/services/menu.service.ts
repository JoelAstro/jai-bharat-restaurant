import prisma from '../config/prisma.js';

export class MenuService {
  // --- Categories ---
  static async getCategories(includeInactive = false) {
    return prisma.category.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: { items: true },
        },
      },
    });
  }

  static async createCategory(data: {
    name: string;
    slug?: string;
    description?: string;
    displayOrder?: number;
    isActive?: boolean;
    imageUrl?: string;
  }) {
    const slug =
      data.slug ||
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    return prisma.category.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        displayOrder: data.displayOrder ?? 0,
        isActive: data.isActive ?? true,
        imageUrl: data.imageUrl,
      },
    });
  }

  static async updateCategory(
    id: string,
    data: {
      name?: string;
      slug?: string;
      description?: string;
      displayOrder?: number;
      isActive?: boolean;
      imageUrl?: string;
    }
  ) {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  static async deleteCategory(id: string) {
    const itemCount = await prisma.menuItem.count({ where: { categoryId: id } });
    if (itemCount > 0) {
      throw new Error(
        `Cannot delete category containing ${itemCount} menu items. Reassign or delete the items first.`
      );
    }
    return prisma.category.delete({ where: { id } });
  }

  // --- Menu Items ---
  static async getMenuItems(filters?: {
    categoryId?: string;
    categorySlug?: string;
    search?: string;
    isVeg?: boolean;
    isFeatured?: boolean;
    isAvailable?: boolean;
    isAdmin?: boolean;
  }) {
    const whereClause: any = {};

    if (!filters?.isAdmin) {
      whereClause.isAvailable = true;
    } else if (filters.isAvailable !== undefined) {
      whereClause.isAvailable = filters.isAvailable;
    }

    if (filters?.categoryId) {
      whereClause.categoryId = filters.categoryId;
    }

    if (filters?.categorySlug) {
      whereClause.category = { slug: filters.categorySlug };
    }

    if (filters?.isVeg !== undefined) {
      whereClause.isVeg = filters.isVeg;
    }

    if (filters?.isFeatured !== undefined) {
      whereClause.isFeatured = filters.isFeatured;
    }

    if (filters?.search && filters.search.trim()) {
      whereClause.OR = [
        { name: { contains: filters.search.trim() } },
        { description: { contains: filters.search.trim() } },
      ];
    }

    return prisma.menuItem.findMany({
      where: whereClause,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        variations: {
          orderBy: { price: 'asc' },
        },
        addons: {
          orderBy: { price: 'asc' },
        },
      },
      orderBy: [{ isFeatured: 'desc' }, { name: 'asc' }],
    });
  }

  static async getMenuItemById(id: string) {
    const item = await prisma.menuItem.findUnique({
      where: { id },
      include: {
        category: true,
        variations: {
          orderBy: { price: 'asc' },
        },
        addons: {
          orderBy: { price: 'asc' },
        },
      },
    });

    if (!item) {
      throw new Error('Menu item not found.');
    }

    return item;
  }

  static async createMenuItem(data: {
    categoryId: string;
    name: string;
    description: string;
    price: number;
    isVeg: boolean;
    isAvailable?: boolean;
    isFeatured?: boolean;
    imageUrl?: string;
    variations?: { name: string; price: number }[];
    addons?: { name: string; price: number }[];
  }) {
    return prisma.menuItem.create({
      data: {
        categoryId: data.categoryId,
        name: data.name,
        description: data.description,
        price: data.price,
        isVeg: data.isVeg,
        isAvailable: data.isAvailable ?? true,
        isFeatured: data.isFeatured ?? false,
        imageUrl: data.imageUrl,
        ...(data.variations && data.variations.length > 0 && {
          variations: {
            create: data.variations,
          },
        }),
        ...(data.addons && data.addons.length > 0 && {
          addons: {
            create: data.addons,
          },
        }),
      },
      include: {
        variations: true,
        addons: true,
        category: true,
      },
    });
  }

  static async updateMenuItem(
    id: string,
    data: {
      categoryId?: string;
      name?: string;
      description?: string;
      price?: number;
      isVeg?: boolean;
      isAvailable?: boolean;
      isFeatured?: boolean;
      imageUrl?: string;
      variations?: { id?: string; name: string; price: number }[];
      addons?: { id?: string; name: string; price: number }[];
    }
  ) {
    const { variations, addons, ...itemData } = data;

    // Use transaction if variations/addons are being synchronized
    return prisma.$transaction(async (tx: any) => {
      if (variations) {
        await tx.itemVariation.deleteMany({ where: { menuItemId: id } });
        if (variations.length > 0) {
          await tx.itemVariation.createMany({
            data: variations.map((v: any) => ({
              menuItemId: id,
              name: v.name,
              price: v.price,
            })),
          });
        }
      }

      if (addons) {
        await tx.itemAddon.deleteMany({ where: { menuItemId: id } });
        if (addons.length > 0) {
          await tx.itemAddon.createMany({
            data: addons.map((a) => ({
              menuItemId: id,
              name: a.name,
              price: a.price,
            })),
          });
        }
      }

      return tx.menuItem.update({
        where: { id },
        data: itemData,
        include: {
          variations: true,
          addons: true,
          category: true,
        },
      });
    });
  }

  static async toggleAvailability(id: string) {
    const item = await prisma.menuItem.findUnique({ where: { id } });
    if (!item) throw new Error('Menu item not found.');

    return prisma.menuItem.update({
      where: { id },
      data: { isAvailable: !item.isAvailable },
    });
  }

  static async deleteMenuItem(id: string) {
    return prisma.menuItem.delete({
      where: { id },
    });
  }
}
