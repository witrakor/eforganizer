import { notFound, redirect } from "next/navigation";
import { contentById } from "@/lib/content";
import { adminContentHref } from "@/lib/admin-content-url";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await contentById(id);
  if (!item) notFound();
  redirect(adminContentHref(item));
}
