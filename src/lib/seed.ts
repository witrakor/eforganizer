import { eventPhotos, teamPhotos } from "./event-photos";
import type { Content, Translation } from "./types";
import { emptyTranslation } from "./types";
const tr = (
  title: string,
  description: string,
  body = "",
  extras: Partial<Translation> = {},
): Translation => ({
  ...emptyTranslation(),
  title,
  description,
  body,
  ...extras,
});
let counter = 0;
const entry = (
  kind: Content["kind"],
  slug: string,
  th: Translation,
  en: Translation,
  image = "",
  extra: Partial<Content> = {},
): Content => ({
  id: `00000000-0000-4000-8000-${String(++counter).padStart(12, "0")}`,
  kind,
  slug,
  th,
  en,
  image,
  gallery: [],
  category: "",
  featured: false,
  sortOrder: counter,
  date: "2026-10-01",
  status: "published",
  ...extra,
});
export const seedContent: Content[] = [
  entry(
    "page",
    "home",
    tr(
      "ทุกงานสำคัญ\nให้เป็นไปอย่างลงตัว",
      "จากแนวคิดแรก ถึงช่วงเวลาที่ทุกคนจดจำ เราวางแผน ประสานงาน และดูแลทุกรายละเอียด เพื่อให้งานของคุณเกิดขึ้นอย่างที่ตั้งใจ",
      "",
      {
        eyebrow: "EVENT ORGANIZER · KHON KAEN",
        subtitle: "คิดให้ครบ ดูแลให้จบ ในทีมเดียว",
        servicesTitle: "หลายรูปแบบงาน\nหนึ่งทีมที่เข้าใจ",
        workTitle: "ทุกงาน มีเรื่องราว",
        processTitle: "จากโจทย์ของคุณ\nสู่ประสบการณ์ที่น่าจดจำ",
        ctaTitle: "งานต่อไปของคุณ\nเริ่มต้นที่บทสนทนานี้",
      },
    ),
    tr(
      "Great events.\nBeautifully in flow.",
      "From the first idea to the moments people remember. We plan, connect and manage every detail to bring your event to life.",
      "",
      {
        eyebrow: "EVENT ORGANIZER · KHON KAEN",
        subtitle: "One thoughtful team. Every detail covered.",
        servicesTitle: "Different occasions.\nOne dedicated team.",
        workTitle: "Every event tells a story.",
        processTitle: "From your brief\nto a lasting impression.",
        ctaTitle: "Your next great event\nstarts with a conversation.",
      },
    ),
    "/media/conference.webp",
  ),
  entry(
    "page",
    "about",
    tr(
      "เบื้องหลังงานที่ลงตัว\nคือทีมที่ใส่ใจ",
      "Elite Flow เติบโตจากประสบการณ์ทำงานจริง ทั้งเบื้องหน้าเวทีและเบื้องหลังงานสำคัญ เรานำความเข้าใจเหล่านั้นมาดูแลการจัดงานในทุกขั้นตอน ตั้งแต่งานแต่งงานและงานเลี้ยง ไปจนถึงงานประชุมและกิจกรรมองค์กร ด้วยความตั้งใจให้งานสะท้อนตัวตนและเป้าหมายของลูกค้า",
      "## เริ่มต้นด้วยการฟัง\nทุกงานมีความหมายและความคาดหวังที่แตกต่างกัน เราจึงเริ่มจากการทำความเข้าใจว่าลูกค้าอยากให้ผู้ร่วมงานรู้สึกอย่างไร มีช่วงเวลาไหนที่ต้องการให้คนจดจำ และมีเงื่อนไขอะไรที่ทีมควรรู้ตั้งแต่ต้น ไม่ว่าจะเป็นรูปแบบงาน จำนวนแขก สถานที่ งบประมาณ หรือธรรมเนียมของครอบครัว\n\n## วางแผนให้ทุกฝ่ายเห็นภาพเดียวกัน\nเมื่อโจทย์ชัดเจน เราช่วยเรียบเรียงแนวคิดให้เป็นแผนงานที่ทำได้จริง กำหนดลำดับเวลา ขอบเขตงาน และจุดประสานสำคัญ พร้อมประสานผู้ให้บริการและทีมที่เกี่ยวข้องให้เข้าใจรายละเอียดตรงกัน ลูกค้าจึงติดตามความคืบหน้าและตัดสินใจในเรื่องสำคัญได้อย่างมั่นใจ\n\n## ใส่ใจตั้งแต่การเตรียมงานถึงวันจริง\nก่อนวันงาน เราตรวจสอบกำหนดการ ความพร้อมของสถานที่ อุปกรณ์ และผู้เกี่ยวข้อง ระหว่างงาน ทีมดูแลจังหวะและแก้ปัญหาเฉพาะหน้าโดยคำนึงถึงภาพรวม เพื่อให้ลูกค้าและครอบครัวมีเวลาอยู่กับแขกและช่วงเวลาสำคัญได้เต็มที่\n\n## งานที่ดีเกิดจากการร่วมมือ\nเราเชื่อว่าความราบรื่นไม่ได้เกิดจากแผนเพียงอย่างเดียว แต่เกิดจากการสื่อสารที่เปิดเผยและการทำงานเป็นทีม Elite Flow พร้อมรับฟังความคิดเห็น ปรับรายละเอียดให้เหมาะกับสถานการณ์ และดูแลทุกองค์ประกอบด้วยความเคารพในความตั้งใจของลูกค้า เป้าหมายของเราคือช่วยให้งานดำเนินไปอย่างเป็นธรรมชาติ และเป็นความทรงจำที่ดีสำหรับทุกคน",
      {
        eyebrow: "MEET ELITE FLOW",
        items: [
          "ฟังและเข้าใจเป้าหมาย",
          "วางแผนอย่างเป็นระบบ",
          "ดูแลด้วยทีมที่พร้อม",
          "ใส่ใจประสบการณ์ของทุกคน",
        ],
      },
    ),
    tr(
      "Behind every great event,\na team that cares.",
      "Elite Flow brings hands-on experience from both the stage and behind the scenes to every event we manage.",
      "## The bigger picture. The finer details.\nWe start by listening: to your goals, your guests and the details that matter to you.\n\nOur team connects ideas, plans and people, from preparation through the final moment.\n\n## Clear collaboration\nWe agree on scope, budget and milestones together, and coordinate the right partners for each event.",
      {
        eyebrow: "MEET ELITE FLOW",
        items: [
          "Listen with purpose",
          "Plan with clarity",
          "Work as one team",
          "Care for every guest",
        ],
      },
    ),
    "/media/team.webp",
  ),
  entry(
    "page",
    "services",
    tr(
      "ทุกโอกาสสำคัญ\nเราพร้อมดูแล",
      "เลือกบริการที่ตรงกับงานของคุณ แล้วให้เราช่วยวางรูปแบบ ขอบเขต และทีมที่เหมาะสม",
      "",
      { eyebrow: "OUR EXPERTISE" },
    ),
    tr(
      "Your occasion.\nOur expertise.",
      "Find the right service for your event. Together, we will shape the scope, experience and team.",
      "",
      { eyebrow: "OUR EXPERTISE" },
    ),
  ),
  entry(
    "page",
    "work",
    tr(
      "ประสบการณ์จริง\nในทุกบทบาทของทีม",
      "ภาพส่วนหนึ่งจากงานที่ทีมของเราได้ร่วมดูแล พร้อมเรื่องราวและบทบาทเบื้องหลังแต่ละงาน",
      "",
      { eyebrow: "SELECTED EXPERIENCE" },
    ),
    tr(
      "Real moments.\nHands-on experience.",
      "A selection of events our team has contributed to, with the story and our role behind each occasion.",
      "",
      { eyebrow: "SELECTED EXPERIENCE" },
    ),
  ),
  entry(
    "page",
    "journal",
    tr(
      "เรื่องน่ารู้\nก่อนวันสำคัญ",
      "แนวคิดและแนวทางเตรียมงาน จากทีมที่อยู่กับรายละเอียดของอีเวนท์",
      "",
      { eyebrow: "THE JOURNAL" },
    ),
    tr(
      "Good ideas.\nBetter-prepared events.",
      "Practical perspectives on planning, preparation and the details that make events work.",
      "",
      { eyebrow: "THE JOURNAL" },
    ),
  ),
  entry(
    "page",
    "contact",
    tr(
      "เล่างานที่คุณคิดไว้\nให้เราฟัง",
      "ไม่ว่าจะมีแค่ไอเดียเริ่มต้น หรือกำหนดการพร้อมแล้ว เราพร้อมช่วยต่อภาพให้ชัดขึ้น",
      "",
      {
        eyebrow: "LET’S MAKE IT HAPPEN",
        phone: "062 896 5444",
        email: "chaiyawet768@gmail.com",
        address: "ขอนแก่น ประเทศไทย",
        facebook: "https://www.facebook.com/profile.php?id=61586237753501",
      },
    ),
    tr(
      "Have something in mind?\nLet’s talk.",
      "Whether you have an early idea or a detailed brief, we can help bring the next steps into focus.",
      "",
      {
        eyebrow: "LET’S MAKE IT HAPPEN",
        phone: "062 896 5444",
        email: "chaiyawet768@gmail.com",
        address: "Khon Kaen, Thailand",
        facebook: "https://www.facebook.com/profile.php?id=61586237753501",
      },
    ),
  ),
  entry(
    "page",
    "privacy",
    tr(
      "ความเป็นส่วนตัว",
      "ข้อมูลที่คุณส่งมา ใช้เพื่อพูดคุยและวางแผนงานร่วมกัน",
      "## ข้อมูลที่เราได้รับ\nเมื่อคุณส่งแบบฟอร์ม เราจะได้รับชื่อ อีเมล เบอร์โทร และรายละเอียดเกี่ยวกับงานที่คุณกรอก\n\n## การใช้ข้อมูล\nทีมใช้ข้อมูลเพื่อติดต่อกลับ ประเมินขอบเขตงาน และจัดทำข้อเสนอ เราจะไม่แสดงข้อมูลติดต่อของคุณบนเว็บไซต์\n\n## การจัดเก็บและการติดต่อ\nข้อมูลจัดเก็บในระบบหลังบ้านที่จำกัดการเข้าถึง หากต้องการสอบถาม ขอแก้ไข หรือลบข้อมูล กรุณาติดต่อ chaiyawet768@gmail.com\n\n## คุกกี้\nระบบใช้คุกกี้ที่จำเป็นสำหรับการเข้าสู่ระบบผู้ดูแล เว็บไซต์นี้ไม่ได้ติดตั้งคุกกี้โฆษณาหรือระบบติดตามการตลาด",
    ),
    tr(
      "Privacy",
      "Your information helps us discuss and plan your event.",
      "## Information we receive\nThe inquiry form collects your name, email, phone number and the event details you provide.\n\n## How we use it\nOur team uses this information to contact you, assess the scope and prepare a proposal. Contact details are not displayed publicly.\n\n## Storage and requests\nInquiries are stored in an access-controlled administration system. For questions, corrections or deletion requests, contact chaiyawet768@gmail.com.\n\n## Cookies\nEssential cookies are used for administrator authentication. This site does not include advertising cookies or marketing trackers.",
    ),
  ),
];
const services = [
  {
    slug: "meetings-conferences",
    th: "งานประชุมและสัมมนา",
    en: "Meetings & Conferences",
    image: "conference",
    descTh:
      "พื้นที่ของความรู้ บทสนทนา และความร่วมมือ ที่ทุกช่วงดำเนินไปอย่างราบรื่น",
    descEn:
      "Thoughtfully managed spaces for knowledge, conversation and collaboration.",
    itemsTh: [
      "ประชุมองค์กรและ Town Hall",
      "สัมมนา เสวนา และเวิร์กช็อป",
      "ประชุมวิชาการและ Business Matching",
      "ระบบลงทะเบียนและประสานวิทยากร",
    ],
    itemsEn: [
      "Corporate meetings and town halls",
      "Seminars, panels and workshops",
      "Academic conferences and business matching",
      "Registration and speaker coordination",
    ],
  },
  {
    slug: "ceremonies-launches",
    th: "งานพิธีการและเปิดตัว",
    en: "Ceremonies & Launches",
    image: "ceremony",
    descTh:
      "ทุกลำดับพิธี ทุกแขกสำคัญ และทุกช่วงเปิดตัว ได้รับการเตรียมพร้อมอย่างใส่ใจ",
    descEn: "Every protocol, guest and launch moment, carefully considered.",
    itemsTh: [
      "พิธีเปิดอาคารและโครงการ",
      "พิธีลงนาม MOU",
      "เปิดตัวสินค้าและแถลงข่าว",
      "มอบรางวัลและงานครบรอบองค์กร",
    ],
    itemsEn: [
      "Building and project openings",
      "MOU signing ceremonies",
      "Product launches and press events",
      "Awards and company anniversaries",
    ],
  },
  {
    slug: "corporate-celebrations",
    th: "งานเลี้ยงและกิจกรรมองค์กร",
    en: "Corporate Celebrations",
    image: "corporate",
    descTh:
      "เชื่อมความสัมพันธ์และเฉลิมฉลองความสำเร็จ ด้วยประสบการณ์ที่คนในองค์กรมีส่วนร่วม",
    descEn: "Bring people together and celebrate shared achievements.",
    itemsTh: [
      "งานเลี้ยงขอบคุณลูกค้าและ Gala Dinner",
      "งานปีใหม่และฉลองความสำเร็จ",
      "Team Building และ Outing",
      "กิจกรรม CSR และ Incentive",
    ],
    itemsEn: [
      "Client appreciation and gala dinners",
      "Annual parties and celebrations",
      "Team building and company outings",
      "CSR and incentive programmes",
    ],
  },
  {
    slug: "exhibitions-activations",
    th: "นิทรรศการและกิจกรรมแบรนด์",
    en: "Exhibitions & Activations",
    image: "festival",
    descTh:
      "เปลี่ยนเรื่องราวขององค์กรและแบรนด์ ให้กลายเป็นพื้นที่ที่ผู้คนเข้ามามีส่วนร่วม",
    descEn: "Turn your brand story into a space people can experience.",
    itemsTh: [
      "นิทรรศการและงานแสดงสินค้า",
      "Open House และ Showcase",
      "Roadshow และกิจกรรมการตลาด",
      "เวทีกลางและกิจกรรมภายในงาน",
    ],
    itemsEn: [
      "Exhibitions and trade shows",
      "Open houses and showcases",
      "Roadshows and brand activations",
      "Stage programmes and on-site activities",
    ],
  },
  {
    slug: "weddings-private-events",
    th: "งานแต่งและงานส่วนตัว",
    en: "Weddings & Private Events",
    image: "wedding",
    descTh:
      "วันสำคัญที่สะท้อนตัวตนของคุณ พร้อมทีมดูแลให้คุณอยู่กับทุกความรู้สึกได้เต็มที่",
    descEn:
      "Personal occasions that feel like you, with space to enjoy every moment.",
    itemsTh: [
      "วางแผนและจัดงานแต่ง",
      "พิธีหมั้นและฉลองมงคลสมรส",
      "งานแต่งที่บ้าน โรงแรม และสวน",
      "งานเลี้ยงส่วนตัวและงานครอบครัว",
    ],
    itemsEn: [
      "Wedding planning and management",
      "Engagement and wedding receptions",
      "Home, hotel and garden weddings",
      "Private celebrations and family occasions",
    ],
  },
  {
    slug: "special-events",
    th: "งานประกวดและกิจกรรมพิเศษ",
    en: "Special Events & Shows",
    image: "pageant",
    descTh:
      "เชื่อมเบื้องหน้าและเบื้องหลัง ให้ทุกคนบนเวทีได้แสดงศักยภาพอย่างเต็มที่",
    descEn:
      "Connect backstage and centre stage so every participant can shine.",
    itemsTh: [
      "งานประกวดและแฟชั่นโชว์",
      "เทศกาลและกิจกรรมวัฒนธรรม",
      "พิธีเปิด–ปิดการแข่งขัน",
      "การแสดงและกิจกรรมเวที",
    ],
    itemsEn: [
      "Pageants and fashion shows",
      "Festivals and cultural events",
      "Competition opening and closing ceremonies",
      "Performances and stage programmes",
    ],
  },
];
for (const s of services)
  seedContent.push(
    entry(
      "service",
      s.slug,
      tr(
        s.th,
        s.descTh,
        `## ออกแบบการดูแลให้เหมาะกับงาน\nเริ่มจากเป้าหมาย รูปแบบงาน จำนวนผู้ร่วมงาน และงบประมาณของคุณ เราช่วยวางแผน ประสานผู้ให้บริการ และจัดทีมดูแลตามขอบเขตที่ตกลงร่วมกัน\n\n## ก่อนงาน ระหว่างงาน และหลังงาน\nทีมเตรียมแผนดำเนินงาน ประสานผู้เกี่ยวข้อง ตรวจความพร้อม และดูแลการดำเนินงาน เพื่อให้เจ้าภาพมองเห็นความคืบหน้าและตัดสินใจได้ง่าย`,
        { eyebrow: "OUR EXPERTISE", items: s.itemsTh },
      ),
      tr(
        s.en,
        s.descEn,
        "## A scope shaped around you\nWe start with your goals, format, audience and budget. Together, we plan the experience, coordinate suppliers and assemble the right team for the agreed scope.\n\n## Before, during and after\nOur team prepares the programme, coordinates stakeholders, checks readiness and manages delivery, keeping you informed throughout.",
        { eyebrow: "OUR EXPERTISE", items: s.itemsEn },
      ),
      `/media/${s.image}.webp`,
    ),
  );
seedContent.push(
  entry(
    "project",
    "sme-reboost",
    tr(
      "SME Reboost 2569",
      "งานสรุปผลการดำเนินงานและเวทีแลกเปลี่ยนสำหรับภาคธุรกิจ",
      "## บทบาทของทีม\nประสบการณ์ด้านพิธีกรและการดำเนินกิจกรรมบนเวที ในงานสรุปผลการดำเนินงาน SME Reboost ปี 2569 ณ โรงแรมเจริญโฮเต็ล จังหวัดอุดรธานี\n\nภาพนี้เป็นส่วนหนึ่งของประสบการณ์ที่ทีมได้ร่วมทำงาน โดยไม่ได้แสดงว่า Elite Flow เป็นผู้จัดงานหลักทั้งหมด",
      { eyebrow: "MEETINGS & CONFERENCES", subtitle: "อุดรธานี · 2569" },
    ),
    tr(
      "SME Reboost 2026",
      "A programme review and exchange for the business community.",
      "## Our team’s role\nMC and stage programme experience at the SME Reboost 2026 programme review at Charoen Hotel, Udon Thani.\n\nThis project illustrates the team’s contribution, rather than a claim that Elite Flow organised the entire event.",
      { eyebrow: "MEETINGS & CONFERENCES", subtitle: "Udon Thani · 2026" },
    ),
    "/media/conference.webp",
    {
      category: "meetings-conferences",
      featured: true,
      gallery: [
        "/media/ceremony.webp",
        "/media/corporate.webp",
        "/media/workshop.webp",
      ],
      date: "2026-08-07",
    },
  ),
  entry(
    "project",
    "isan-creative",
    tr(
      "เทศกาลอีสานสร้างสรรค์",
      "ประสบการณ์งานพิธีเปิดและกิจกรรมเสวนา",
      "## บทบาทของทีม\nทีมได้ร่วมทำงานในส่วนพิธีเปิดและกิจกรรมเสวนาของเทศกาลอีสานสร้างสรรค์ 2569 ตามผลงานที่เผยแพร่บนเพจ\n\nการประสานคน เวลา และช่วงกิจกรรม คือรายละเอียดที่ช่วยให้เวทีเชื่อมต่อกับผู้ร่วมงานได้อย่างเป็นธรรมชาติ",
      { eyebrow: "CEREMONIES & CULTURE", subtitle: "ขอนแก่น · 2569" },
    ),
    tr(
      "Isan Creative Festival",
      "Opening ceremony and panel programme experience.",
      "## Our team’s role\nThe team contributed to the opening ceremony and panel activities at Isan Creative Festival 2026, as documented on our Facebook page.\n\nCoordinating people, timing and programme transitions helps connect the stage with the audience.",
      { eyebrow: "CEREMONIES & CULTURE", subtitle: "Khon Kaen · 2026" },
    ),
    "/media/festival.webp",
    { category: "ceremonies-launches", featured: true, date: "2026-08-04" },
  ),
  entry(
    "project",
    "miss-universe-khon-kaen",
    tr(
      "Miss Universe Khon Kaen",
      "เบื้องหลังเวที กับการประสานรายละเอียดตลอดกิจกรรม",
      "## บทบาทของทีม\nประสบการณ์ดูแลและประสานกิจกรรมการเก็บตัวผู้เข้าประกวด รวมถึงงานเบื้องหลังบางส่วนของ Miss Universe Khon Kaen 2026\n\nทำงานร่วมกับกองประกวด ทีมพี่เลี้ยง ช่างภาพ ทีมวิดีโอ และทีมหลังเวที เพื่อเชื่อมการเตรียมงานเข้ากับช่วงการแข่งขัน\n\nเครดิตภาพและรายละเอียด: โพสต์ Chai Chaiyawet ที่เผยแพร่ผ่านเพจ Elite Flow Team",
      { eyebrow: "SPECIAL EVENTS", subtitle: "ขอนแก่น · 2569" },
    ),
    tr(
      "Miss Universe Khon Kaen",
      "Connecting people and details behind the stage.",
      "## Our team’s role\nCoordination of contestant preparation activities and selected behind-the-scenes responsibilities for Miss Universe Khon Kaen 2026.\n\nWorking alongside the pageant organisation, mentors, photographers, video crew and backstage team.\n\nImages and project details: Chai Chaiyawet, shared through the Elite Flow Team page.",
      { eyebrow: "SPECIAL EVENTS", subtitle: "Khon Kaen · 2026" },
    ),
    "/media/pageant.webp",
    {
      category: "special-events",
      featured: true,
      gallery: ["/media/backstage.webp", "/media/portrait.webp"],
      date: "2026-07-20",
    },
  ),
  entry(
    "project",
    "min-chat-wedding",
    tr(
      "Min & Chat — Wedding Day",
      "ช่วงเวลาอบอุ่น และรายละเอียดที่ทีมช่วยกันดูแล",
      "## บทบาทของทีม\nทีมร่วมดูแลการดำเนินพิธีและประสานงานในวันแต่งงาน ช่วงพิธีมงคลสมรสบ่ายและฉลองเย็น\n\nออแกไนซ์: โรสเวดดิ้ง · พิธีกร: คุณนุช\nภาพคู่บ่าวสาว: Biestudio ตามเครดิตบนโพสต์ต้นทาง\n\nผลงานนี้แสดงประสบการณ์ร่วมงานของทีมก่อนพัฒนาบริการออแกไนซ์ของ Elite Flow",
      { eyebrow: "WEDDINGS", subtitle: "Wedding celebration · 2569" },
    ),
    tr(
      "Min & Chat — Wedding Day",
      "Warm moments and details brought together by a team.",
      "## Our team’s role\nCeremony coordination and on-site support for an afternoon wedding ceremony and evening reception.\n\nOrganiser: Rose Wedding · MC: Khun Nuch\nCouple photography: Biestudio, as credited in the original post.\n\nThis project reflects the team’s collaborative experience prior to developing Elite Flow’s organiser services.",
      { eyebrow: "WEDDINGS", subtitle: "Wedding celebration · 2026" },
    ),
    "/media/wedding.webp",
    {
      category: "weddings-private-events",
      featured: true,
      gallery: [
        "/media/weddingteam.webp",
        "/media/bride.webp",
        "/media/details.webp",
      ],
      date: "2026-07-05",
    },
  ),
  entry(
    "post",
    "a-better-event-brief",
    tr(
      "เริ่มต้นจัดงาน ด้วยบรีฟที่ชัดเจน",
      "6 เรื่องที่ช่วยให้ออแกไนซ์เข้าใจงานของคุณ และวางแผนต่อได้ง่ายขึ้น",
      "## 1. เป้าหมายของงาน\nอยากให้ผู้ร่วมงานได้อะไรกลับไป ความรู้ ความสัมพันธ์ หรือความเข้าใจในแบรนด์? เป้าหมายนี้ช่วยตัดสินใจเรื่องอื่นได้ง่ายขึ้น\n\n## 2. ผู้ร่วมงาน\nระบุจำนวนโดยประมาณ กลุ่มผู้เข้าร่วม และความต้องการด้านการเข้าถึงหรืออาหารที่ทราบ\n\n## 3. วันและสถานที่\nหากยังไม่มีสถานที่ แจ้งพื้นที่ที่ต้องการและวันที่ยืดหยุ่นได้ เพื่อช่วยคัดตัวเลือก\n\n## 4. งบประมาณ\nบอกกรอบงบและสิ่งที่รวมอยู่แล้ว เช่น สถานที่ อาหาร หรืออุปกรณ์ เพื่อวางข้อเสนอได้ตรงกัน\n\n## 5. สิ่งที่ต้องมี\nแยกสิ่งจำเป็นออกจากสิ่งที่อยากได้เพิ่มเติม เช่น พิธีเปิด การถ่ายทอดสด หรือช่วงพบปะ\n\n## 6. ผู้ประสานงานและผู้ตัดสินใจ\nระบุว่าใครให้ข้อมูล ใครอนุมัติ และต้องตัดสินใจเมื่อไร ช่วยให้โครงการเดินหน้าได้ต่อเนื่อง",
      { eyebrow: "PLANNING", subtitle: "อ่าน 3 นาที" },
    ),
    tr(
      "A clearer brief. A better beginning.",
      "Six details that help your organiser understand your event and plan the next steps.",
      "## 1. Purpose\nWhat should people take away: knowledge, stronger relationships or a clearer understanding of your brand?\n\n## 2. Audience\nShare estimated numbers, audience groups and any known access or dietary needs.\n\n## 3. Date and venue\nIf the venue is undecided, share your preferred area and flexible dates.\n\n## 4. Budget\nClarify the budget range and any costs already covered.\n\n## 5. Essentials\nSeparate must-haves from optional additions, such as live streaming or networking sessions.\n\n## 6. Decisions\nIdentify the project contact, decision maker and approval dates.",
      { eyebrow: "PLANNING", subtitle: "3 min read" },
    ),
    "/media/backstage.webp",
    { category: "Planning" },
  ),
  entry(
    "post",
    "conference-preparation",
    tr(
      "เตรียมงานสัมมนา ให้ทุกช่วงเชื่อมต่อกัน",
      "รายละเอียดก่อนเปิดประตู ที่ช่วยให้วิทยากรและผู้เข้าร่วมพร้อมไปด้วยกัน",
      "## เริ่มจากเส้นทางของผู้ร่วมงาน\nลองไล่ตั้งแต่การเดินทาง จุดลงทะเบียน การหาที่นั่ง จนถึงช่วงพัก ป้ายที่ชัดเจนและทีมต้อนรับช่วยลดคำถามหน้างาน\n\n## เตรียมวิทยากรให้พร้อม\nตกลงเวลา รูปแบบการนำเสนอ ไมโครโฟน และไฟล์ที่ใช้ล่วงหน้า พร้อมตรวจอุปกรณ์ก่อนเริ่ม\n\n## เผื่อช่วงเปลี่ยนผ่าน\nการขึ้นลงเวที เปลี่ยนไฟล์ และถามตอบล้วนใช้เวลา ควรจัดพื้นที่ให้ช่วงเหล่านี้ในกำหนดการ\n\n## มีผู้ประสานแต่ละจุด\nกำหนดว่าใครดูแลเวที ผู้เข้าร่วม วิทยากร และเทคนิค พร้อมช่องทางสื่อสารร่วมกัน",
      { eyebrow: "MEETINGS", subtitle: "อ่าน 3 นาที" },
    ),
    tr(
      "Make every conference transition count.",
      "Preparation that helps speakers, guests and the programme move together.",
      "## Walk the guest journey\nConsider arrival, registration, seating and breaks. Clear signage and a welcoming team reduce uncertainty.\n\n## Prepare speakers\nConfirm timings, presentation format, microphones and files, then test the setup before opening.\n\n## Allow for transitions\nStage changes, presentation switches and questions take time. Include them in the schedule.\n\n## Assign clear responsibilities\nGive the stage, guests, speakers and technical team a clear point of contact.",
      { eyebrow: "MEETINGS", subtitle: "3 min read" },
    ),
    "/media/conference.webp",
    { category: "Meetings" },
  ),
  entry(
    "post",
    "wedding-first-steps",
    tr(
      "วางแผนวันแต่ง ให้มีพื้นที่สำหรับความสุข",
      "เริ่มจากสิ่งสำคัญของทั้งคู่ แล้วค่อยเติมรายละเอียดที่ใช่",
      "## เลือกความรู้สึกที่อยากให้เกิด\nอบอุ่น เป็นกันเอง หรือสง่างาม การคุยเรื่องนี้ก่อนช่วยให้ภาพงานไปในทางเดียวกัน\n\n## วางจำนวนแขกและงบประมาณร่วมกัน\nทั้งสองเรื่องส่งผลต่อสถานที่ อาหาร และรูปแบบพิธี ควรเริ่มจากกรอบที่สบายใจ\n\n## แบ่งหน้าที่ให้ชัดก่อนวันงาน\nเลือกผู้ประสานจากครอบครัว และให้ทีมดูแลงานรับช่วงรายละเอียด เพื่อให้คู่บ่าวสาวมีเวลาอยู่กับแขก\n\n## เผื่อเวลาให้ช่วงสำคัญ\nการแต่งตัว ถ่ายภาพ และพบครอบครัวควรมีพื้นที่ในกำหนดการ ไม่ต้องเร่งทุกนาที",
      { eyebrow: "WEDDINGS", subtitle: "อ่าน 3 นาที" },
    ),
    tr(
      "Make room for joy on your wedding day.",
      "Start with what matters to you, then build the details around it.",
      "## Begin with the feeling\nWarm, relaxed or elegant? Agreeing on the atmosphere helps guide later decisions.\n\n## Set guest numbers and budget together\nBoth shape your venue, catering and ceremony choices.\n\n## Share responsibilities early\nChoose a family contact and let the event team coordinate the details so you can spend time with your guests.\n\n## Give important moments time\nGetting ready, photographs and family moments deserve space in the schedule.",
      { eyebrow: "WEDDINGS", subtitle: "3 min read" },
    ),
    "/media/bride.webp",
    { category: "Weddings" },
  ),
);
// Editable homepage sections share the fixed visual layout.
const home = seedContent.find((c) => c.slug === "home")!;
home.gallery = ["/media/wedding-garden.webp", "/media/team.webp"];
Object.assign(home.th, {
  storyTitle: "ประสบการณ์จริง\nจากงานที่ลูกค้าไว้วางใจ",
  storyLead:
    "ทุกผลงานสะท้อนบทบาทที่ทีมได้ร่วมดูแล ตั้งแต่งานองค์กรและกิจกรรมสาธารณะ ไปจนถึงวันสำคัญของครอบครัว",
  storyDescription:
    "เลือกดูผลงานจริง พร้อมรายละเอียดบทบาทที่ทีมได้ร่วมดูแลในแต่ละงาน",
  servicesDescription:
    "งานแต่ละแบบมีรายละเอียดเฉพาะ เราจัดทีมและวางแผนให้เหมาะกับเป้าหมายของคุณ",
  processDescription:
    "คุณเห็นภาพรวม เราดูแลรายละเอียด พร้อมสื่อสารให้ชัดเจนในทุกขั้นตอน",
  teamTitle: "ความใส่ใจ\nที่ทำงานเป็นทีม",
  teamDescription:
    "เรานำประสบการณ์เบื้องหน้าและเบื้องหลัง มาเชื่อมทุกองค์ประกอบของงาน ด้วยทีมที่เข้าใจทั้งคนและรายละเอียด",
  journalTitle: "ไอเดียดี ๆ ก่อนเริ่มงาน",
  step1Title: "ฟังโจทย์และเข้าใจงาน",
  step1Description: "คุยเป้าหมาย รูปแบบ ผู้ร่วมงาน และงบประมาณ",
  step2Title: "ออกแบบและวางแผน",
  step2Description: "กำหนดแนวคิด ขอบเขต และแผนงานที่ชัดเจน",
  step3Title: "ประสานและเตรียมพร้อม",
  step3Description: "จัดทีม ประสานทุกฝ่าย และตรวจรายละเอียดร่วมกัน",
  step4Title: "ดูแลจนจบงาน",
  step4Description: "บริหารหน้างาน พร้อมรับมือกับสถานการณ์จริง",
});
Object.assign(home.en, {
  storyTitle: "Real experience.\nTrust built together.",
  storyLead:
    "Every project reflects the role our team played, from corporate events and public programmes to important family celebrations.",
  storyDescription:
    "Explore real projects and the role our team played in each one.",
  servicesDescription:
    "Every occasion is different. We shape the team and the plan around your goals.",
  processDescription:
    "You see the bigger picture. We care for the details, with clear communication at every step.",
  teamTitle: "Good people.\nThoughtful teamwork.",
  teamDescription:
    "We bring experience on stage and behind the scenes together, connecting people and details with care.",
  journalTitle: "Ideas for what comes next.",
  step1Title: "Listen & understand",
  step1Description: "Your goals, format, audience and budget.",
  step2Title: "Design & plan",
  step2Description: "A clear concept, scope and delivery plan.",
  step3Title: "Connect & prepare",
  step3Description: "The right people, aligned and ready.",
  step4Title: "Deliver & care",
  step4Description: "On-site management through the final moment.",
});

// Photo collections remain editable through the content manager.
for (const item of seedContent) {
  if (item.kind === "page" && item.slug === "home")
    item.image = "/media/conference.webp";
  if (item.slug === "about") item.gallery = teamPhotos;
  if (item.kind === "service" || item.kind === "project")
    item.gallery = eventPhotos(item);
  if (item.image === "/media/festival.webp") {
    item.gallery = [...new Set([...item.gallery, item.image])];
    item.image = "/media/festival-conversation.webp";
  }
}
