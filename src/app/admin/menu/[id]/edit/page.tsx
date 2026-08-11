import { prisma } from '../../../../../lib/prisma';
import { notFound } from 'next/navigation';
import EditProductForm from './EditProductForm';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!product) {
    notFound();
  }

  return <EditProductForm product={product} />;
}
