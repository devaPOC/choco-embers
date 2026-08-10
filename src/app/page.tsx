import { prisma } from '../lib/prisma';
import Storefront from '../components/Storefront';

export const dynamic = 'force-dynamic';

export default async function Home() {
  console.log('--- PAGE.TSX ---');
  console.log('process.env.DATABASE_URL:', process.env.DATABASE_URL);
  console.log('----------------');

  const products = await prisma.product.findMany({
    include: { category: true },
  });

  return <Storefront products={products} />;
}
