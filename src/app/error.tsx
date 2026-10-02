"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="error-page">
      <span className="eyebrow">ELITE FLOW</span>
      <h1>
        โหลดข้อมูลไม่สำเร็จ
        <br />
        Unable to load this page.
      </h1>
      <p>กรุณาลองอีกครั้ง หรือติดต่อ 062 896 5444</p>
      <button className="button" onClick={reset}>
        ลองอีกครั้ง / Try again
      </button>
    </main>
  );
}
