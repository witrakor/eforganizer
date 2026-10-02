import { mediaList, contents } from "@/lib/content";
import { storageDriver } from "@/lib/storage";
import MediaManager from "@/components/media-manager";
export default async function Page() {
  const [files, items] = await Promise.all([
    mediaList(true),
    contents(undefined, true),
  ]);
  return (
    <MediaManager initial={files} items={items} driver={storageDriver()} />
  );
}
