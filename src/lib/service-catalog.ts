import type { Content, Locale, Translation } from "./types";

type ServiceCategory = {
  slug: string;
  sketch: number;
  image: string;
  th: { title: string; examples: string; description: string; items: string[] };
  en: { title: string; examples: string; description: string; items: string[] };
};

export type ServiceMenuItem = {
  slug: string;
  sketch: number;
  th: { title: string; examples: string };
  en: { title: string; examples: string };
};

const specialistMenu: Record<
  string,
  { sketch: number; th: string; en: string }
> = {
  "professional-emcee": {
    sketch: 8,
    th: "พิธีกรงานแต่ง · พิธีกรอีเวนต์ · ดำเนินรายการ",
    en: "Wedding MC · Event host · Stage programme",
  },
  "wedding-day-coordination": {
    sketch: 9,
    th: "รันคิวพิธี · ประสานทีม · ดูแลวันงาน",
    en: "Ceremony cues · Team coordination · On-site care",
  },
  "sports-events": {
    sketch: 10,
    th: "พิธีเปิดกีฬา · งานวิ่ง · กิจกรรมมวลชน",
    en: "Sports ceremonies · Runs · Public events",
  },
};

const generatedCoverSlugs = new Set([
  "meetings-conferences",
  "corporate-celebrations",
  "ceremonies-launches",
  "ceremonies-awards",
  "exhibitions-activations",
  "weddings-private-events",
  "team-activities-sports",
  "special-events",
  "professional-emcee",
  "wedding-day-coordination",
  "sports-events",
]);

export function serviceCover(slug: string) {
  return generatedCoverSlugs.has(slug)
    ? `/media/service-covers/${slug}.png`
    : null;
}

export const serviceCategories: ServiceCategory[] = [
  {
    slug: "meetings-conferences",
    sketch: 0,
    image: "/media/conference.webp",
    th: {
      title: "งานประชุมและสัมมนา",
      examples: "ประชุมองค์กร · สัมมนา · เวิร์กช็อป",
      description:
        "ออกแบบพื้นที่สำหรับการแลกเปลี่ยนความรู้และการตัดสินใจ พร้อมดูแลลำดับงานให้ทุกฝ่ายทำงานร่วมกันได้ราบรื่น",
      items: [
        "ประชุมองค์กรและ Town Hall",
        "สัมมนา เสวนา และเวิร์กช็อป",
        "ระบบลงทะเบียนและต้อนรับผู้ร่วมงาน",
        "ประสานวิทยากร เวที และลำดับรายการ",
      ],
    },
    en: {
      title: "Meetings & conferences",
      examples: "Company meetings · Seminars · Workshops",
      description:
        "Thoughtfully run spaces for sharing ideas and making decisions, with every part of the programme working together.",
      items: [
        "Company meetings and town halls",
        "Seminars, panels and workshops",
        "Registration and guest welcome",
        "Speaker, stage and programme coordination",
      ],
    },
  },
  {
    slug: "corporate-celebrations",
    sketch: 4,
    image: "/media/corporate.webp",
    th: {
      title: "งานเลี้ยงและสังสรรค์",
      examples: "งานปีใหม่ · Gala Dinner · งานครบรอบ",
      description:
        "สร้างบรรยากาศแห่งการพบปะและเฉลิมฉลอง ให้แขกได้มีส่วนร่วมและเจ้าภาพได้อยู่กับช่วงเวลาสำคัญ",
      items: [
        "งานปีใหม่และงานเลี้ยงองค์กร",
        "Gala Dinner และงานขอบคุณลูกค้า",
        "งานครบรอบและฉลองความสำเร็จ",
        "วางลำดับกิจกรรมและดูแลหน้างาน",
      ],
    },
    en: {
      title: "Celebrations & parties",
      examples: "Year-end parties · Gala dinners · Anniversaries",
      description:
        "Bring people together to celebrate shared milestones, with a welcoming atmosphere and a well-paced programme.",
      items: [
        "Year-end and company parties",
        "Gala dinners and client appreciation",
        "Anniversaries and milestones",
        "Programme planning and on-site coordination",
      ],
    },
  },
  {
    slug: "ceremonies-launches",
    sketch: 6,
    image: "/media/ceremony.webp",
    th: {
      title: "งานเปิดตัวและกิจกรรมแบรนด์",
      examples: "เปิดตัวสินค้า · แถลงข่าว · Roadshow",
      description:
        "เปลี่ยนเรื่องราวของแบรนด์ให้เป็นช่วงเวลาที่ผู้คนเข้าถึงได้ ตั้งแต่การเปิดตัวบนเวทีจนถึงประสบการณ์ในพื้นที่งาน",
      items: [
        "เปิดตัวสินค้าและโครงการ",
        "งานแถลงข่าวและกิจกรรมสื่อ",
        "Roadshow และกิจกรรมแบรนด์",
        "ประสานเวที พิธีกร และทีมหน้างาน",
      ],
    },
    en: {
      title: "Launches & brand events",
      examples: "Product launches · Press events · Roadshows",
      description:
        "Bring a brand story to life through a launch, a stage moment and an experience guests can take part in.",
      items: [
        "Product and project launches",
        "Press events and media activities",
        "Roadshows and brand events",
        "Stage, emcee and on-site coordination",
      ],
    },
  },
  {
    slug: "ceremonies-awards",
    sketch: 3,
    image: "/media/ceremony.webp",
    th: {
      title: "งานพิธีการและมอบรางวัล",
      examples: "พิธีเปิด · ลงนาม MOU · มอบรางวัล",
      description:
        "ดูแลพิธีการให้ถูกจังหวะและเหมาะกับโอกาสสำคัญ โดยคำนึงถึงลำดับพิธี แขกสำคัญ และผู้ร่วมงาน",
      items: [
        "พิธีเปิดและพิธีปิด",
        "พิธีลงนามและงานรับรอง",
        "งานมอบรางวัลและเชิดชูเกียรติ",
        "รันคิว พิธีกร และประสานแขกสำคัญ",
      ],
    },
    en: {
      title: "Ceremonies & awards",
      examples: "Openings · Signings · Awards",
      description:
        "Careful protocol and timing for significant moments, with attention to the programme, honoured guests and everyone attending.",
      items: [
        "Opening and closing ceremonies",
        "Signings and formal receptions",
        "Awards and recognition events",
        "Cueing, emcees and guest coordination",
      ],
    },
  },
  {
    slug: "exhibitions-activations",
    sketch: 2,
    image: "/media/festival.webp",
    th: {
      title: "นิทรรศการและงานแสดงสินค้า",
      examples: "งานแฟร์ · Open House · Showcase",
      description:
        "ออกแบบเส้นทางการชมงานและกิจกรรมในพื้นที่ เพื่อให้เรื่องราวขององค์กรหรือสินค้าเข้าถึงผู้ร่วมงานได้ชัดเจน",
      items: [
        "นิทรรศการและงานแสดงสินค้า",
        "Open House และ Showcase",
        "กิจกรรมบนเวทีและในบูธ",
        "ลงทะเบียน ต้อนรับ และดูแลการไหลของผู้ร่วมงาน",
      ],
    },
    en: {
      title: "Exhibitions & trade shows",
      examples: "Fairs · Open houses · Showcases",
      description:
        "Shape the visitor journey and activities around the space, so people can connect with the story behind a product or organization.",
      items: [
        "Exhibitions and trade shows",
        "Open houses and showcases",
        "Stage and booth activities",
        "Registration, welcome and visitor flow",
      ],
    },
  },
  {
    slug: "weddings-private-events",
    sketch: 1,
    image: "/media/wedding.webp",
    th: {
      title: "งานแต่งงานและงานส่วนตัว",
      examples: "งานหมั้น · งานแต่ง · งานฉลองครอบครัว",
      description:
        "วางแผนวันสำคัญให้สะท้อนตัวตนของคุณ พร้อมทีมดูแลพิธีและรายละเอียด เพื่อให้คุณได้ใช้เวลากับคนที่รักอย่างเต็มที่",
      items: [
        "งานหมั้นและพิธีแต่งงาน",
        "งานฉลองมงคลสมรส",
        "งานเลี้ยงส่วนตัวและงานครอบครัว",
        "ประสานพิธีกร รันคิว และทีมหน้างาน",
      ],
    },
    en: {
      title: "Weddings & private events",
      examples: "Engagements · Weddings · Family celebrations",
      description:
        "Plan a personal occasion that feels like you, with a team caring for the ceremony and details while you enjoy the people around you.",
      items: [
        "Engagement and wedding ceremonies",
        "Wedding receptions",
        "Private and family celebrations",
        "Emcee, cue and on-site coordination",
      ],
    },
  },
  {
    slug: "team-activities-sports",
    sketch: 7,
    image: "/media/festival-team.webp",
    th: {
      title: "กิจกรรมองค์กรและงานกีฬา",
      examples: "Team Building · Outing · งานวิ่ง",
      description:
        "สร้างกิจกรรมที่ชวนทุกคนมีส่วนร่วม ตั้งแต่การเตรียมพื้นที่และกำหนดการ ไปจนถึงการดูแลผู้เข้าร่วมตลอดวัน",
      items: [
        "Team Building และ Outing",
        "กิจกรรมพนักงานและชุมชน",
        "งานวิ่งและกิจกรรมกีฬา",
        "ลงทะเบียน ดูแลฐานกิจกรรม และรันคิว",
      ],
    },
    en: {
      title: "Team activities & sports",
      examples: "Team building · Outings · Running events",
      description:
        "Create activities people can join in, from planning the space and schedule to looking after participants throughout the day.",
      items: [
        "Team building and outings",
        "Employee and community activities",
        "Runs and sports events",
        "Registration, activity stations and cueing",
      ],
    },
  },
  {
    slug: "special-events",
    sketch: 5,
    image: "/media/pageant.webp",
    th: {
      title: "งานเทศกาลและงานประกวด",
      examples: "งานเทศกาล · งานประกวด · กิจกรรมชุมชน",
      description:
        "เชื่อมกิจกรรมหน้าเวทีและเบื้องหลังให้เป็นงานเดียวกัน พร้อมดูแลผู้แสดง ผู้เข้าประกวด และผู้ชม",
      items: [
        "เทศกาลและกิจกรรมวัฒนธรรม",
        "งานประกวดและแฟชั่นโชว์",
        "การแสดงและกิจกรรมเวที",
        "ประสานผู้เข้าร่วม พิธีกร และทีมหลังเวที",
      ],
    },
    en: {
      title: "Festivals & competitions",
      examples: "Festivals · Competitions · Community events",
      description:
        "Connect what happens on stage and backstage, caring for performers, participants and audiences alike.",
      items: [
        "Festivals and cultural events",
        "Competitions and fashion shows",
        "Performances and stage activities",
        "Participant, emcee and backstage coordination",
      ],
    },
  },
];

export function serviceCategory(slug: string) {
  return serviceCategories.find((category) => category.slug === slug);
}

export function serviceMenuItems(services: Content[]): ServiceMenuItem[] {
  const known = new Set(serviceCategories.map((category) => category.slug));
  const extra = services.filter((service) => !known.has(service.slug));
  return [
    ...serviceCategories,
    ...extra.map((service) => {
      const specialist = specialistMenu[service.slug];
      return {
        slug: service.slug,
        sketch: specialist?.sketch ?? 11,
        th: {
          title: service.th.title,
          examples:
            specialist?.th || service.th.subtitle || service.th.description,
        },
        en: {
          title: service.en.title,
          examples:
            specialist?.en || service.en.subtitle || service.en.description,
        },
      };
    }),
  ];
}

export function catalogServices(services: Content[]): Content[] {
  return serviceCategories.map((category, index) => {
    const existing = services.find((service) => service.slug === category.slug);
    const translation = (locale: Locale): Translation => ({
      title: category[locale].title,
      subtitle: category[locale].examples,
      description: category[locale].description,
      body: existing?.[locale].body || "",
      eyebrow: "EVENTS WE CREATE",
      seoTitle: category[locale].title,
      seoDescription: category[locale].description,
      items: category[locale].items,
    });
    return {
      id: existing?.id || `service-${category.slug}`,
      kind: "service" as const,
      slug: category.slug,
      status: "published" as const,
      image: existing?.image || category.image,
      gallery: existing?.gallery || [],
      category: "",
      featured: false,
      sortOrder: index,
      date: existing?.date || "2026-10-01",
      ...existing,
      th: translation("th"),
      en: translation("en"),
    };
  });
}
