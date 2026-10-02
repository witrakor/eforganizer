import { redirect } from "next/navigation";
import { currentAdmin } from "@/lib/auth";
import { contents } from "@/lib/content";
import ContentPreview from "@/components/content-preview";
export const metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default async function Preview() {
  if (!(await currentAdmin())) redirect("/admin/login");
  return <ContentPreview items={await contents(undefined, true)} />;
}
