import { notFound } from 'next/navigation';

export default function DashboardCatchAll({ params }: { params: { slug: string[] } }) {
  notFound();
}