export function bangkokDate(value: string) {
  const date = new Date(
    value.includes("T") ? value : value.replace(" ", "T") + "Z",
  );
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("th-TH", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Bangkok",
      }).format(date);
}
export function contentDate(value: string, locale: "th" | "en") {
  return new Intl.DateTimeFormat(locale === "th" ? "th-TH" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Bangkok",
  }).format(new Date(`${value}T12:00:00+07:00`));
}

export function eventDateStatusLabel(
  status: "unknown" | "conflict",
  locale: "th" | "en",
) {
  if (status === "conflict")
    return locale === "th" ? "วันที่งานรอตรวจสอบ" : "Event date needs review";
  return locale === "th" ? "ยังไม่ระบุวันที่งาน" : "Event date unknown";
}
