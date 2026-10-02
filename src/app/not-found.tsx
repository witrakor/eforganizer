import Link from "next/link";
export default function NotFound() {
  return (
    <main className="error-page">
      <span className="eyebrow">ELITE FLOW / 404</span>
      <h1>
        ไม่พบหน้านี้
        <br />
        Page not found.
      </h1>
      <p>หน้าที่คุณค้นหาอาจถูกย้าย หรือยังไม่ได้เผยแพร่</p>
      <Link className="button" href="/th">
        กลับหน้าแรก / Back home ↗
      </Link>
    </main>
  );
}
