import { contents } from "@/lib/content";
import ContentList from "@/components/content-list";
export default async function Page() {
  return <ContentList items={await contents(undefined, true)} />;
}
