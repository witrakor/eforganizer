import type { Content, Locale } from "./types";

type Copy = { title: string; description: string };
type BilingualCopy = Record<Locale, Copy>;

const pages: Record<string, BilingualCopy> = {
  home: {
    th: {
      title: "รับจัดงานอีเวนต์ ขอนแก่น",
      description:
        "Elite Flow วางแผนและดูแลงานอีเวนต์ในขอนแก่น ทั้งงานประชุม กิจกรรมองค์กร งานเปิดตัว และงานแต่ง ประสานทีมและดูแลรายละเอียดตั้งแต่เริ่มจนจบงาน",
    },
    en: {
      title: "Event Planning & Management in Khon Kaen",
      description:
        "Elite Flow plans and coordinates events in Khon Kaen, including conferences, corporate gatherings, launches and weddings, from the first brief through event day.",
    },
  },
  about: {
    th: {
      title: "รู้จักทีมจัดงานอีเวนต์ขอนแก่น",
      description:
        "รู้จักทีม Elite Flow และแนวทางทำงานของเรา ตั้งแต่รับฟังเป้าหมาย วางแผน ประสานผู้เกี่ยวข้อง ไปจนถึงดูแลจังหวะของงานในวันจริง",
    },
    en: {
      title: "About Our Khon Kaen Event Team",
      description:
        "Meet the Elite Flow team and see how we listen, plan and coordinate the people and details behind conferences, corporate events and celebrations.",
    },
  },
  services: {
    th: {
      title: "บริการจัดงานอีเวนต์และพิธีกร ขอนแก่น",
      description:
        "สำรวจบริการของ Elite Flow ทั้งงานประชุม กิจกรรมองค์กร งานเปิดตัว งานแต่ง ทีมรันคิว และพิธีกรในขอนแก่น เลือกขอบเขตงานที่เหมาะกับคุณ",
    },
    en: {
      title: "Event Planning & MC Services in Khon Kaen",
      description:
        "Explore Elite Flow services for conferences, corporate events, launches, weddings, event coordination and professional hosting in Khon Kaen.",
    },
  },
  work: {
    th: {
      title: "ผลงานและภาพบรรยากาศงาน",
      description:
        "ชมภาพและเรื่องราวจากงานประชุม กิจกรรมองค์กร งานพิธี งานพิเศษ และงานแต่งที่ทีม Elite Flow ได้มีส่วนร่วม พร้อมบทบาทของทีมในแต่ละงาน",
    },
    en: {
      title: "Event Portfolio & Real Moments",
      description:
        "Browse conferences, corporate events, ceremonies, community programmes and weddings that the Elite Flow team has contributed to, with photos and project stories.",
    },
  },
  journal: {
    th: {
      title: "บทความและเช็กลิสต์เตรียมงานอีเวนต์",
      description:
        "อ่านแนวทางเตรียมงานประชุม กิจกรรมองค์กร งานอีเวนต์ และงานแต่งจาก Elite Flow ตั้งแต่ทำบรีฟ วางกำหนดการ จนถึงเช็กความพร้อมก่อนวันจริง",
    },
    en: {
      title: "Event Planning Guides & Checklists",
      description:
        "Read practical Elite Flow guides on conferences, corporate events, weddings, event briefs, running orders and final checks before event day.",
    },
  },
  contact: {
    th: {
      title: "ติดต่อทีมจัดงานอีเวนต์ ขอนแก่น",
      description:
        "มีแผนจัดงานประชุม กิจกรรมองค์กร งานเปิดตัว หรืองานแต่งในขอนแก่น? ติดต่อ Elite Flow เพื่อเล่าโจทย์ วันจัดงาน และรายละเอียดที่อยากให้ทีมช่วยดูแล",
    },
    en: {
      title: "Contact Our Khon Kaen Event Team",
      description:
        "Planning a conference, corporate event, launch or wedding in Khon Kaen? Tell Elite Flow about your ideas, date and the support you need.",
    },
  },
  privacy: {
    th: {
      title: "นโยบายความเป็นส่วนตัว",
      description:
        "อ่านวิธีที่ Elite Flow รับ ใช้ และจัดเก็บข้อมูลจากแบบฟอร์มติดต่อ รวมถึงวิธีสอบถาม ขอแก้ไข หรือขอลบข้อมูลส่วนบุคคล",
    },
    en: {
      title: "Privacy Policy",
      description:
        "Learn how Elite Flow receives, uses and stores information sent through the inquiry form, and how to request a correction or deletion.",
    },
  },
};

const services: Record<string, BilingualCopy> = {
  "meetings-conferences": {
    th: {
      title: "จัดงานประชุมและสัมมนา ขอนแก่น",
      description:
        "วางแผนงานประชุม สัมมนา และเวิร์กช็อปกับ Elite Flow ดูแลลำดับงาน การลงทะเบียน วิทยากร และการประสานทีมในขอนแก่น",
    },
    en: {
      title: "Conference & Seminar Planning in Khon Kaen",
      description:
        "Plan meetings, seminars and workshops with Elite Flow, including schedules, registration, speakers and on-site team coordination in Khon Kaen.",
    },
  },
  "ceremonies-launches": {
    th: {
      title: "จัดงานพิธีการและเปิดตัว ขอนแก่น",
      description:
        "ดูแลพิธีเปิด งานเปิดตัว และกิจกรรมองค์กรกับ Elite Flow วางลำดับพิธี ประสานแขกสำคัญ ทีมเวที และรายละเอียดหน้างาน",
    },
    en: {
      title: "Ceremonies & Product Launches in Khon Kaen",
      description:
        "Coordinate opening ceremonies, launches and formal programmes with Elite Flow, from the running order and invited guests to stage and venue teams.",
    },
  },
  "corporate-celebrations": {
    th: {
      title: "จัดงานเลี้ยงและกิจกรรมองค์กร ขอนแก่น",
      description:
        "ออกแบบและประสานงานเลี้ยงองค์กร งานขอบคุณทีม และกิจกรรมสร้างความสัมพันธ์ ให้กำหนดการและบรรยากาศตอบโจทย์ผู้ร่วมงาน",
    },
    en: {
      title: "Corporate Parties & Team Events in Khon Kaen",
      description:
        "Plan corporate celebrations, team gatherings and appreciation events with Elite Flow, with a programme shaped around your people and goals.",
    },
  },
  "exhibitions-activations": {
    th: {
      title: "นิทรรศการและกิจกรรมแบรนด์ ขอนแก่น",
      description:
        "วางรูปแบบนิทรรศการและกิจกรรมแบรนด์กับ Elite Flow ประสานพื้นที่ ทีมงาน และประสบการณ์ที่ช่วยให้ผู้เข้าร่วมมีส่วนร่วม",
    },
    en: {
      title: "Exhibitions & Brand Activations in Khon Kaen",
      description:
        "Shape exhibitions and brand activations with Elite Flow, coordinating the space, teams and visitor experience around your story.",
    },
  },
  "weddings-private-events": {
    th: {
      title: "จัดงานแต่งและงานส่วนตัว ขอนแก่น",
      description:
        "วางแผนงานแต่งและงานฉลองส่วนตัวกับ Elite Flow ดูแลรูปแบบพิธี ช่วงฉลอง แขก และทีมที่เกี่ยวข้องให้วันสำคัญเป็นอย่างที่ตั้งใจ",
    },
    en: {
      title: "Wedding & Private Event Planning in Khon Kaen",
      description:
        "Plan a wedding or private celebration with Elite Flow, coordinating the ceremony, reception, guests and suppliers around the day you envision.",
    },
  },
  "wedding-day-coordination": {
    th: {
      title: "ทีมรันคิวและดูแลวันแต่งงาน ขอนแก่น",
      description:
        "ทีมรันคิววันแต่งงานของ Elite Flow ช่วยประสานครอบครัว พิธีกร ช่างภาพ สถานที่ และผู้ให้บริการให้แต่ละช่วงของงานดำเนินต่อเนื่อง",
    },
    en: {
      title: "Wedding Day Coordination in Khon Kaen",
      description:
        "Elite Flow coordinates the wedding day schedule, families, MC, photographers, venue and suppliers so each part of the celebration can flow.",
    },
  },
  "professional-emcee": {
    th: {
      title: "พิธีกรงานแต่งและอีเวนต์ ขอนแก่น",
      description:
        "พิธีกรงานแต่งและอีเวนต์จาก Elite Flow ดูแลลำดับพิธี สื่อสารกับทีมรันคิว และเชื่อมบรรยากาศกับผู้ร่วมงานในขอนแก่น",
    },
    en: {
      title: "Wedding & Event MC in Khon Kaen",
      description:
        "Find a wedding or event MC who understands the running order, works with the coordination team and connects with guests in Khon Kaen.",
    },
  },
  "sports-events": {
    th: {
      title: "พิธีการงานกีฬาและกิจกรรมมวลชน",
      description:
        "ประสานลำดับพิธี เวที และทีมที่เกี่ยวข้องในงานวิ่ง งานกีฬา และกิจกรรมที่มีผู้เข้าร่วมจำนวนมาก ให้ช่วงสำคัญสอดคล้องกับภาพรวมงาน",
    },
    en: {
      title: "Sports Event Ceremony Coordination",
      description:
        "Coordinate ceremony timing, stage cues and teams for races, sports events and public programmes as part of the wider event schedule.",
    },
  },
  "special-events": {
    th: {
      title: "งานประกวดและกิจกรรมพิเศษ ขอนแก่น",
      description:
        "Elite Flow ช่วยประสานกิจกรรมผู้เข้าประกวด ทีมเบื้องหลัง และลำดับงานตามขอบเขตที่ผู้จัดกำหนด สำหรับงานประกวดและกิจกรรมพิเศษ",
    },
    en: {
      title: "Pageants & Special Event Coordination",
      description:
        "Elite Flow supports contestant activities, backstage teams and programme coordination for pageants and special events within the organiser’s scope.",
    },
  },
};

const posts: Record<string, BilingualCopy> = {
  "a-better-event-brief": {
    th: {
      title: "วิธีเขียนบรีฟจัดงานให้ชัดเจน",
      description:
        "เริ่มวางแผนอีเวนต์ด้วยบรีฟ 6 เรื่องสำคัญ: เป้าหมาย ผู้เข้าร่วม สถานที่ งบประมาณ สิ่งที่ต้องมี และผู้ตัดสินใจ",
    },
    en: {
      title: "How to Write a Clear Event Brief",
      description:
        "Start event planning with a six point brief covering goals, guests, venue, budget, essentials and the people making decisions.",
    },
  },
  "chinese-tea-ceremony-coordination": {
    th: {
      title: "เตรียมพิธียกน้ำชาให้ราบรื่น",
      description:
        "แนวทางเตรียมพิธียกน้ำชา ตั้งแต่ลำดับผู้ใหญ่ ที่นั่ง อุปกรณ์ ไปจนถึงการประสานช่างภาพ เพื่อให้พิธีดำเนินอย่างเคารพธรรมเนียม",
    },
    en: {
      title: "How to Coordinate a Chinese Tea Ceremony",
      description:
        "Prepare a Chinese tea ceremony by planning family order, seating, ceremony items and photography around the couple’s customs.",
    },
  },
  "conference-preparation": {
    th: {
      title: "เช็กลิสต์เตรียมงานประชุมและสัมมนา",
      description:
        "เช็กเส้นทางผู้เข้าร่วม การลงทะเบียน วิทยากร และทีมเทคนิคก่อนวันประชุม เพื่อให้ทุกฝ่ายพร้อมตั้งแต่เริ่มจนจบงาน",
    },
    en: {
      title: "Conference Preparation Checklist",
      description:
        "Check the guest journey, registration, speaker briefings and technical coordination before your conference or seminar begins.",
    },
  },
  "engagement-ceremony-running-order": {
    th: {
      title: "จัดลำดับพิธีหมั้นหลายช่วง",
      description:
        "วางกำหนดการพิธีหมั้นให้ชัดเจน แยกขั้นตอน ผู้รับผิดชอบ และอุปกรณ์สำหรับช่วงสู่ขอ สินสอด และสวมแหวน",
    },
    en: {
      title: "Plan an Engagement Ceremony Running Order",
      description:
        "Map the stages, people and ceremony items for the proposal, gifts and ring exchange so the family celebration follows your customs.",
    },
  },
  "khan-maak-procession-cues": {
    th: {
      title: "เตรียมขบวนขันหมากและคิวพิธี",
      description:
        "กำหนดจุดรวมพล ลำดับขบวน จุดรอ และสัญญาณกับพิธีกร เพื่อให้ขบวนขันหมากสนุกและดำเนินไปอย่างปลอดภัย",
    },
    en: {
      title: "Plan a Khan Maak Procession",
      description:
        "Set a meeting point, procession order, waiting areas and MC cues for a joyful and well coordinated khan maak ceremony.",
    },
  },
  "reception-moments-and-cues": {
    th: {
      title: "วางคิวงานฉลองมงคลสมรส",
      description:
        "ประสานพิธีกร ทีมรันคิว ดนตรี และช่างภาพ ให้ช่วงสำคัญของงานฉลองต่อเนื่องโดยไม่ทำให้แขกรู้สึกเร่งรีบ",
    },
    en: {
      title: "Coordinate Wedding Reception Moments",
      description:
        "Bring the MC, cue caller, music and photographers into one reception schedule so the key moments flow without rushing guests.",
    },
  },
  "reception-readiness-check": {
    th: {
      title: "เช็กลิสต์ก่อนเปิดงานฉลอง",
      description:
        "ตรวจคน คิว พื้นที่ ดนตรี และระบบเทคนิคก่อนเชิญแขกเข้าห้องจัดเลี้ยง เพื่อให้งานฉลองเริ่มอย่างพร้อมเพรียง",
    },
    en: {
      title: "Wedding Reception Readiness Checklist",
      description:
        "Confirm the people, cues, venue, music and technical setup before guests enter the reception room.",
    },
  },
  "wedding-coordination-before-ceremony": {
    th: {
      title: "เช็กลิสต์ทีมรันคิวก่อนพิธีแต่งงาน",
      description:
        "ทวนกำหนดการ คนสำคัญ อุปกรณ์ พื้นที่ และจุดประสานงานก่อนแขกมาถึง เพื่อให้ทีมพร้อมเริ่มพิธีแต่งงาน",
    },
    en: {
      title: "Wedding Day Checklist Before the Ceremony",
      description:
        "Review the schedule, key people, ceremony items, spaces and contacts before guests arrive for the wedding.",
    },
  },
  "wedding-first-steps": {
    th: {
      title: "เริ่มวางแผนงานแต่งจากอะไรดี",
      description:
        "เริ่มวางแผนวันแต่งด้วยการคุยเรื่องบรรยากาศ แขก งบประมาณ และพิธีที่สำคัญกับทั้งคู่ ก่อนจัดลำดับการจองและเตรียมงาน",
    },
    en: {
      title: "First Steps in Wedding Planning",
      description:
        "Agree on the atmosphere, guest list, budget and ceremony that matter to you, then plan bookings and preparation in a practical order.",
    },
  },
};

const projectDescriptions: Record<string, Record<Locale, string>> = {
  "royal-enfield-khon-kaen-grand-opening": {
    th: "ชมภาพบรรยากาศงานเปิดตัว Royal Enfield Khon Kaen ทั้งเวที รถจักรยานยนต์ และผู้ร่วมงาน ผ่านแกลเลอรีผลงานของ Elite Flow",
    en: "Explore photos from the Royal Enfield Khon Kaen grand opening, including the stage, motorcycles and guests, in the Elite Flow portfolio.",
  },
  "beyond-food-expo-2025": {
    th: "ชมภาพบรรยากาศ Beyond Food Expo 2025 ในแกลเลอรีผลงานของ Elite Flow พร้อมภาพจากพื้นที่งานและกิจกรรมภายในงาน",
    en: "Browse the Beyond Food Expo 2025 gallery in the Elite Flow portfolio, with photos from the event space and programme.",
  },
  "christmas-2023-at-kku-agricultural-park": {
    th: "ชมภาพบรรยากาศงานคริสต์มาส 2566 ณ อุทยานเกษตร มหาวิทยาลัยขอนแก่น ผ่านแกลเลอรีผลงานของ Elite Flow",
    en: "Explore photos from the 2023 Christmas event at KKU Agricultural Park in the Elite Flow portfolio.",
  },
  "colley-group-event": {
    th: "ชมภาพกิจกรรมกลุ่มและเวทีงานคอลลี่ย์ ผ่านแกลเลอรีผลงานของ Elite Flow",
    en: "Browse photos of Colley group activities and the stage event in the Elite Flow portfolio.",
  },
  "econ-2024-event": {
    th: "ชมภาพบรรยากาศงาน ECON 2024 และกิจกรรมภายในงาน ผ่านแกลเลอรีผลงานของ Elite Flow",
    en: "Explore the ECON 2024 event gallery and moments from its programme in the Elite Flow portfolio.",
  },
  "econ28-graduation-2025": {
    th: "ชมภาพบรรยากาศงานแสดงความยินดีบัณฑิต ECON28 ปี 2025 ผ่านแกลเลอรีผลงานของ Elite Flow",
    en: "Browse photos from the ECON28 graduation celebration in 2025 in the Elite Flow portfolio.",
  },
  "khon-kaen-canvas-2026-press-event": {
    th: "ชมภาพเบื้องหลังงานแถลงข่าว Khon Kaen Canvas 2026 ผ่านแกลเลอรีผลงานของ Elite Flow",
    en: "Go behind the scenes of the Khon Kaen Canvas 2026 press event in the Elite Flow photo gallery.",
  },
  "khon-kaen-design-grand-opening-8th-anniversary": {
    th: "ชมภาพงานเปิดตัวและฉลองครบรอบ 8 ปี ขอนแก่นดีไซน์ ผ่านแกลเลอรีผลงานของ Elite Flow",
    en: "Browse photos from the Khon Kaen Design grand opening and eighth anniversary in the Elite Flow portfolio.",
  },
  "khon-kaen-marathon-2024": {
    th: "ชมภาพบรรยากาศขอนแก่นมาราธอน 2024 ผ่านแกลเลอรีผลงานของ Elite Flow",
    en: "Explore photos from Khon Kaen Marathon 2024 in the Elite Flow portfolio.",
  },
  "khon-kaen-marathon-2025": {
    th: "ชมภาพบรรยากาศขอนแก่นมาราธอน 2025 ผ่านแกลเลอรีผลงานของ Elite Flow",
    en: "Explore photos from Khon Kaen Marathon 2025 in the Elite Flow portfolio.",
  },
  "khon-kaen-marathon-2026-meet-and-greet": {
    th: "ชมภาพกิจกรรม Meet & Greet ขอนแก่นมาราธอน 2026 ผ่านแกลเลอรีผลงานของ Elite Flow",
    en: "Browse photos from the Khon Kaen Marathon 2026 Meet & Greet in the Elite Flow portfolio.",
  },
  "loy-krathong-chum-phae-2024": {
    th: "ชมภาพบรรยากาศงานลอยกระทงชุมแพ 2024 ผ่านแกลเลอรีผลงานของ Elite Flow",
    en: "Explore photos from the 2024 Loy Krathong celebration in Chum Phae in the Elite Flow portfolio.",
  },
  "mono-campus-backstage-2025": {
    th: "ชมภาพเบื้องหลังงาน Mono Campus 2025 ผ่านแกลเลอรีผลงานของ Elite Flow",
    en: "Go behind the scenes of Mono Campus 2025 with photos in the Elite Flow portfolio.",
  },
  "mor-phi-school-tour-khon-kaen-udon": {
    th: "ชมภาพกิจกรรม School Tour หมอผี ในขอนแก่นและอุดรธานี ผ่านแกลเลอรีผลงานของ Elite Flow",
    en: "Browse photos from the Mor Phi school tour in Khon Kaen and Udon Thani in the Elite Flow portfolio.",
  },
  "new-year-party-at-ban-phor-phan-2025": {
    th: "ชมภาพบรรยากาศปาร์ตี้ปีใหม่บ้านพอพาน 2025 ผ่านแกลเลอรีผลงานของ Elite Flow",
    en: "Explore photos from the 2025 New Year party at Ban Phor Phan in the Elite Flow portfolio.",
  },
  "roi-rak-thai-fabric-fashion-show": {
    th: "ชมภาพงานเดินแบบแฟชั่นโชว์ร้อยรักษ์ผ้าไทย ผ่านแกลเลอรีผลงานของ Elite Flow",
    en: "Browse the Roi Rak Thai fabric fashion show photo gallery in the Elite Flow portfolio.",
  },
  "royal-birthday-tribute-event-28-july-2025": {
    th: "ชมภาพงานถวายพระเกียรติเนื่องในโอกาสเฉลิมพระชนมพรรษา 28 กรกฎาคม 2568 ผ่านแกลเลอรีผลงานของ Elite Flow",
    en: "Browse photos from the Royal Birthday tribute event held on 28 July 2025 in the Elite Flow portfolio.",
  },
  "tee-yod-3-promotional-event-in-khon-kaen": {
    th: "ชมภาพกิจกรรมโปรโมตภาพยนตร์ ธี่หยด 3 ที่ขอนแก่น ผ่านแกลเลอรีผลงานของ Elite Flow",
    en: "Browse photos from the Tee Yod 3 promotional event in Khon Kaen in the Elite Flow portfolio.",
  },
  "tee-yod-4-school-tour-khon-kaen": {
    th: "ชมภาพกิจกรรม School Tour ธี่หยด 4 ในขอนแก่น ผ่านแกลเลอรีผลงานของ Elite Flow",
    en: "Explore photos from the Tee Yod 4 school tour in Khon Kaen in the Elite Flow portfolio.",
  },
  "thai-chinese-table-tennis-2025": {
    th: "ชมภาพการแข่งขันปิงปองเชื่อมความสัมพันธ์ไทย–จีน ปี 2025 ผ่านแกลเลอรีผลงานของ Elite Flow",
    en: "Browse photos from the 2025 Thai–Chinese Friendship Table Tennis event in the Elite Flow portfolio.",
  },
  "udon-thani-ceremony-and-banquet": {
    th: "ชมภาพบรรยากาศพิธีและงานเลี้ยงในอุดรธานี ผ่านแกลเลอรีผลงานของ Elite Flow",
    en: "Explore photos from a ceremony and banquet in Udon Thani in the Elite Flow portfolio.",
  },
};

function normalise(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function seoCopy(
  item: Content,
  locale: Locale,
  useStoredCopy = true,
): Copy {
  const translation = item[locale];
  const authored =
    item.kind === "page"
      ? pages[item.slug]?.[locale]
      : item.kind === "service"
        ? services[item.slug]?.[locale]
        : item.kind === "post"
          ? posts[item.slug]?.[locale]
          : undefined;
  const title = normalise(
    (useStoredCopy && translation.seoTitle) ||
      authored?.title ||
      translation.seoTitle ||
      translation.title,
  );
  let description = normalise(
    (useStoredCopy && translation.seoDescription) ||
      authored?.description ||
      translation.seoDescription ||
      translation.description,
  );
  if (
    item.kind === "project" &&
    (!description ||
      (!useStoredCopy &&
        (!translation.description || Boolean(projectDescriptions[item.slug]))))
  ) {
    const projectTitle = normalise(translation.title);
    const weddingTitle = projectTitle
      .replace(/^ภาพงานแต่ง/, "งานแต่ง")
      .replace(/^เบื้องหลังงาน/, "งานแต่ง");
    description =
      projectDescriptions[item.slug]?.[locale] ||
      (locale === "th"
        ? `ชมภาพบรรยากาศ${weddingTitle.startsWith("งานแต่ง") ? weddingTitle : `งานแต่ง${weddingTitle}`}ในแกลเลอรีผลงานของ Elite Flow รวมช่วงเวลาที่บันทึกไว้ในวันสำคัญ`
        : `Browse photos from ${projectTitle} in the Elite Flow portfolio, with a visual record of this wedding day.`);
  }
  return { title, description };
}
