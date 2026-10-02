import { query } from "@/lib/db";
import Inquiries from "@/components/inquiries";
export default async function Page() {
  return (
    <Inquiries
      initial={await query<any[]>(
        "SELECT * FROM inquiries ORDER BY created_at DESC",
      )}
    />
  );
}
