import { prisma } from '../lib/prisma';
import Storefront from '../components/Storefront';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const products = await prisma.product.findMany({
    include: { category: true },
  });

  return <Storefront products={products} />;
}
