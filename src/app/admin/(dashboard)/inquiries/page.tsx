import { query } from "@/lib/db";
import Inquiries from "@/components/inquiries";
import { serviceCategories } from "@/lib/service-catalog";
export default async function Page() {
  const [inquiries, services] = await Promise.all([
    query<any[]>("SELECT * FROM inquiries ORDER BY created_at DESC"),
    // Retain readable labels for inquiries about services removed from the site.
    query<{ slug: string; titleTh: string; titleEn: string }[]>(
      "SELECT slug,JSON_UNQUOTE(JSON_EXTRACT(document,'$.th.title')) AS titleTh,JSON_UNQUOTE(JSON_EXTRACT(document,'$.en.title')) AS titleEn FROM content WHERE kind='service'",
    ),
  ]);
  const eventTypeLabels: Record<string, string> = Object.fromEntries(
    serviceCategories.map((service) => [service.slug, service.th.title]),
  );
  for (const service of services) {
    const title = service.titleTh?.trim() || service.titleEn?.trim();
    if (title) eventTypeLabels[service.slug] = title;
  }
  eventTypeLabels.other = "อื่น ๆ / ยังไม่แน่ใจ";
  return <Inquiries initial={inquiries} eventTypeLabels={eventTypeLabels} />;
}
