import { ConsumptionMethod, OrderStatus, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * =====================================================
 * CONFIGURAÇÕES DO SEED
 * =====================================================
 */
const RESTAURANT_COUNT = 4;
const PRODUCT_CATEGORIES = [
  'Hambúrguer',
  'Pizza',
  'Bebida',
  'Sobremesa',
  'Acompanhamento'
];

const PRODUCTS_PER_RESTAURANT = 10;
const ORDERS_PER_RESTAURANT = 3;

/**
 * =====================================================
 * FUNÇÃO PRINCIPAL
 * =====================================================
 */
async function main() {
  console.log('🌱 Iniciando seed...');

  /**
   * =====================================================
   * 1️⃣ CATEGORIAS DE PRODUTO (GLOBAL)
   * =====================================================
   */
  const productCategories = await prisma.productCategory.createManyAndReturn({
    data: PRODUCT_CATEGORIES.map(name => ({ name }))
  });

  /**
   * =====================================================
   * 2️⃣ RESTAURANTES
   * =====================================================
   */
  for (let r = 1; r <= RESTAURANT_COUNT; r++) {
    const restaurant = await prisma.restaurant.create({
      data: {
        name: `Restaurante ${r}`,
        slug: `restaurante-${r}`,
        description: `Descrição do restaurante ${r}`,
        avatarImageUrl: 'https://picsum.photos/200',
        coverImageUrl: 'https://picsum.photos/800/300'
      }
    });

    /**
     * =====================================================
     * 3️⃣ CATEGORIAS DO RESTAURANTE
     * =====================================================
     */
    const restaurantCategories =
      await prisma.restaurantCategory.createManyAndReturn({
        data: PRODUCT_CATEGORIES.map(name => ({
          name,
          restaurantId: restaurant.id
        }))
      });

    /**
     * =====================================================
     * 4️⃣ PRODUTOS
     * =====================================================
     */
    const products = [];

    for (let p = 1; p <= PRODUCTS_PER_RESTAURANT; p++) {
      const categoryIndex = p % productCategories.length;

      const product = await prisma.product.create({
        data: {
          name: `Produto ${p} - Restaurante ${r}`,
          description: `Descrição do produto ${p}`,
          price: Number((Math.random() * 40 + 10).toFixed(2)),
          imageUrl: 'https://picsum.photos/300',
          ingredients: ['Ingrediente 1', 'Ingrediente 2'],
          restaurantId: restaurant.id,
          categoryId: productCategories[categoryIndex].id
        }
      });

      products.push(product);
    }

    /**
     * =====================================================
     * 5️⃣ PEDIDOS
     * =====================================================
     */
    for (let o = 1; o <= ORDERS_PER_RESTAURANT; o++) {
      const order = await prisma.order.create({
        data: {
          total: 0,
          status: OrderStatus.PENDING,
          consumptionMethod:
            o % 2 === 0
              ? ConsumptionMethod.DINE_IN
              : ConsumptionMethod.TAKEAWAY,
          restaurantId: restaurant.id
        }
      });

      /**
       * =====================================================
       * 6️⃣ ITENS DO PEDIDO
       * =====================================================
       */
      const selectedProducts = products.slice(0, 3);
      let total = 0;

      for (const product of selectedProducts) {
        const quantity = Math.floor(Math.random() * 2) + 1;
        total += product.price * quantity;

        await prisma.orderProduct.create({
          data: {
            orderId: order.id,
            productId: product.id,
            quantity,
            price: product.price
          }
        });
      }

      // Atualiza o total do pedido
      await prisma.order.update({
        where: { id: order.id },
        data: { total }
      });
    }
  }

  console.log('✅ Seed executado com sucesso!');
}

/**
 * =====================================================
 * EXECUÇÃO SEGURA
 * =====================================================
 */
main()
  .catch(error => {
    console.error('❌ Erro no seed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
