import { z } from "zod";
import { homeSections } from "./home-content";
const safeImage = z
  .string()
  .max(500)
  .refine(
    (v) =>
      v === "" || /^\/(media\/[a-zA-Z0-9_.-]+|api\/media\/[a-f0-9-]+)$/.test(v),
    "Choose a file from the media library",
  );
const tr = z
  .object({
    title: z.string().max(200),
    subtitle: z.string().max(300),
    description: z.string().max(2000),
    body: z.string().max(60000),
    eyebrow: z.string().max(120),
    seoTitle: z.string().max(200),
    seoDescription: z.string().max(500),
    items: z.array(z.string().max(1000)).max(30),
  })
  .catchall(
    z.union([z.string().max(10000), z.array(z.string().max(1000)).max(30)]),
  );
export const contentSchema = z
  .object({
    id: z.string().uuid(),
    kind: z.enum(["page", "service", "project", "post"]),
    slug: z
      .string()
      .min(1)
      .max(160)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    status: z.enum(["draft", "published"]),
    image: safeImage,
    coverOverride: z.boolean().optional(),
    imageFocal: z
      .object({
        x: z.number().min(0).max(100),
        y: z.number().min(0).max(100),
      })
      .optional(),
    gallery: z.array(safeImage).max(30),
    category: z.string().max(100),
    featured: z.boolean(),
    sortOrder: z.number().int().min(0).max(9999),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    eventDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    eventDateEnd: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    hidePublicDate: z.boolean().optional(),
    eventDateStatus: z.enum(["unknown", "conflict"]).optional(),
    eventDateReviewNote: z.string().max(1000).optional(),
    sources: z
      .array(
        z.object({
          url: z.url().refine((v) => v.startsWith("https://")),
          publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          label: z.string().max(200),
        }),
      )
      .max(30)
      .optional(),
    th: tr,
    en: tr,
    version: z.number().int().optional(),
    sections: z
      .array(z.object({ id: z.enum(homeSections), enabled: z.boolean() }))
      .max(10)
      .refine(
        (v) => new Set(v.map((s) => s.id)).size === v.length,
        "Section IDs must be unique",
      )
      .optional(),
    selections: z
      .object({
        service: z.array(z.string().uuid()).max(12).optional(),
        project: z.array(z.string().uuid()).max(12).optional(),
        post: z.array(z.string().uuid()).max(12).optional(),
      })
      .optional(),
    heroSlides: z
      .array(
        z
          .object({
            contentId: z.string().uuid().optional(),
            contentKind: z.enum(["project", "post"]).optional(),
            projectId: z.string().uuid().optional(),
            image: safeImage.refine((v) => !!v, "เลือกภาพสำหรับสไลด์"),
            x: z.number().min(0).max(100),
            y: z.number().min(0).max(100),
            mobileX: z.number().min(0).max(100),
            mobileY: z.number().min(0).max(100),
          })
          .refine(
            (slide) => Boolean(slide.contentId || slide.projectId),
            "เลือกผลงานหรือบทความสำหรับสไลด์",
          ),
      )
      .max(6)
      .optional(),
    relationships: z
      .array(
        z
          .object({
            id: z.string().uuid(),
            kind: z.enum(["client", "partner", "testimonial"]),
            image: safeImage,
            href: z
              .string()
              .max(500)
              .refine(
                (v) =>
                  !v ||
                  /^https:\/\/[^\s]+$/.test(v) ||
                  /^\/(th|en)\/[a-z0-9/?=&%-]+$/.test(v),
                "ใช้ HTTPS หรือลิงก์ภายในเว็บไซต์",
              ),
            published: z.boolean(),
            th: z.object({
              name: z.string().max(200),
              detail: z.string().max(2000),
            }),
            en: z.object({
              name: z.string().max(200),
              detail: z.string().max(2000),
            }),
          })
          .refine(
            (v) => !v.published || (!!v.th.name.trim() && !!v.en.name.trim()),
            "ใส่ชื่อทั้งสองภาษาก่อนแสดงรายการ",
          ),
      )
      .max(100)
      .optional(),
  })
  .superRefine((v, ctx) => {
    if (v.status === "published" && v.kind !== "page" && !v.image)
      ctx.addIssue({ code: "custom", message: "กรุณาเลือกภาพหลักก่อนเผยแพร่" });
    if (v.status === "published" && (!v.th.title.trim() || !v.en.title.trim()))
      ctx.addIssue({
        code: "custom",
        message: "กรุณาใส่หัวข้อทั้งภาษาไทยและอังกฤษก่อนเผยแพร่",
      });
  });
export const inquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().max(254),
  phone: z.string().trim().min(6).max(40),
  eventType: z.string().min(1).max(100),
  eventDate: z.string().max(30),
  location: z.string().max(200),
  guests: z.string().max(40),
  budget: z.string().max(100),
  message: z.string().trim().min(10).max(5000),
  locale: z.enum(["th", "en"]),
  consent: z.literal(true),
  website: z.string().max(200).optional(),
});
