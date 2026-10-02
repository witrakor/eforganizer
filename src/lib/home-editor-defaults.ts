import type { Locale } from "./types";
// Defaults mirror the public page; editing a field stores an explicit override.
export const homeEditorDefaults: Record<string, Record<Locale, string>> = {
  workTitle: {
    th: "ภาพจริง จากประสบการณ์ของทีม",
    en: "Real events. Real team experience.",
  },
  workDescription: {
    th: "เบื้องหลังภาพแต่ละงาน มีทั้งการเตรียมพร้อม การประสานผู้คน และการดูแลจังหวะสำคัญ เราคัดประสบการณ์ของทีมจากงานหลากหลายรูปแบบมาให้คุณเห็นบรรยากาศจริง พร้อมบทบาทที่เราได้ร่วมดูแล เพื่อช่วยให้คุณมองเห็นภาพงานของตัวเองได้ชัดขึ้น",
    en: "Every event photograph has a story behind it: preparation, people and carefully coordinated moments. Explore a selection of our team’s experience, with real settings and clear descriptions of our role, to find ideas for your own event.",
  },
  processDetail: {
    th: "เริ่มจากทำความเข้าใจสิ่งที่คุณอยากให้งานสื่อสาร แล้วค่อยวางลำดับงานและหน้าที่ของแต่ละฝ่ายให้เชื่อมกัน เมื่อถึงวันจริง ทุกคนจึงมีแผนเดียวกันเป็นจุดอ้างอิง และคุณรู้ว่าเรื่องไหนควรคุยกับใคร",
    en: "We begin with what you want your event to communicate, then connect the schedule with each team’s responsibilities. On the day, everyone has a shared plan to work from, and you know who to speak with about each detail.",
  },
  teamDetail: {
    th: "งานที่ไหลลื่นเริ่มจากคนที่สื่อสารกันเข้าใจ เราให้ความสำคัญกับการรับฟังเจ้าภาพ ประสานผู้ร่วมงาน และเตรียมรายละเอียดกับทีมที่เกี่ยวข้อง เพื่อให้สิ่งที่วางแผนไว้ส่งต่อถึงหน้างานอย่างชัดเจน",
    en: "An event flows well when the people behind it understand one another. We listen to the host, coordinate with participants and work through the details with the teams involved, so the plan carries clearly into the event itself.",
  },
  journalTitle: {
    th: "ไอเดียดี ๆ ก่อนเริ่มงาน",
    en: "Ideas for your next event",
  },
  journalDescription: {
    th: "หลายรายละเอียดของงานเริ่มคิดได้ตั้งแต่ก่อนเลือกสถานที่หรือกำหนดลำดับพิธี เรารวมเรื่องเล่าจากการทำงานและข้อสังเกตเล็ก ๆ ที่ช่วยให้คุณเตรียมตัว ตั้งคำถาม และคุยกับทีมจัดงานได้ตรงประเด็นขึ้น",
    en: "Some of the most useful decisions happen before a venue or schedule is confirmed. These stories and practical observations from event work help you prepare, ask better questions and have a clearer conversation with your event team.",
  },
  faqTitle: {
    th: "ก่อนเริ่มวางแผนงาน",
    en: "Before we begin",
  },
  ctaDescription: {
    th: "เล่าให้เราฟังถึงงานที่คุณกำลังนึกถึง ไม่ว่าจะเป็นโอกาสสำคัญขององค์กรหรือวันพิเศษของครอบครัว เริ่มจากรูปแบบงาน ช่วงเวลา และสิ่งที่คุณให้ความสำคัญ แล้วเราค่อยวางรายละเอียดไปด้วยกัน",
    en: "Tell us about the event you have in mind, whether it is an important occasion for your organisation or a family celebration. Start with the event type, timing and what matters most to you. We can shape the details together.",
  },
  experienceTitle: {
    th: "ประสบการณ์ที่ลูกค้าไว้วางใจ",
    en: "Experience our clients trust",
  },
  experienceDescription: {
    th: "จากงานองค์กร ถึงวันสำคัญของครอบครัว",
    en: "From corporate events to family celebrations.",
  },
  clientSectionTitle: {
    th: "ลูกค้าของเรา",
    en: "Our clients",
  },
  clientSectionDescription: {
    th: "ขอบคุณลูกค้า เจ้าภาพ และทีมผู้จัดงาน ที่มอบความไว้วางใจให้เราร่วมดูแลช่วงเวลาสำคัญ ตั้งแต่งานแต่งงานและวันพิเศษของครอบครัว ไปจนถึงงานองค์กรและกิจกรรมสาธารณะ",
    en: "Thank you to the clients, hosts and event teams who have trusted us with their important occasions, from weddings and family celebrations to corporate events and public programmes.",
  },
  heroTitle: {
    th: "ออแกไนซ์ รับจัดงาน\nทุกโอกาสสำคัญ",
    en: "Your event organizer.\nFor every occasion.",
  },
  heroSubtitle: {
    th: "วางแผนอย่างเข้าใจ ดูแลอย่างใส่ใจ",
    en: "Thoughtfully planned. Personally cared for.",
  },
  heroDescription: {
    th: "รับจัดงานองค์กร งานแต่ง และกิจกรรมพิเศษ ตั้งแต่การวางแผน ประสานงาน ไปจนถึงดูแลหน้างาน ด้วยขอบเขตที่ชัดเจนร่วมกัน",
    en: "Corporate events, weddings and special occasions. From planning and coordination to on-site care, with a scope shaped around your event.",
  },
  faq1Question: {
    th: "ยังไม่มีรูปแบบหรืองบประมาณชัดเจน คุยได้ไหม?",
    en: "Can we talk before our brief or budget is final?",
  },
  faq2Question: {
    th: "ควรเตรียมข้อมูลอะไรให้ทีม?",
    en: "What should we prepare?",
  },
  faq3Question: {
    th: "ทีมรับผิดชอบส่วนไหนของงานบ้าง?",
    en: "Which parts of the event will you handle?",
  },
  faq1Answer: {
    th: "ได้ครับ เริ่มจากเป้าหมาย ประเภทงาน และช่วงเวลาที่คิดไว้ แล้วค่อยกำหนดขอบเขตร่วมกัน",
    en: "Yes. Start with your goals, event type and preferred dates. We can shape the scope together.",
  },
  faq2Answer: {
    th: "ประเภทงาน วันที่หรือช่วงเวลา สถานที่ จำนวนผู้ร่วมงาน และงบประมาณคร่าว ๆ หากยังไม่แน่ใจสามารถแจ้งทีมได้",
    en: "Share the event type, preferred dates, venue, guest count and an approximate budget. It is fine if some details are still undecided.",
  },
  faq3Answer: {
    th: "เราจะตกลงขอบเขต ผู้รับผิดชอบ และรายละเอียดร่วมกันก่อนเริ่มงาน โดยพิจารณาจากรูปแบบและความต้องการของคุณ",
    en: "We agree on scope, responsibilities and details before work begins, based on your event and requirements.",
  },
};
