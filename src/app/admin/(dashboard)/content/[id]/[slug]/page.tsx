import { notFound } from "next/navigation";
import { content, contents } from "@/lib/content";
import { adminContentKind } from "@/lib/admin-content-url";
import ContentEditor from "@/components/content-editor";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  // Share the first dynamic segment with the legacy UUID redirect route.
  const { id: section, slug } = await params;
  const kind = adminContentKind(section);
  if (!kind) notFound();
  const [item, items] = await Promise.all([
    content(kind, slug, true),
    contents(undefined, true),
  ]);
  if (!item) notFound();
  return (
    <ContentEditor
      key={item.id}
      initial={item}
      siteUrl={process.env.SITE_URL || ""}
      services={items.filter((entry) => entry.kind === "service")}
      items={items}
    />
  );
}
