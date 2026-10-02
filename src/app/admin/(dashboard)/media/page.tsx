import { mediaList } from "@/lib/content";
import { storageDriver } from "@/lib/storage";
import MediaManager from "@/components/media-manager";
export default async function Page() {
  return (
    <MediaManager initial={await mediaList(true)} driver={storageDriver()} />
  );
}
