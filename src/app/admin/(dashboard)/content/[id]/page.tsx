import { notFound } from "next/navigation";
import { contentById, contents } from "@/lib/content";
import ContentEditor from "@/components/content-editor";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [item, items] = await Promise.all([
    contentById(id),
    contents(undefined, true),
  ]);
  if (!item) notFound();
  return (
    <ContentEditor
      initial={item}
      services={items.filter((i) => i.kind === "service")}
      items={items}
    />
  );
}
