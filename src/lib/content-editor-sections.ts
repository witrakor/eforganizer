import type { Content } from "./types";
import { serviceCategory } from "./service-catalog";
export type EditorSection = {
  id: string;
  label: string;
  description: string;
  keys?: string[];
  listKind?: Content["kind"];
};
export function contentEditorSections(item: Content): EditorSection[] {
  const page = item.kind === "page";
  const directory = page && ["services", "work", "journal"].includes(item.slug);
  const about = page && item.slug === "about";
  const contact = page && item.slug === "contact";
  const detail = !page;
  const sections: EditorSection[] = [
    {
      id: "intro",
      label: "ข้อความเปิดหน้า",
      description: "หัวข้อและคำแนะนำที่ผู้เข้าชมเห็นเมื่อเปิดหน้า",
    },
  ];
  if (detail || about)
    sections.push({
      id: "cover",
      label: "ภาพหลัก",
      description: "รูปหลักของหน้าและภาพปกที่ใช้แนะนำเนื้อหา",
    });
  if (directory)
    sections.push({
      id: "listing",
      label: {
        services: "รายการบริการ",
        work: "รายการผลงาน",
        journal: "รายการบทความ",
      }[item.slug]!,
      description:
        "หน้าเว็บดึงรายการที่เผยแพร่มาแสดงอัตโนมัติ กดการ์ดเพื่อแก้ไขเนื้อหาแต่ละรายการ",
      listKind: { services: "service", work: "project", journal: "post" }[
        item.slug
      ] as Content["kind"],
    });
  if (contact)
    sections.push({
      id: "contact",
      label: "ช่องทางติดต่อ",
      description: "โทรศัพท์ ที่อยู่ และ Facebook ที่แสดงข้างแบบฟอร์ม",
      keys: ["phone", "address", "facebook"],
    });
  if (
    !directory &&
    !contact &&
    !(item.kind === "service" && serviceCategory(item.slug))
  )
    sections.push({
      id: "body",
      label: about ? "เรื่องราวและแนวทางทำงาน" : "เนื้อหา",
      description: "เนื้อหาหลักของหน้า รองรับหัวข้อ ข้อความ ลิงก์ และรูปภาพ",
    });
  if (item.kind === "project")
    sections.push({
      id: "facts",
      label: "ข้อมูลผลงาน",
      description: "ลูกค้า สถานที่ บทบาทและผลลัพธ์ที่แสดงในรายละเอียดผลงาน",
      keys: ["client", "venue", "role", "outcome"],
    });
  if (detail || about)
    sections.push({
      id: "items",
      label:
        item.kind === "service"
          ? "ขอบเขตบริการ"
          : about
            ? "แนวทางทำงาน"
            : "สิ่งที่ทีมดูแล",
      description: "รายการสั้น ๆ ที่แสดงในส่วนรายละเอียดของหน้า",
    });
  if (detail || about)
    sections.push({
      id: "gallery",
      label: "แกลเลอรี",
      description: "ภาพประกอบส่วนล่างของหน้า เพิ่ม ลบ และจัดลำดับภาพได้",
    });
  if (item.kind === "project" || item.kind === "post")
    sections.push({
      id: "sources",
      label: "วันที่และแหล่งข้อมูล",
      description: "วันที่จัดงานและลิงก์ต้นฉบับที่ใช้ประกอบเนื้อหา",
    });
  if (item.kind === "service")
    sections.push({
      id: "related",
      label: "ผลงานที่เกี่ยวข้อง",
      description:
        "ผลงานที่เผยแพร่และเลือกหมวดบริการนี้จะแสดงท้ายหน้าบริการโดยอัตโนมัติ",
      listKind: "project",
    });
  sections.push({
    id: "seo",
    label: "SEO",
    description: "หัวข้อและคำอธิบายสำหรับผลการค้นหา",
  });
  return sections;
}
