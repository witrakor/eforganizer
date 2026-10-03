"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "./site-link";
import { ArrowUpRight, CheckCircle2, LoaderCircle } from "lucide-react";
import type { Locale } from "@/lib/types";
export default function ContactForm({
  locale: l,
  services,
}: {
  locale: Locale;
  services: { slug: string; title: string }[];
}) {
  const params = useSearchParams();
  const selectedService = services.some((s) => s.slug === params.get("service"))
    ? params.get("service")!
    : "";
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  const t = (th: string, en: string) => (l === "th" ? th : en);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const f = new FormData(e.currentTarget);
    try {
      const r = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(f),
          consent: f.get("consent") === "on",
          locale: l,
        }),
      });
      if (!r.ok)
        throw new Error(
          r.status === 429
            ? t(
                "ส่งข้อความถี่เกินไป กรุณาลองอีกครั้งภายหลัง",
                "Too many requests. Please try again later.",
              )
            : t(
                "ส่งข้อมูลไม่สำเร็จ กรุณาตรวจข้อมูลหรือติดต่อทางโทรศัพท์",
                "Unable to send. Please check your details or call us.",
              ),
        );
      setState("success");
    } catch (e) {
      setError((e as Error).message);
      setState("error");
    }
  }
  if (state === "success")
    return (
      <div className="form-success" role="status">
        <CheckCircle2 size={40} />
        <h2>{t("ได้รับรายละเอียดแล้วครับ", "Your brief is with us.")}</h2>
        <p>
          {t(
            "ทีมจะตรวจรายละเอียดและติดต่อกลับผ่านช่องทางที่คุณแจ้งไว้",
            "Our team will review the details and contact you using the information provided.",
          )}
        </p>
        <button className="button" onClick={() => setState("idle")}>
          {t("ส่งรายละเอียดงานอื่น", "Send another brief")}
        </button>
      </div>
    );
  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="form-heading">
        <span className="eyebrow">YOUR EVENT BRIEF</span>
        <h2>
          {t(
            "เริ่มต้นด้วยรายละเอียดเล็กน้อย",
            "Tell us a little about your event.",
          )}
        </h2>
      </div>
      <div className="form-grid">
        <label>
          {t("ชื่อผู้ติดต่อ", "Your name")} *
          <input
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={120}
            placeholder={t("ชื่อของคุณ", "Full name")}
          />
        </label>
        <label>
          {t("เบอร์โทรศัพท์", "Phone")} *
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            minLength={6}
            maxLength={40}
            placeholder="08x xxx xxxx"
          />
        </label>
        <label>
          {t("ประเภทงาน", "Event type")} *
          <select name="eventType" required defaultValue={selectedService}>
            <option value="" disabled>
              {t("เลือกประเภทงาน", "Select event type")}
            </option>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.title}
              </option>
            ))}
            <option value="other">
              {t("อื่น ๆ / ยังไม่แน่ใจ", "Other / Not sure yet")}
            </option>
          </select>
        </label>
        <label>
          {t("วันที่จัดงานโดยประมาณ", "Tentative date")}
          <input type="date" name="eventDate" />
        </label>
        <label>
          {t("สถานที่ / จังหวัด", "Venue / Province")}
          <input
            name="location"
            maxLength={200}
            placeholder={t("เช่น ขอนแก่น", "e.g. Khon Kaen")}
          />
        </label>
        <label>
          {t("จำนวนผู้ร่วมงาน", "Expected guests")}
          <input
            name="guests"
            type="number"
            min="1"
            max="1000000"
            placeholder="100"
          />
        </label>
        <label className="span-two">
          {t("งบประมาณโดยประมาณ", "Estimated budget")}
          <select name="budget">
            <option value="undecided">
              {t("ต้องการคำแนะนำ", "I would like advice")}
            </option>
            <option value="under-100k">
              {t("ต่ำกว่า 100,000 บาท", "Below THB 100,000")}
            </option>
            <option value="100k-300k">100,000–300,000 THB</option>
            <option value="300k-500k">300,000–500,000 THB</option>
            <option value="500k-plus">500,000+ THB</option>
          </select>
        </label>
        <label className="span-two">
          {t("เล่างานที่คุณคิดไว้", "What do you have in mind?")} *
          <textarea
            name="message"
            rows={4}
            minLength={10}
            maxLength={5000}
            required
            placeholder={t(
              "เป้าหมาย รูปแบบงาน หรือสิ่งที่อยากให้เราช่วยดูแล…",
              "Your goals, ideas or the details you would like us to handle…",
            )}
          />
        </label>
      </div>
      <div className="honeypot" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="check-label">
        <input name="consent" type="checkbox" required />
        <span>
          {t(
            "ยินยอมให้ใช้ข้อมูลเพื่อติดต่อเกี่ยวกับงาน ตาม",
            "I agree to be contacted about this event under the ",
          )}{" "}
          <Link href={`/${l}/privacy`}>
            {t("นโยบายความเป็นส่วนตัว", "privacy notice")}
          </Link>
        </span>
      </label>
      {state === "error" && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      <button disabled={state === "sending"} className="button">
        {state === "sending" ? (
          <LoaderCircle className="spin" size={18} />
        ) : (
          <ArrowUpRight size={18} />
        )}{" "}
        {state === "sending"
          ? t("กำลังส่ง…", "Sending…")
          : t("ส่งรายละเอียดงาน", "Send your brief")}
      </button>
    </form>
  );
}
