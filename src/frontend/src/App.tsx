import { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface EventTitle {
  en: string;
  ar: string;
}

interface EventItem {
  t: EventTitle;
  d: string;
  c: string;
  cc: string;
}

interface CountdownTime {
  days: number;
  hours: number;
  mins: number;
  secs: number;
}

type Lang = "en" | "ar";
type CountdownStatus = "upcoming" | "live" | "ended";
type AppView = "home" | "stats" | "widget" | "event" | "create";

// ─── i18n ────────────────────────────────────────────────────────────────────

const i18n = {
  en: {
    days: "DAYS",
    hours: "HOURS",
    mins: "MINS",
    secs: "SECS",
    share: "Share Event",
    explore: "All Events",
    upcoming: "Global Events 2026",
    createTitle: "Create Custom",
    createSub: "Track your personal moments",
    daysLeft: "days left",
    filterDesc: "Filter by category or select specific country",
    ended: "Event Ended",
    archiveBtn: "Archive / Past Events",
    savedEvents: "Saved Custom Events",
    noSaved: "No saved events yet",
    deleteEvent: "Delete",
    nextBigEvent: "NEXT BIG EVENT",
    justStarted: "LIVE NOW! 🎉",
    endedAgo: "days ago",
    liveNow: "LIVE NOW",
    autoSwitching: "events today — auto-switching",
    stats: "Stats",
    widget: "Widget",
    backHome: "← Back to Home",
    notifSubscribed: "🔔 Reminder set! You'll be notified 24h before.",
    notifUnsubscribed: "🔕 Reminder removed.",
    notifDenied: "Notifications blocked. Enable in browser settings.",
    copyLink: "📋 Copy Link",
    eventPage: "🔗 Event Page",
    linkCopied: "Link Copied! 🔗",
    eventPageCopied: "Event Page URL Copied! 🔗",
  },
  ar: {
    days: "يوم",
    hours: "ساعة",
    mins: "دقيقة",
    secs: "ثانية",
    share: "مشاركة",
    explore: "تصفح الكل",
    upcoming: "أحداث عالمية 2026",
    createTitle: "أنشئ عدادك",
    createSub: "تتبع مناسباتك الخاصة",
    daysLeft: "يوم متبقي",
    filterDesc: "صنف حسب الفئة أو اختر دولة محددة",
    ended: "انتهى الحدث",
    archiveBtn: "الأرشيف / أحداث منتهية",
    savedEvents: "أحداثك المحفوظة",
    noSaved: "لا توجد أحداث محفوظة",
    deleteEvent: "حذف",
    nextBigEvent: "الحدث القادم",
    justStarted: "مباشر الآن! 🎉",
    endedAgo: "يوم مضى",
    liveNow: "مباشر الآن",
    autoSwitching: "أحداث اليوم — تبديل تلقائي",
    stats: "إحصائيات",
    widget: "ويدجت",
    backHome: "→ العودة للرئيسية",
    notifSubscribed: "🔔 تم ضبط التذكير! ستتلقى إشعارًا قبل 24 ساعة.",
    notifUnsubscribed: "🔕 تم إلغاء التذكير.",
    notifDenied: "الإشعارات محجوبة. فعّلها من إعدادات المتصفح.",
    copyLink: "📋 نسخ الرابط",
    eventPage: "🔗 صفحة الحدث",
    linkCopied: "تم نسخ الرابط! 🔗",
    eventPageCopied: "تم نسخ رابط صفحة الحدث! 🔗",
  },
} as const;

// ─── Categories ──────────────────────────────────────────────────────────────

const categories = [
  { id: "all", en: "All Events", ar: "الكل", icon: "🌍" },
  { id: "national", en: "National", ar: "وطني", icon: "🏳️" },
  { id: "sports", en: "Sports", ar: "رياضة", icon: "⚽" },
  { id: "movie", en: "Movies", ar: "أفلام", icon: "🎬" },
  { id: "tech", en: "Tech", ar: "تقنية", icon: "💻" },
  { id: "islamic", en: "Islamic", ar: "إسلامي", icon: "🕌" },
  { id: "holiday", en: "Holidays", ar: "عطلات", icon: "🎉" },
  { id: "gaming", en: "Gaming", ar: "ألعاب", icon: "🎮" },
  { id: "shopping", en: "Shopping", ar: "تسوق", icon: "🛍️" },
  { id: "space", en: "Space", ar: "فضاء", icon: "🚀" },
];

// ─── Events Data ─────────────────────────────────────────────────────────────

const eventsData: EventItem[] = [
  // GLOBAL & MAJOR
  {
    t: { en: "New Year 2027", ar: "رأس السنة 2027 🎆" },
    d: "2026-12-31T23:59:59",
    c: "holiday",
    cc: "gl",
  },
  {
    t: { en: "World Cup 2026 Opening ⚽", ar: "افتتاح كأس العالم 2026 ⚽" },
    d: "2026-06-11T16:00",
    c: "sports",
    cc: "gl",
  },
  {
    t: { en: "World Cup 2026 Final 🏆", ar: "نهائي كأس العالم 2026 🏆" },
    d: "2026-07-19T20:00",
    c: "sports",
    cc: "gl",
  },
  {
    t: { en: "Total Solar Eclipse 🌑", ar: "كسوف كلي للشمس 🌑" },
    d: "2026-08-12T17:00",
    c: "space",
    cc: "gl",
  },
  {
    t: {
      en: "Winter Olympics Closing",
      ar: "ختام الأولمبياد الشتوي 🇮🇹",
    },
    d: "2026-02-22T20:00",
    c: "sports",
    cc: "gl",
  },
  // ALGERIA
  {
    t: {
      en: "Yennayer (Amazigh New Year)",
      ar: "رأس السنة الأمازيغية 🇩🇿",
    },
    d: "2026-01-12T00:00",
    c: "national",
    cc: "dz",
  },
  {
    t: { en: "Victory Day", ar: "عيد النصر 🇩🇿" },
    d: "2026-03-19T00:00",
    c: "national",
    cc: "dz",
  },
  {
    t: { en: "Knowledge Day", ar: "يوم العلم 🇩🇿" },
    d: "2026-04-16T00:00",
    c: "national",
    cc: "dz",
  },
  {
    t: { en: "Labour Day", ar: "عيد العمال 🇩🇿" },
    d: "2026-05-01T00:00",
    c: "national",
    cc: "dz",
  },
  {
    t: { en: "Independence Day", ar: "عيد الاستقلال 🇩🇿" },
    d: "2026-07-05T00:00",
    c: "national",
    cc: "dz",
  },
  {
    t: { en: "National Mujahid Day", ar: "يوم المجاهد 🇩🇿" },
    d: "2026-08-20T00:00",
    c: "national",
    cc: "dz",
  },
  {
    t: { en: "Revolution Day", ar: "عيد الثورة 🇩🇿" },
    d: "2026-11-01T00:00",
    c: "national",
    cc: "dz",
  },
  {
    t: { en: "Islamic Scouts Day", ar: "يوم الكشافة الإسلامية 🇩🇿" },
    d: "2026-05-27T00:00",
    c: "national",
    cc: "dz",
  },
  {
    t: { en: "Student Day", ar: "يوم الطالب 🇩🇿" },
    d: "2026-05-19T00:00",
    c: "national",
    cc: "dz",
  },
  {
    t: { en: "National Press Day", ar: "يوم الصحافة الوطنية 🇩🇿" },
    d: "2026-10-22T00:00",
    c: "national",
    cc: "dz",
  },
  {
    t: { en: "Tree Planting Day", ar: "عيد الشجرة 🇩🇿" },
    d: "2026-10-25T00:00",
    c: "national",
    cc: "dz",
  },
  // SAUDI ARABIA
  {
    t: { en: "Founding Day", ar: "يوم التأسيس 🇸🇦" },
    d: "2026-02-22T00:00",
    c: "national",
    cc: "sa",
  },
  {
    t: { en: "Eid al-Fitr Holiday", ar: "إجازة عيد الفطر 🇸🇦" },
    d: "2026-03-19T00:00",
    c: "islamic",
    cc: "sa",
  },
  {
    t: { en: "Arafat Day", ar: "يوم عرفة 🇸🇦" },
    d: "2026-05-26T00:00",
    c: "islamic",
    cc: "sa",
  },
  {
    t: { en: "Eid al-Adha Holiday", ar: "إجازة عيد الأضحى 🇸🇦" },
    d: "2026-05-27T00:00",
    c: "islamic",
    cc: "sa",
  },
  {
    t: { en: "Saudi National Day", ar: "اليوم الوطني السعودي 🇸🇦" },
    d: "2026-09-23T00:00",
    c: "national",
    cc: "sa",
  },
  {
    t: { en: "Riyadh Season 2026", ar: "موسم الرياض 2026 🇸🇦" },
    d: "2026-10-20T00:00",
    c: "holiday",
    cc: "sa",
  },
  // EGYPT
  {
    t: { en: "Coptic Christmas", ar: "عيد الميلاد القبطي 🇪🇬" },
    d: "2026-01-07T00:00",
    c: "holiday",
    cc: "eg",
  },
  {
    t: { en: "Revolution Day 2011", ar: "عيد ثورة 25 يناير 🇪🇬" },
    d: "2026-01-25T00:00",
    c: "national",
    cc: "eg",
  },
  {
    t: { en: "Sinai Liberation Day", ar: "عيد تحرير سيناء 🇪🇬" },
    d: "2026-04-25T00:00",
    c: "national",
    cc: "eg",
  },
  {
    t: { en: "Labour Day", ar: "عيد العمال 🇪🇬" },
    d: "2026-05-01T00:00",
    c: "national",
    cc: "eg",
  },
  {
    t: { en: "Sham El Nessim", ar: "شم النسيم 🇪🇬" },
    d: "2026-04-13T00:00",
    c: "holiday",
    cc: "eg",
  },
  {
    t: { en: "June 30 Revolution", ar: "ثورة 30 يونيو 🇪🇬" },
    d: "2026-06-30T00:00",
    c: "national",
    cc: "eg",
  },
  {
    t: { en: "Revolution Day 1952", ar: "ثورة 23 يوليو 🇪🇬" },
    d: "2026-07-23T00:00",
    c: "national",
    cc: "eg",
  },
  {
    t: { en: "Armed Forces Day", ar: "عيد القوات المسلحة 🇪🇬" },
    d: "2026-10-06T00:00",
    c: "national",
    cc: "eg",
  },
  // UAE
  {
    t: { en: "Eid al-Fitr", ar: "عيد الفطر 🇦🇪" },
    d: "2026-03-20T00:00",
    c: "islamic",
    cc: "ae",
  },
  {
    t: { en: "Arafat Day", ar: "يوم عرفة 🇦🇪" },
    d: "2026-05-26T00:00",
    c: "islamic",
    cc: "ae",
  },
  {
    t: { en: "Eid al-Adha", ar: "عيد الأضحى 🇦🇪" },
    d: "2026-05-27T00:00",
    c: "islamic",
    cc: "ae",
  },
  {
    t: { en: "Islamic New Year", ar: "رأس السنة الهجرية 🇦🇪" },
    d: "2026-06-17T00:00",
    c: "islamic",
    cc: "ae",
  },
  {
    t: { en: "Commemoration Day", ar: "يوم الشهيد 🇦🇪" },
    d: "2026-11-30T00:00",
    c: "national",
    cc: "ae",
  },
  {
    t: { en: "National Day", ar: "اليوم الوطني 🇦🇪" },
    d: "2026-12-02T00:00",
    c: "national",
    cc: "ae",
  },
  {
    t: {
      en: "Dubai Shopping Festival",
      ar: "مهرجان دبي للتسوق 🇦🇪",
    },
    d: "2026-12-15T00:00",
    c: "holiday",
    cc: "ae",
  },
  // USA
  {
    t: {
      en: "Martin Luther King Jr.",
      ar: "يوم مارتن لوثر كينغ 🇺🇸",
    },
    d: "2026-01-19T00:00",
    c: "national",
    cc: "us",
  },
  {
    t: { en: "Presidents' Day", ar: "يوم الرؤساء 🇺🇸" },
    d: "2026-02-16T00:00",
    c: "national",
    cc: "us",
  },
  {
    t: { en: "Memorial Day", ar: "يوم الذكرى 🇺🇸" },
    d: "2026-05-25T00:00",
    c: "national",
    cc: "us",
  },
  {
    t: { en: "Juneteenth", ar: "جونتينث 🇺🇸" },
    d: "2026-06-19T00:00",
    c: "national",
    cc: "us",
  },
  {
    t: {
      en: "Independence Day",
      ar: "عيد الاستقلال الأمريكي 🇺🇸",
    },
    d: "2026-07-04T00:00",
    c: "national",
    cc: "us",
  },
  {
    t: { en: "Labor Day", ar: "عيد العمال 🇺🇸" },
    d: "2026-09-07T00:00",
    c: "national",
    cc: "us",
  },
  {
    t: { en: "Columbus Day", ar: "يوم كولومبوس 🇺🇸" },
    d: "2026-10-12T00:00",
    c: "national",
    cc: "us",
  },
  {
    t: {
      en: "Veterans Day",
      ar: "يوم المحاربين القدامى 🇺🇸",
    },
    d: "2026-11-11T00:00",
    c: "national",
    cc: "us",
  },
  {
    t: { en: "Thanksgiving", ar: "عيد الشكر 🇺🇸" },
    d: "2026-11-26T00:00",
    c: "holiday",
    cc: "us",
  },
  {
    t: { en: "Super Bowl LXI", ar: "سوبر بول 2026 🏈" },
    d: "2026-02-08T18:30",
    c: "sports",
    cc: "us",
  },
  {
    t: {
      en: "US Open Tennis",
      ar: "أمريكا المفتوحة للتنس 🇺🇸",
    },
    d: "2026-08-31T00:00",
    c: "sports",
    cc: "us",
  },
  {
    t: {
      en: "Masters Golf",
      ar: "بطولة الماسترز للجولف 🇺🇸",
    },
    d: "2026-04-09T00:00",
    c: "sports",
    cc: "us",
  },
  // UK
  {
    t: { en: "St Patrick's Day", ar: "عيد القديس باتريك 🇬🇧" },
    d: "2026-03-17T00:00",
    c: "holiday",
    cc: "uk",
  },
  {
    t: { en: "Good Friday", ar: "الجمعة العظيمة 🇬🇧" },
    d: "2026-04-03T00:00",
    c: "holiday",
    cc: "uk",
  },
  {
    t: { en: "Easter Monday", ar: "إثنين الفصح 🇬🇧" },
    d: "2026-04-06T00:00",
    c: "holiday",
    cc: "uk",
  },
  {
    t: { en: "St George's Day", ar: "عيد القديس جورج 🇬🇧" },
    d: "2026-04-23T00:00",
    c: "national",
    cc: "uk",
  },
  {
    t: {
      en: "Early May Bank Holiday",
      ar: "عطلة مايو 🇬🇧",
    },
    d: "2026-05-04T00:00",
    c: "holiday",
    cc: "uk",
  },
  {
    t: {
      en: "Spring Bank Holiday",
      ar: "عطلة الربيع 🇬🇧",
    },
    d: "2026-05-25T00:00",
    c: "holiday",
    cc: "uk",
  },
  {
    t: {
      en: "Summer Bank Holiday",
      ar: "عطلة الصيف 🇬🇧",
    },
    d: "2026-08-31T00:00",
    c: "holiday",
    cc: "uk",
  },
  {
    t: { en: "Bonfire Night", ar: "ليلة البون فاير 🇬🇧" },
    d: "2026-11-05T19:00",
    c: "holiday",
    cc: "uk",
  },
  {
    t: {
      en: "Remembrance Sunday",
      ar: "أحد الذكرى 🇬🇧",
    },
    d: "2026-11-08T11:00",
    c: "national",
    cc: "uk",
  },
  {
    t: { en: "Boxing Day", ar: "يوم الصناديق 🇬🇧" },
    d: "2026-12-28T00:00",
    c: "holiday",
    cc: "uk",
  },
  {
    t: { en: "Wimbledon", ar: "ويمبلدون 🇬🇧" },
    d: "2026-06-29T11:00",
    c: "sports",
    cc: "uk",
  },
  // FRANCE
  {
    t: { en: "Victory Day 1945", ar: "عيد النصر 1945 🇫🇷" },
    d: "2026-05-08T00:00",
    c: "national",
    cc: "fr",
  },
  {
    t: { en: "Ascension Day", ar: "عيد الصعود 🇫🇷" },
    d: "2026-05-14T00:00",
    c: "holiday",
    cc: "fr",
  },
  {
    t: {
      en: "Bastille Day",
      ar: "اليوم الوطني الفرنسي 🇫🇷",
    },
    d: "2026-07-14T00:00",
    c: "national",
    cc: "fr",
  },
  {
    t: { en: "Assumption of Mary", ar: "عيد الانتقال 🇫🇷" },
    d: "2026-08-15T00:00",
    c: "holiday",
    cc: "fr",
  },
  {
    t: {
      en: "All Saints' Day",
      ar: "عيد جميع القديسين 🇫🇷",
    },
    d: "2026-11-01T00:00",
    c: "holiday",
    cc: "fr",
  },
  {
    t: { en: "Armistice Day 1918", ar: "ذكرى الهدنة 🇫🇷" },
    d: "2026-11-11T00:00",
    c: "national",
    cc: "fr",
  },
  {
    t: { en: "Tour de France", ar: "طواف فرنسا 🇫🇷" },
    d: "2026-07-04T00:00",
    c: "sports",
    cc: "fr",
  },
  {
    t: { en: "Roland Garros", ar: "رولان غاروس 🇫🇷" },
    d: "2026-05-18T00:00",
    c: "sports",
    cc: "fr",
  },
  {
    t: { en: "Cannes Festival", ar: "مهرجان كان 🇫🇷" },
    d: "2026-05-12T00:00",
    c: "movie",
    cc: "fr",
  },
  // GERMANY
  {
    t: { en: "Labour Day", ar: "عيد العمال 🇩🇪" },
    d: "2026-05-01T00:00",
    c: "holiday",
    cc: "de",
  },
  {
    t: {
      en: "German Unity Day",
      ar: "يوم الوحدة الألمانية 🇩🇪",
    },
    d: "2026-10-03T00:00",
    c: "national",
    cc: "de",
  },
  {
    t: { en: "Whit Monday", ar: "اثنين العنصرة 🇩🇪" },
    d: "2026-05-25T00:00",
    c: "holiday",
    cc: "de",
  },
  {
    t: { en: "Reformation Day", ar: "يوم الإصلاح 🇩🇪" },
    d: "2026-10-31T00:00",
    c: "holiday",
    cc: "de",
  },
  {
    t: { en: "Oktoberfest Start", ar: "بداية أكتوبرفست 🇩🇪" },
    d: "2026-09-19T00:00",
    c: "holiday",
    cc: "de",
  },
  {
    t: { en: "Gamescom 2026", ar: "معرض Gamescom 🇩🇪" },
    d: "2026-08-26T00:00",
    c: "gaming",
    cc: "de",
  },
  // ITALY
  {
    t: { en: "Liberation Day", ar: "يوم التحرير 🇮🇹" },
    d: "2026-04-25T00:00",
    c: "national",
    cc: "it",
  },
  {
    t: { en: "Republic Day", ar: "يوم الجمهورية 🇮🇹" },
    d: "2026-06-02T00:00",
    c: "national",
    cc: "it",
  },
  {
    t: {
      en: "Ferragosto",
      ar: "عيد الصعود (فيراغوستو) 🇮🇹",
    },
    d: "2026-08-15T00:00",
    c: "holiday",
    cc: "it",
  },
  {
    t: { en: "All Saints' Day", ar: "عيد القديسين 🇮🇹" },
    d: "2026-11-01T00:00",
    c: "holiday",
    cc: "it",
  },
  {
    t: {
      en: "Immaculate Conception",
      ar: "عيد الحبل بلا دنس 🇮🇹",
    },
    d: "2026-12-08T00:00",
    c: "holiday",
    cc: "it",
  },
  {
    t: { en: "Venice Film Festival", ar: "مهرجان البندقية 🇮🇹" },
    d: "2026-09-02T00:00",
    c: "movie",
    cc: "it",
  },
  {
    t: { en: "F1 Monza GP", ar: "فورمولا 1 مونزا 🇮🇹" },
    d: "2026-09-06T14:00",
    c: "sports",
    cc: "it",
  },
  // SPAIN
  {
    t: { en: "Epiphany", ar: "عيد الغطاس 🇪🇸" },
    d: "2026-01-06T00:00",
    c: "holiday",
    cc: "es",
  },
  {
    t: { en: "Labour Day", ar: "عيد العمال 🇪🇸" },
    d: "2026-05-01T00:00",
    c: "national",
    cc: "es",
  },
  {
    t: { en: "Assumption of Mary", ar: "عيد الانتقال 🇪🇸" },
    d: "2026-08-15T00:00",
    c: "holiday",
    cc: "es",
  },
  {
    t: {
      en: "National Day",
      ar: "اليوم الوطني الإسباني 🇪🇸",
    },
    d: "2026-10-12T00:00",
    c: "national",
    cc: "es",
  },
  {
    t: { en: "All Saints' Day", ar: "عيد القديسين 🇪🇸" },
    d: "2026-11-01T00:00",
    c: "holiday",
    cc: "es",
  },
  {
    t: { en: "Constitution Day", ar: "يوم الدستور 🇪🇸" },
    d: "2026-12-06T00:00",
    c: "national",
    cc: "es",
  },
  {
    t: { en: "F1 Spanish GP", ar: "فورمولا 1 إسبانيا 🇪🇸" },
    d: "2026-06-01T14:00",
    c: "sports",
    cc: "es",
  },
  {
    t: { en: "La Tomatina", ar: "مهرجان الطماطم 🇪🇸" },
    d: "2026-08-26T10:00",
    c: "holiday",
    cc: "es",
  },
  // TURKEY
  {
    t: {
      en: "Children's Day",
      ar: "عيد الطفولة والسيادة 🇹🇷",
    },
    d: "2026-04-23T00:00",
    c: "national",
    cc: "tr",
  },
  {
    t: { en: "Labour Day", ar: "عيد العمال 🇹🇷" },
    d: "2026-05-01T00:00",
    c: "national",
    cc: "tr",
  },
  {
    t: {
      en: "Youth & Sports Day",
      ar: "عيد الشباب والرياضة 🇹🇷",
    },
    d: "2026-05-19T00:00",
    c: "national",
    cc: "tr",
  },
  {
    t: { en: "Democracy Day", ar: "يوم الديمقراطية 🇹🇷" },
    d: "2026-07-15T00:00",
    c: "national",
    cc: "tr",
  },
  {
    t: { en: "Victory Day", ar: "عيد النصر 🇹🇷" },
    d: "2026-08-30T00:00",
    c: "national",
    cc: "tr",
  },
  {
    t: { en: "Republic Day", ar: "عيد الجمهورية 🇹🇷" },
    d: "2026-10-29T00:00",
    c: "national",
    cc: "tr",
  },
  // JAPAN
  {
    t: { en: "Coming of Age Day", ar: "يوم البلوغ 🇯🇵" },
    d: "2026-01-12T00:00",
    c: "national",
    cc: "jp",
  },
  {
    t: { en: "Foundation Day", ar: "يوم التأسيس 🇯🇵" },
    d: "2026-02-11T00:00",
    c: "national",
    cc: "jp",
  },
  {
    t: {
      en: "Emperor's Birthday",
      ar: "عيد ميلاد الإمبراطور 🇯🇵",
    },
    d: "2026-02-23T00:00",
    c: "national",
    cc: "jp",
  },
  {
    t: { en: "Golden Week Start", ar: "الأسبوع الذهبي 🇯🇵" },
    d: "2026-04-29T00:00",
    c: "holiday",
    cc: "jp",
  },
  {
    t: { en: "Children's Day", ar: "يوم الأطفال 🇯🇵" },
    d: "2026-05-05T00:00",
    c: "holiday",
    cc: "jp",
  },
  {
    t: { en: "Marine Day", ar: "يوم البحر 🇯🇵" },
    d: "2026-07-20T00:00",
    c: "holiday",
    cc: "jp",
  },
  {
    t: { en: "Mountain Day", ar: "يوم الجبل 🇯🇵" },
    d: "2026-08-11T00:00",
    c: "holiday",
    cc: "jp",
  },
  {
    t: {
      en: "Respect for the Aged",
      ar: "يوم احترام المسنين 🇯🇵",
    },
    d: "2026-09-21T00:00",
    c: "holiday",
    cc: "jp",
  },
  {
    t: { en: "Culture Day", ar: "يوم الثقافة 🇯🇵" },
    d: "2026-11-03T00:00",
    c: "national",
    cc: "jp",
  },
  {
    t: { en: "Asian Games 2026", ar: "الألعاب الآسيوية 🇯🇵" },
    d: "2026-09-19T00:00",
    c: "sports",
    cc: "jp",
  },
  {
    t: { en: "Tokyo Game Show", ar: "معرض طوكيو للألعاب 🇯🇵" },
    d: "2026-09-24T00:00",
    c: "gaming",
    cc: "jp",
  },
  // CHINA
  {
    t: { en: "Chinese New Year", ar: "رأس السنة الصينية 🇨🇳" },
    d: "2026-02-17T00:00",
    c: "holiday",
    cc: "cn",
  },
  {
    t: { en: "Lantern Festival", ar: "مهرجان الفوانيس 🇨🇳" },
    d: "2026-03-03T00:00",
    c: "holiday",
    cc: "cn",
  },
  {
    t: {
      en: "Qingming Festival",
      ar: "مهرجان تشينغ مينغ 🇨🇳",
    },
    d: "2026-04-05T00:00",
    c: "holiday",
    cc: "cn",
  },
  {
    t: { en: "Labour Day", ar: "عيد العمال 🇨🇳" },
    d: "2026-05-01T00:00",
    c: "holiday",
    cc: "cn",
  },
  {
    t: {
      en: "Dragon Boat Festival",
      ar: "قوارب التنين 🇨🇳",
    },
    d: "2026-06-19T00:00",
    c: "holiday",
    cc: "cn",
  },
  {
    t: { en: "Mid-Autumn Festival", ar: "منتصف الخريف 🇨🇳" },
    d: "2026-09-25T00:00",
    c: "holiday",
    cc: "cn",
  },
  {
    t: { en: "National Day", ar: "اليوم الوطني 🇨🇳" },
    d: "2026-10-01T00:00",
    c: "national",
    cc: "cn",
  },
  {
    t: { en: "Singles Day", ar: "يوم العزاب 11.11 🇨🇳" },
    d: "2026-11-11T00:00",
    c: "holiday",
    cc: "cn",
  },
  // INDIA
  {
    t: { en: "Republic Day", ar: "يوم الجمهورية 🇮🇳" },
    d: "2026-01-26T00:00",
    c: "national",
    cc: "in",
  },
  {
    t: {
      en: "Holi",
      ar: "هولي (مهرجان الألوان) 🇮🇳",
    },
    d: "2026-03-04T00:00",
    c: "holiday",
    cc: "in",
  },
  {
    t: { en: "Independence Day", ar: "عيد الاستقلال 🇮🇳" },
    d: "2026-08-15T00:00",
    c: "national",
    cc: "in",
  },
  {
    t: { en: "Gandhi Jayanti", ar: "ذكرى غاندي 🇮🇳" },
    d: "2026-10-02T00:00",
    c: "national",
    cc: "in",
  },
  {
    t: { en: "Diwali", ar: "ديوالي 🇮🇳" },
    d: "2026-11-08T00:00",
    c: "holiday",
    cc: "in",
  },
  {
    t: { en: "Raksha Bandhan", ar: "راكشا باندان 🇮🇳" },
    d: "2026-08-28T00:00",
    c: "holiday",
    cc: "in",
  },
  // SOUTH KOREA
  {
    t: {
      en: "Independence Movement",
      ar: "حركة الاستقلال 🇰🇷",
    },
    d: "2026-03-01T00:00",
    c: "national",
    cc: "kr",
  },
  {
    t: { en: "Children's Day", ar: "عيد الطفل 🇰🇷" },
    d: "2026-05-05T00:00",
    c: "holiday",
    cc: "kr",
  },
  {
    t: { en: "Memorial Day", ar: "يوم الذكرى 🇰🇷" },
    d: "2026-06-06T00:00",
    c: "national",
    cc: "kr",
  },
  {
    t: { en: "Liberation Day", ar: "يوم التحرير 🇰🇷" },
    d: "2026-08-15T00:00",
    c: "national",
    cc: "kr",
  },
  {
    t: {
      en: "Chuseok",
      ar: "عيد الشكر (تشوسوك) 🇰🇷",
    },
    d: "2026-09-25T00:00",
    c: "holiday",
    cc: "kr",
  },
  {
    t: {
      en: "Foundation Day",
      ar: "يوم التأسيس الوطني 🇰🇷",
    },
    d: "2026-10-03T00:00",
    c: "national",
    cc: "kr",
  },
  {
    t: { en: "Hangul Day", ar: "يوم الهانغول 🇰🇷" },
    d: "2026-10-09T00:00",
    c: "national",
    cc: "kr",
  },
  // BRAZIL
  {
    t: { en: "Rio Carnival", ar: "كرنفال ريو 🇧🇷" },
    d: "2026-02-16T00:00",
    c: "holiday",
    cc: "br",
  },
  {
    t: { en: "Tiradentes Day", ar: "يوم تيرادينتيس 🇧🇷" },
    d: "2026-04-21T00:00",
    c: "national",
    cc: "br",
  },
  {
    t: { en: "Independence Day", ar: "عيد الاستقلال 🇧🇷" },
    d: "2026-09-07T00:00",
    c: "national",
    cc: "br",
  },
  {
    t: { en: "Children's Day", ar: "يوم الطفل 🇧🇷" },
    d: "2026-10-12T00:00",
    c: "holiday",
    cc: "br",
  },
  {
    t: { en: "All Souls' Day", ar: "يوم الموتى 🇧🇷" },
    d: "2026-11-02T00:00",
    c: "holiday",
    cc: "br",
  },
  {
    t: {
      en: "Republic Proclamation",
      ar: "إعلان الجمهورية 🇧🇷",
    },
    d: "2026-11-15T00:00",
    c: "national",
    cc: "br",
  },
  {
    t: { en: "F1 Sao Paulo GP", ar: "فورمولا 1 البرازيل 🇧🇷" },
    d: "2026-11-01T14:00",
    c: "sports",
    cc: "br",
  },
  // CANADA
  {
    t: { en: "Victoria Day", ar: "يوم فيكتوريا 🇨🇦" },
    d: "2026-05-18T00:00",
    c: "national",
    cc: "ca",
  },
  {
    t: { en: "Canada Day", ar: "يوم كندا 🇨🇦" },
    d: "2026-07-01T00:00",
    c: "national",
    cc: "ca",
  },
  {
    t: { en: "Labour Day", ar: "عيد العمال 🇨🇦" },
    d: "2026-09-07T00:00",
    c: "national",
    cc: "ca",
  },
  {
    t: { en: "Thanksgiving", ar: "عيد الشكر 🇨🇦" },
    d: "2026-10-12T00:00",
    c: "holiday",
    cc: "ca",
  },
  {
    t: { en: "Remembrance Day", ar: "يوم الذكرى 🇨🇦" },
    d: "2026-11-11T00:00",
    c: "national",
    cc: "ca",
  },
  {
    t: { en: "F1 Canadian GP", ar: "فورمولا 1 كندا 🇨🇦" },
    d: "2026-06-14T14:00",
    c: "sports",
    cc: "ca",
  },
  // AUSTRALIA
  {
    t: { en: "Australia Day", ar: "يوم أستراليا 🇦🇺" },
    d: "2026-01-26T00:00",
    c: "national",
    cc: "au",
  },
  {
    t: { en: "Anzac Day", ar: "يوم أنزاك 🇦🇺" },
    d: "2026-04-25T00:00",
    c: "national",
    cc: "au",
  },
  {
    t: { en: "King's Birthday", ar: "عيد ميلاد الملك 🇦🇺" },
    d: "2026-06-08T00:00",
    c: "national",
    cc: "au",
  },
  {
    t: { en: "Labour Day", ar: "عيد العمال 🇦🇺" },
    d: "2026-10-05T00:00",
    c: "national",
    cc: "au",
  },
  {
    t: {
      en: "Melbourne Cup",
      ar: "كأس ملبورن للخيول 🇦🇺",
    },
    d: "2026-11-03T00:00",
    c: "sports",
    cc: "au",
  },
  {
    t: { en: "F1 Australian GP", ar: "فورمولا 1 أستراليا 🇦🇺" },
    d: "2026-03-15T05:00",
    c: "sports",
    cc: "au",
  },
  {
    t: {
      en: "Australian Open Final",
      ar: "نهائي أستراليا المفتوحة 🇦🇺",
    },
    d: "2026-01-25T08:30",
    c: "sports",
    cc: "au",
  },
  // MEXICO
  {
    t: { en: "Constitution Day", ar: "يوم الدستور 🇲🇽" },
    d: "2026-02-02T00:00",
    c: "national",
    cc: "mx",
  },
  {
    t: {
      en: "Benito Juarez Birthday",
      ar: "ميلاد بينيتو خواريز 🇲🇽",
    },
    d: "2026-03-16T00:00",
    c: "national",
    cc: "mx",
  },
  {
    t: { en: "Labour Day", ar: "عيد العمال 🇲🇽" },
    d: "2026-05-01T00:00",
    c: "national",
    cc: "mx",
  },
  {
    t: { en: "Independence Day", ar: "عيد الاستقلال 🇲🇽" },
    d: "2026-09-16T00:00",
    c: "national",
    cc: "mx",
  },
  {
    t: { en: "Day of the Dead", ar: "يوم الموتى 🇲🇽" },
    d: "2026-11-02T00:00",
    c: "holiday",
    cc: "mx",
  },
  {
    t: { en: "Revolution Day", ar: "عيد الثورة 🇲🇽" },
    d: "2026-11-16T00:00",
    c: "national",
    cc: "mx",
  },
  {
    t: { en: "F1 Mexico GP", ar: "فورمولا 1 المكسيك 🇲🇽" },
    d: "2026-10-25T20:00",
    c: "sports",
    cc: "mx",
  },
  // INDONESIA
  {
    t: {
      en: "Nyepi (Bali New Year)",
      ar: "نيبي (عام الصمت) 🇮🇩",
    },
    d: "2026-03-21T00:00",
    c: "holiday",
    cc: "id",
  },
  {
    t: { en: "Eid al-Fitr", ar: "عيد الفطر 🇮🇩" },
    d: "2026-03-20T00:00",
    c: "islamic",
    cc: "id",
  },
  {
    t: { en: "Waisak Day", ar: "يوم فيساك 🇮🇩" },
    d: "2026-05-31T00:00",
    c: "holiday",
    cc: "id",
  },
  {
    t: { en: "Independence Day", ar: "عيد الاستقلال 🇮🇩" },
    d: "2026-08-17T00:00",
    c: "national",
    cc: "id",
  },
  {
    t: { en: "Pancasila Day", ar: "يوم بانكاسيلا 🇮🇩" },
    d: "2026-06-01T00:00",
    c: "national",
    cc: "id",
  },
  // FUN GLOBAL DAYS
  {
    t: { en: "World Pizza Day 🍕", ar: "يوم البيتزا العالمي 🍕" },
    d: "2026-02-09T00:00",
    c: "holiday",
    cc: "gl",
  },
  {
    t: { en: "Valentine's Day ❤️", ar: "عيد الحب ❤️" },
    d: "2026-02-14T00:00",
    c: "holiday",
    cc: "gl",
  },
  {
    t: {
      en: "Random Acts of Kindness",
      ar: "يوم اللطف العشوائي 🤝",
    },
    d: "2026-02-17T00:00",
    c: "holiday",
    cc: "gl",
  },
  {
    t: { en: "Women's Day ♀️", ar: "يوم المرأة العالمي ♀️" },
    d: "2026-03-08T00:00",
    c: "holiday",
    cc: "gl",
  },
  {
    t: {
      en: "Pi Day (3.14) 🥧",
      ar: "يوم باي (الرياضيات) 🥧",
    },
    d: "2026-03-14T00:00",
    c: "holiday",
    cc: "gl",
  },
  {
    t: {
      en: "World Happiness Day 😊",
      ar: "يوم السعادة العالمي 😊",
    },
    d: "2026-03-20T00:00",
    c: "holiday",
    cc: "gl",
  },
  {
    t: { en: "April Fools 🤡", ar: "كذبة أبريل 🤡" },
    d: "2026-04-01T00:00",
    c: "holiday",
    cc: "gl",
  },
  {
    t: { en: "Earth Day 🌍", ar: "يوم الأرض 🌍" },
    d: "2026-04-22T00:00",
    c: "holiday",
    cc: "gl",
  },
  {
    t: { en: "Star Wars Day 🪐", ar: "يوم حرب النجوم 🪐" },
    d: "2026-05-04T00:00",
    c: "holiday",
    cc: "gl",
  },
  {
    t: {
      en: "World Environment Day 🌳",
      ar: "يوم البيئة العالمي 🌳",
    },
    d: "2026-06-05T00:00",
    c: "holiday",
    cc: "gl",
  },
  {
    t: {
      en: "World Music Day 🎵",
      ar: "يوم الموسيقى العالمي 🎵",
    },
    d: "2026-06-21T00:00",
    c: "holiday",
    cc: "gl",
  },
  {
    t: {
      en: "World Chocolate Day 🍫",
      ar: "يوم الشوكولاتة العالمي 🍫",
    },
    d: "2026-07-07T00:00",
    c: "holiday",
    cc: "gl",
  },
  {
    t: {
      en: "World Emoji Day 😂",
      ar: "يوم الإيموجي العالمي 😂",
    },
    d: "2026-07-17T00:00",
    c: "holiday",
    cc: "gl",
  },
  {
    t: { en: "Mandela Day 🇿🇦", ar: "يوم مانديلا 🇿🇦" },
    d: "2026-07-18T00:00",
    c: "holiday",
    cc: "gl",
  },
  {
    t: {
      en: "World Photography Day 📷",
      ar: "يوم التصوير العالمي 📷",
    },
    d: "2026-08-19T00:00",
    c: "holiday",
    cc: "gl",
  },
  {
    t: { en: "Programmer Day 💻", ar: "يوم المبرمجين 💻" },
    d: "2026-09-13T00:00",
    c: "tech",
    cc: "gl",
  },
  {
    t: {
      en: "International Peace Day ☮️",
      ar: "يوم السلام العالمي ☮️",
    },
    d: "2026-09-21T00:00",
    c: "holiday",
    cc: "gl",
  },
  {
    t: {
      en: "World Tourism Day ✈️",
      ar: "يوم السياحة العالمي ✈️",
    },
    d: "2026-09-27T00:00",
    c: "holiday",
    cc: "gl",
  },
  {
    t: {
      en: "World Coffee Day ☕",
      ar: "يوم القهوة العالمي ☕",
    },
    d: "2026-10-01T00:00",
    c: "holiday",
    cc: "gl",
  },
  {
    t: { en: "Teachers Day 🍎", ar: "عيد المعلم 🍎" },
    d: "2026-10-05T00:00",
    c: "holiday",
    cc: "gl",
  },
  {
    t: { en: "Mental Health Day 🧠", ar: "يوم الصحة النفسية 🧠" },
    d: "2026-10-10T00:00",
    c: "holiday",
    cc: "gl",
  },
  {
    t: { en: "Halloween 🎃", ar: "الهالوين 🎃" },
    d: "2026-10-31T00:00",
    c: "holiday",
    cc: "gl",
  },
  {
    t: {
      en: "Human Rights Day ⚖️",
      ar: "يوم حقوق الإنسان ⚖️",
    },
    d: "2026-12-10T00:00",
    c: "holiday",
    cc: "gl",
  },
  {
    t: { en: "Arabic Language Day", ar: "يوم اللغة العربية 📖" },
    d: "2026-12-18T00:00",
    c: "holiday",
    cc: "gl",
  },
  {
    t: { en: "Christmas 🎄", ar: "الكريسماس 🎄" },
    d: "2026-12-25T00:00",
    c: "holiday",
    cc: "gl",
  },
  // ISLAMIC GLOBAL
  {
    t: { en: "Ramadan Start 🌙", ar: "بداية رمضان 1447 🌙" },
    d: "2026-02-18T00:00",
    c: "islamic",
    cc: "gl",
  },
  {
    t: { en: "Laylat al-Qadr ✨", ar: "ليلة القدر ✨" },
    d: "2026-03-15T00:00",
    c: "islamic",
    cc: "gl",
  },
  {
    t: { en: "Eid al-Fitr 🎉", ar: "عيد الفطر المبارك 🎉" },
    d: "2026-03-20T00:00",
    c: "islamic",
    cc: "gl",
  },
  {
    t: { en: "Arafah Day 🕋", ar: "يوم عرفة 🕋" },
    d: "2026-05-26T00:00",
    c: "islamic",
    cc: "gl",
  },
  {
    t: { en: "Eid al-Adha 🐑", ar: "عيد الأضحى المبارك 🐑" },
    d: "2026-05-27T00:00",
    c: "islamic",
    cc: "gl",
  },
  {
    t: {
      en: "Islamic New Year 1448 🕌",
      ar: "رأس السنة الهجرية 1448 🕌",
    },
    d: "2026-06-16T00:00",
    c: "islamic",
    cc: "gl",
  },
  {
    t: { en: "Ashura 🕌", ar: "يوم عاشوراء 🕌" },
    d: "2026-06-25T00:00",
    c: "islamic",
    cc: "gl",
  },
  {
    t: { en: "Mawlid al-Nabi 💚", ar: "المولد النبوي الشريف 💚" },
    d: "2026-08-25T00:00",
    c: "islamic",
    cc: "gl",
  },
  // MOVIES 2026
  {
    t: { en: "Avengers: Doomsday 🎬", ar: "فيلم المنتقمون 5 🎬" },
    d: "2026-05-01T00:00",
    c: "movie",
    cc: "gl",
  },
  {
    t: {
      en: "The Batman Part II 🦇",
      ar: "فيلم باتمان الجزء 2 🦇",
    },
    d: "2026-10-02T00:00",
    c: "movie",
    cc: "gl",
  },
  {
    t: { en: "Shrek 5 🧟", ar: "فيلم شريك 5 🧟" },
    d: "2026-07-01T00:00",
    c: "movie",
    cc: "gl",
  },
  {
    t: { en: "Toy Story 5 🤠", ar: "فيلم حكاية لعبة 5 🤠" },
    d: "2026-06-19T00:00",
    c: "movie",
    cc: "gl",
  },
  {
    t: {
      en: "Mandalorian & Grogu 🌌",
      ar: "فيلم ماندالوريان 🌌",
    },
    d: "2026-05-22T00:00",
    c: "movie",
    cc: "gl",
  },
  {
    t: {
      en: "Super Mario Movie 2 🍄",
      ar: "فيلم سوبر ماريو 2 🍄",
    },
    d: "2026-04-03T00:00",
    c: "movie",
    cc: "gl",
  },
  {
    t: {
      en: "Project Hail Mary 🚀",
      ar: "فيلم بروجكت هيل ماري 🚀",
    },
    d: "2026-03-20T00:00",
    c: "movie",
    cc: "gl",
  },
  {
    t: {
      en: "Hunger Games: Sunrise 🏹",
      ar: "فيلم هانغر غيمز جديد 🏹",
    },
    d: "2026-11-20T00:00",
    c: "movie",
    cc: "gl",
  },
  {
    t: {
      en: "Teenage Mutant Ninja Turtles 2 🐢",
      ar: "سلاحف النينجا 2 🐢",
    },
    d: "2026-10-09T00:00",
    c: "movie",
    cc: "gl",
  },
  {
    t: { en: "Moana Live Action 🌊", ar: "فيلم موانا (واقعي) 🌊" },
    d: "2026-07-10T00:00",
    c: "movie",
    cc: "gl",
  },
  {
    t: { en: "Oscars 2026 🏆", ar: "حفل الأوسكار 2026 🏆" },
    d: "2026-03-15T17:00",
    c: "movie",
    cc: "gl",
  },
  // GAMING & TECH
  {
    t: {
      en: "GTA VI Launch (Est) 🚗",
      ar: "إطلاق لعبة GTA VI (تقديري) 🚗",
    },
    d: "2026-11-19T00:00",
    c: "gaming",
    cc: "gl",
  },
  {
    t: {
      en: "Nintendo Switch 2 (Est) 🎮",
      ar: "جهاز نينتندو سويتش 2 🎮",
    },
    d: "2026-03-20T00:00",
    c: "gaming",
    cc: "gl",
  },
  {
    t: {
      en: "The Game Awards 2026 🏆",
      ar: "جوائز الألعاب 2026 🏆",
    },
    d: "2026-12-10T00:00",
    c: "gaming",
    cc: "gl",
  },
  {
    t: {
      en: "Google I/O 2026 💻",
      ar: "مؤتمر مطوري جوجل 💻",
    },
    d: "2026-05-10T10:00",
    c: "tech",
    cc: "gl",
  },
  {
    t: {
      en: "Apple WWDC 2026 🍎",
      ar: "مؤتمر أبل للمطورين 🍎",
    },
    d: "2026-06-08T10:00",
    c: "tech",
    cc: "gl",
  },
  {
    t: { en: "iPhone 18 Launch 📱", ar: "إطلاق آيفون 18 📱" },
    d: "2026-09-10T10:00",
    c: "tech",
    cc: "gl",
  },
  {
    t: {
      en: "Samsung Unpacked S26 🇰🇷",
      ar: "مؤتمر سامسونج S26 🇰🇷",
    },
    d: "2026-01-17T10:00",
    c: "tech",
    cc: "gl",
  },
  {
    t: { en: "CES 2027 🤖", ar: "معرض CES 2027 🤖" },
    d: "2027-01-05T09:00",
    c: "tech",
    cc: "gl",
  },
  {
    t: {
      en: "Windows 12 (Rumor) 🪟",
      ar: "ويندوز 12 (إشاعة) 🪟",
    },
    d: "2026-10-25T00:00",
    c: "tech",
    cc: "gl",
  },
  // SHOPPING
  {
    t: { en: "Black Friday 2026 🛍️", ar: "الجمعة البيضاء 🛍️" },
    d: "2026-11-27T00:00",
    c: "shopping",
    cc: "gl",
  },
  {
    t: { en: "Cyber Monday 2026 💻", ar: "سايبر مونداي 💻" },
    d: "2026-11-30T00:00",
    c: "shopping",
    cc: "gl",
  },
  {
    t: {
      en: "11.11 Singles Day 🇨🇳",
      ar: "يوم العزاب 11.11 🇨🇳",
    },
    d: "2026-11-11T00:00",
    c: "shopping",
    cc: "gl",
  },
  {
    t: { en: "Amazon Prime Day 📦", ar: "أمازون برايم داي 📦" },
    d: "2026-07-14T00:00",
    c: "shopping",
    cc: "gl",
  },
  {
    t: {
      en: "Steam Summer Sale 🎮",
      ar: "تخفيضات ستيم الصيفية 🎮",
    },
    d: "2026-06-25T18:00",
    c: "shopping",
    cc: "gl",
  },
];

// ─── Confetti ─────────────────────────────────────────────────────────────────

function launchConfetti() {
  const colors = [
    "#38bdf8",
    "#0ea5e9",
    "#7dd3fc",
    "#f472b6",
    "#a78bfa",
    "#34d399",
    "#fbbf24",
  ];
  for (let i = 0; i < 60; i++) {
    const el = document.createElement("div");
    el.className = "confetti-particle";
    const size = Math.random() * 8 + 4;
    el.style.cssText = `
      left: ${Math.random() * 100}vw;
      top: -10px;
      width: ${size}px;
      height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${Math.random() * 1.5 + 1.5}s;
      animation-delay: ${Math.random() * 0.5}s;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }
}

// ─── Utilities ───────────────────────────────────────────────────────────────

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function computeCountdown(
  target: Date,
  now: Date,
): {
  status: CountdownStatus;
  time: CountdownTime;
  daysAgo: number;
} {
  const diff = target.getTime() - now.getTime();

  if (diff > 0) {
    return {
      status: "upcoming",
      time: {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((diff % (1000 * 60)) / 1000),
      },
      daysAgo: 0,
    };
  }
  if (diff > -86400000) {
    return {
      status: "live",
      time: { days: 0, hours: 0, mins: 0, secs: 0 },
      daysAgo: 0,
    };
  }
  return {
    status: "ended",
    time: { days: 0, hours: 0, mins: 0, secs: 0 },
    daysAgo: Math.floor(Math.abs(diff) / (1000 * 60 * 60 * 24)),
  };
}

const CUSTOM_EVENTS_KEY = "tw_custom_events";
const NOTIF_KEY = "tw_notif_subs";

function loadCustomEvents(): EventItem[] {
  try {
    const raw = localStorage.getItem(CUSTOM_EVENTS_KEY);
    if (raw) return JSON.parse(raw) as EventItem[];
  } catch {
    // ignore
  }
  return [];
}

function saveCustomEvents(events: EventItem[]) {
  localStorage.setItem(CUSTOM_EVENTS_KEY, JSON.stringify(events));
}

function loadNotifSubs(): string[] {
  try {
    const raw = localStorage.getItem(NOTIF_KEY);
    if (raw) return JSON.parse(raw) as string[];
  } catch {
    /* ignore */
  }
  return [];
}

function saveNotifSubs(subs: string[]) {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(subs));
}

// Schedule a notification ~24h before an event (only if < 7 days away)
function scheduleNotification(event: EventItem) {
  if (typeof Notification === "undefined") return;
  const target = new Date(event.d);
  const notifTime = target.getTime() - 24 * 60 * 60 * 1000;
  const delay = notifTime - Date.now();
  if (delay > 0 && delay < 7 * 24 * 60 * 60 * 1000) {
    setTimeout(() => {
      try {
        new Notification(`⏰ ${event.t.en} is tomorrow!`, {
          body: target.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          icon: "/favicon.ico",
        });
      } catch {
        /* ignore */
      }
    }, delay);
  }
}

// Country code → flag + name map
const countryMap: Record<string, { flag: string; en: string; ar: string }> = {
  gl: { flag: "🌍", en: "Global", ar: "عالمي" },
  dz: { flag: "🇩🇿", en: "Algeria", ar: "الجزائر" },
  sa: { flag: "🇸🇦", en: "Saudi Arabia", ar: "السعودية" },
  eg: { flag: "🇪🇬", en: "Egypt", ar: "مصر" },
  ae: { flag: "🇦🇪", en: "UAE", ar: "الإمارات" },
  us: { flag: "🇺🇸", en: "USA", ar: "أمريكا" },
  uk: { flag: "🇬🇧", en: "UK", ar: "بريطانيا" },
  fr: { flag: "🇫🇷", en: "France", ar: "فرنسا" },
  de: { flag: "🇩🇪", en: "Germany", ar: "ألمانيا" },
  it: { flag: "🇮🇹", en: "Italy", ar: "إيطاليا" },
  es: { flag: "🇪🇸", en: "Spain", ar: "إسبانيا" },
  tr: { flag: "🇹🇷", en: "Turkey", ar: "تركيا" },
  jp: { flag: "🇯🇵", en: "Japan", ar: "اليابان" },
  cn: { flag: "🇨🇳", en: "China", ar: "الصين" },
  in: { flag: "🇮🇳", en: "India", ar: "الهند" },
  kr: { flag: "🇰🇷", en: "S. Korea", ar: "كوريا ج" },
  br: { flag: "🇧🇷", en: "Brazil", ar: "البرازيل" },
  ca: { flag: "🇨🇦", en: "Canada", ar: "كندا" },
  au: { flag: "🇦🇺", en: "Australia", ar: "أستراليا" },
  mx: { flag: "🇲🇽", en: "Mexico", ar: "المكسيك" },
  id: { flag: "🇮🇩", en: "Indonesia", ar: "إندونيسيا" },
};

// ─── Balloon Overlay ─────────────────────────────────────────────────────────

interface BalloonProps {
  show: boolean;
}

const BALLOON_COLORS = [
  "oklch(0.72 0.22 25)", // red-orange
  "oklch(0.78 0.2 55)", // amber
  "oklch(0.82 0.18 100)", // lime
  "oklch(0.75 0.2 160)", // emerald
  "oklch(0.72 0.2 200)", // cyan
  "oklch(0.65 0.2 250)", // blue
  "oklch(0.68 0.22 310)", // purple
  "oklch(0.72 0.22 350)", // pink
];

interface BalloonData {
  id: number;
  left: number;
  color: string;
  size: number;
  duration: number;
  delay: number;
}

function generateBalloons(): BalloonData[] {
  return Array.from({ length: 14 }, (_, i) => ({
    id: i,
    left: 4 + Math.random() * 92,
    color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
    size: 38 + Math.random() * 28,
    duration: 7 + Math.random() * 5,
    delay: Math.random() * 4,
  }));
}

function BalloonOverlay({ show }: BalloonProps) {
  const [balloons] = useState<BalloonData[]>(generateBalloons);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (show) {
      setKey((k) => k + 1);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 40 }}
    >
      {balloons.map((b) => (
        <div
          key={`${key}-${b.id}`}
          className="balloon"
          style={{
            left: `${b.left}%`,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
        >
          <div
            className="balloon-body"
            style={{
              width: `${b.size}px`,
              height: `${b.size * 1.2}px`,
              background: b.color,
              color: b.color,
              opacity: 0.85,
              boxShadow: `0 4px 16px ${b.color}44`,
            }}
          />
          <div className="balloon-string" />
        </div>
      ))}
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function CountdownBox({
  value,
  label,
  isSeconds,
  isLive,
}: {
  value: number;
  label: string;
  isSeconds?: boolean;
  isLive?: boolean;
}) {
  return (
    <div
      className={`glass-card p-6 md:p-10 rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden group ${isLive ? "live-box" : ""}`}
    >
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl -mr-12 -mt-12 opacity-20 group-hover:opacity-35 transition-opacity"
        style={{
          background: isLive ? "oklch(0.55 0.22 160)" : "oklch(0.65 0.18 220)",
        }}
      />
      <span
        className={`block font-mono text-5xl md:text-7xl font-black leading-none tracking-tighter ${isSeconds ? "hero-num-secs" : "hero-num"}`}
      >
        {pad(value)}
      </span>
      <p
        className={`text-[10px] md:text-xs font-black mt-3 uppercase tracking-[0.25em] ${isSeconds ? "" : "opacity-50"}`}
        style={{
          color: isSeconds
            ? "oklch(0.72 0.16 215)"
            : isLive
              ? "oklch(0.7 0.18 160)"
              : undefined,
        }}
      >
        {label}
      </p>
    </div>
  );
}

interface EventCardProps {
  event: EventItem;
  lang: Lang;
  now: Date;
  onSelect: (event: EventItem) => void;
  isHistory: boolean;
  isSubscribed: boolean;
  onToggleNotif: (event: EventItem) => void;
}

function EventCard({
  event,
  lang,
  now,
  onSelect,
  isHistory,
  isSubscribed,
  onToggleNotif,
}: EventCardProps) {
  const dateObj = new Date(event.d);
  const diff = now.getTime() - dateObj.getTime();
  const isPast = dateObj < now;
  const isLive = isPast && diff < 86400000;
  const daysDiff = Math.ceil(
    Math.abs(dateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  const dateStr = dateObj.toLocaleDateString(
    lang === "ar" ? "ar-DZ" : "en-US",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );

  const catObj = categories.find((c) => c.id === event.c) || {
    icon: "📅",
    id: "",
    en: "",
    ar: "",
  };

  let badge: string;
  let badgeClass = "";

  if (isLive) {
    badge = lang === "ar" ? "🔴 مباشر" : "🔴 LIVE";
    badgeClass = "live-event-badge";
  } else if (!isPast) {
    badge =
      lang === "ar"
        ? `${daysDiff} ${i18n.ar.daysLeft}`
        : `${daysDiff} ${i18n.en.daysLeft}`;
  } else {
    badge =
      lang === "ar"
        ? `منذ ${daysDiff} ${i18n.ar.endedAgo}`
        : `${daysDiff} ${i18n.en.endedAgo}`;
  }

  return (
    <div
      data-category={event.c}
      className={`glass-card p-5 rounded-2xl relative overflow-hidden group event-card-accent ${isHistory && !isLive ? "history-item" : ""}`}
    >
      <div
        className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl -mr-10 -mt-10 opacity-10 group-hover:opacity-25 transition-opacity"
        style={{ background: "oklch(0.65 0.18 220)" }}
      />
      <div className="flex justify-between items-start mb-3">
        <span className="text-xl">{catObj.icon}</span>
        <div className="flex items-center gap-1.5">
          {/* Bell notification button — only for future events */}
          {!isPast && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleNotif(event);
              }}
              className="text-sm w-6 h-6 flex items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95"
              style={{ opacity: isSubscribed ? 1 : 0.35 }}
              title={isSubscribed ? "Remove reminder" : "Remind me 24h before"}
            >
              {isSubscribed ? "🔔" : "🔕"}
            </button>
          )}
          <span
            className={`text-[10px] font-black rounded-lg px-2 py-1 ${badgeClass}`}
            style={
              !badgeClass
                ? {
                    background: "oklch(0.15 0.025 245 / 0.8)",
                    color: "oklch(0.65 0.12 220)",
                  }
                : undefined
            }
          >
            {badge}
          </span>
        </div>
      </div>
      <button
        type="button"
        className="text-left w-full cursor-pointer"
        onClick={() => onSelect(event)}
      >
        <h4 className="text-sm font-bold leading-tight mb-1.5">
          {event.t[lang]}
        </h4>
        <p className="text-[11px] opacity-60 font-medium">{dateStr}</p>
      </button>
    </div>
  );
}

// ─── Stats View ──────────────────────────────────────────────────────────────

function StatsView({
  lang,
  isLight,
  now,
  onBack,
}: { lang: Lang; isLight: boolean; now: Date; onBack: () => void }) {
  const allEvents = eventsData;
  const upcoming = allEvents.filter((e) => new Date(e.d) > now);
  const past = allEvents.filter((e) => {
    const diff = now.getTime() - new Date(e.d).getTime();
    return diff > 86400000;
  });
  const liveToday = allEvents.filter((e) => {
    const diff = now.getTime() - new Date(e.d).getTime();
    return diff >= 0 && diff < 86400000;
  });

  // By category counts
  const catCounts = categories
    .filter((c) => c.id !== "all")
    .map((cat) => ({
      ...cat,
      count: allEvents.filter((e) => e.c === cat.id).length,
    }))
    .sort((a, b) => b.count - a.count);
  const maxCat = Math.max(...catCounts.map((c) => c.count), 1);

  // By country counts (top 10)
  const countryCounts: Record<string, number> = {};
  for (const e of allEvents) {
    if (e.cc !== "gl") {
      countryCounts[e.cc] = (countryCounts[e.cc] || 0) + 1;
    }
  }
  const topCountries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([cc, count]) => ({ cc, count, info: countryMap[cc] }));
  const maxCountry = Math.max(...topCountries.map((c) => c.count), 1);

  // Next 5 upcoming
  const next5 = upcoming
    .sort((a, b) => new Date(a.d).getTime() - new Date(b.d).getTime())
    .slice(0, 5);

  const cardBg = isLight
    ? "oklch(1 0 0 / 0.85)"
    : "oklch(0.12 0.025 245 / 0.5)";
  const borderC = isLight
    ? "oklch(0.52 0.2 225 / 0.2)"
    : "oklch(0.65 0.18 220 / 0.12)";
  const textMuted = isLight ? "oklch(0.4 0.04 240)" : "oklch(0.6 0.05 225)";

  return (
    <div className="max-w-4xl mx-auto py-4 pb-20">
      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-sm font-bold opacity-60 hover:opacity-100 transition"
        style={{
          color: isLight ? "oklch(0.3 0.06 240)" : "oklch(0.75 0.1 220)",
        }}
      >
        {lang === "ar" ? "→ العودة للرئيسية" : "← Back to Home"}
      </button>

      <h2
        className="text-3xl font-black mb-2"
        style={{
          color: isLight ? "oklch(0.12 0.03 245)" : "oklch(0.96 0.02 220)",
        }}
      >
        {lang === "ar" ? "📊 إحصائيات المنصة" : "📊 Platform Stats"}
      </h2>
      <p className="text-sm mb-10 opacity-50">
        {lang === "ar"
          ? "نظرة عامة على جميع الأحداث"
          : "Overview of all global events"}
      </p>

      {/* Hero Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          {
            label: lang === "ar" ? "إجمالي الأحداث" : "Total Events",
            value: allEvents.length,
            icon: "🌍",
            color: "oklch(0.65 0.18 220)",
          },
          {
            label: lang === "ar" ? "أحداث قادمة" : "Upcoming",
            value: upcoming.length,
            icon: "⏳",
            color: "oklch(0.72 0.18 55)",
          },
          {
            label: lang === "ar" ? "أحداث منتهية" : "Past Events",
            value: past.length,
            icon: "📂",
            color: "oklch(0.55 0.06 230)",
          },
          {
            label: lang === "ar" ? "أحداث اليوم" : "Live Today",
            value: liveToday.length,
            icon: "🔴",
            color: "oklch(0.65 0.22 145)",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl p-5 text-center flex flex-col items-center gap-2"
            style={{ background: cardBg, border: `1px solid ${borderC}` }}
          >
            <span className="text-3xl">{item.icon}</span>
            <span className="text-4xl font-black" style={{ color: item.color }}>
              {item.value}
            </span>
            <span className="text-xs font-bold opacity-60">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* By Category */}
        <div
          className="rounded-2xl p-6"
          style={{ background: cardBg, border: `1px solid ${borderC}` }}
        >
          <h3 className="text-base font-black mb-5 flex items-center gap-2">
            <span>🏷️</span> {lang === "ar" ? "حسب الفئة" : "By Category"}
          </h3>
          <div className="space-y-3">
            {catCounts.map((cat) => (
              <div key={cat.id}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <span>{cat.icon}</span>
                    <span>{cat[lang]}</span>
                  </span>
                  <span
                    className="text-xs font-black"
                    style={{ color: "oklch(0.65 0.18 220)" }}
                  >
                    {cat.count}
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{
                    background: isLight
                      ? "oklch(0.88 0.03 220)"
                      : "oklch(0.18 0.03 240)",
                  }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(cat.count / maxCat) * 100}%`,
                      background:
                        "linear-gradient(90deg, oklch(0.58 0.2 225), oklch(0.72 0.16 215))",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Countries */}
        <div
          className="rounded-2xl p-6"
          style={{ background: cardBg, border: `1px solid ${borderC}` }}
        >
          <h3 className="text-base font-black mb-5 flex items-center gap-2">
            <span>🗺️</span>{" "}
            {lang === "ar" ? "أكثر الدول أحداثًا" : "Top Countries"}
          </h3>
          <div className="space-y-3">
            {topCountries.map(({ cc, count, info }) => (
              <div key={cc}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <span>{info?.flag || "🌐"}</span>
                    <span>{info ? info[lang] : cc.toUpperCase()}</span>
                  </span>
                  <span
                    className="text-xs font-black"
                    style={{ color: "oklch(0.65 0.2 145)" }}
                  >
                    {count}
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{
                    background: isLight
                      ? "oklch(0.88 0.03 220)"
                      : "oklch(0.18 0.03 240)",
                  }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(count / maxCountry) * 100}%`,
                      background:
                        "linear-gradient(90deg, oklch(0.55 0.2 160), oklch(0.68 0.18 145))",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Next 5 Upcoming */}
      <div
        className="rounded-2xl p-6"
        style={{ background: cardBg, border: `1px solid ${borderC}` }}
      >
        <h3 className="text-base font-black mb-5 flex items-center gap-2">
          <span>⏳</span>{" "}
          {lang === "ar" ? "أقرب 5 أحداث قادمة" : "Next 5 Upcoming Events"}
        </h3>
        <div className="space-y-3">
          {next5.map((e, idx) => {
            const d = new Date(e.d);
            const daysLeft = Math.ceil(
              (d.getTime() - now.getTime()) / 86400000,
            );
            const catObj = categories.find((c) => c.id === e.c) || {
              icon: "📅",
            };
            return (
              <div
                key={`${e.d}-${idx}`}
                className="flex items-center justify-between py-3 px-4 rounded-xl"
                style={{
                  background: isLight
                    ? "oklch(0.94 0.015 220)"
                    : "oklch(0.1 0.02 245 / 0.6)",
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl flex-shrink-0">{catObj.icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{e.t[lang]}</p>
                    <p className="text-xs mt-0.5" style={{ color: textMuted }}>
                      {d.toLocaleDateString(lang === "ar" ? "ar-DZ" : "en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0 ms-4 text-right">
                  <span
                    className="text-sm font-black"
                    style={{ color: "oklch(0.65 0.18 220)" }}
                  >
                    {daysLeft}
                  </span>
                  <span className="text-xs ml-1" style={{ color: textMuted }}>
                    {lang === "ar" ? "يوم" : "days"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Widget Builder View ──────────────────────────────────────────────────────

interface WidgetBuilderProps {
  lang: Lang;
  isLight: boolean;
  widgetSelectedEvent: EventItem | null;
  setWidgetSelectedEvent: (e: EventItem | null) => void;
  widgetLang: Lang;
  setWidgetLang: (l: Lang) => void;
  widgetSearch: string;
  setWidgetSearch: (s: string) => void;
  now: Date;
  showToast: (msg: string) => void;
  onBack: () => void;
}

function WidgetBuilderView({
  lang,
  isLight,
  widgetSelectedEvent,
  setWidgetSelectedEvent,
  widgetLang,
  setWidgetLang,
  widgetSearch,
  setWidgetSearch,
  now,
  showToast,
  onBack,
}: WidgetBuilderProps) {
  const cardBg = isLight
    ? "oklch(1 0 0 / 0.85)"
    : "oklch(0.12 0.025 245 / 0.5)";
  const borderC = isLight
    ? "oklch(0.52 0.2 225 / 0.2)"
    : "oklch(0.65 0.18 220 / 0.12)";

  const filtered = eventsData
    .filter((e) => {
      if (!widgetSearch) return true;
      return (
        e.t.en.toLowerCase().includes(widgetSearch.toLowerCase()) ||
        e.t.ar.includes(widgetSearch)
      );
    })
    .slice(0, 30);

  const iframeUrl = widgetSelectedEvent
    ? `${window.location.origin}${window.location.pathname}?widget=1&e=${encodeURIComponent(widgetSelectedEvent.t.en)}&d=${encodeURIComponent(widgetSelectedEvent.d)}&lang=${widgetLang}`
    : "";

  const iframeCode = widgetSelectedEvent
    ? `<iframe src="${iframeUrl}" width="300" height="120" frameborder="0" scrolling="no" style="border-radius:16px;overflow:hidden;"></iframe>`
    : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(iframeCode).then(() => {
      showToast(lang === "ar" ? "تم نسخ الكود! 📋" : "Code Copied! 📋");
    });
  };

  // Preview countdown
  const widgetTarget = widgetSelectedEvent
    ? new Date(widgetSelectedEvent.d)
    : null;
  const widgetDiff = widgetTarget ? widgetTarget.getTime() - now.getTime() : 0;
  const widgetDays = widgetDiff > 0 ? Math.floor(widgetDiff / 86400000) : 0;
  const widgetHours =
    widgetDiff > 0 ? Math.floor((widgetDiff % 86400000) / 3600000) : 0;
  const widgetMins =
    widgetDiff > 0 ? Math.floor((widgetDiff % 3600000) / 60000) : 0;
  const widgetIsLive = widgetTarget
    ? now.getTime() - widgetTarget.getTime() >= 0 &&
      now.getTime() - widgetTarget.getTime() < 86400000
    : false;

  return (
    <div className="max-w-3xl mx-auto py-4 pb-20">
      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-sm font-bold opacity-60 hover:opacity-100 transition"
        style={{
          color: isLight ? "oklch(0.3 0.06 240)" : "oklch(0.75 0.1 220)",
        }}
      >
        {lang === "ar" ? "→ العودة للرئيسية" : "← Back to Home"}
      </button>

      <h2
        className="text-3xl font-black mb-2"
        style={{
          color: isLight ? "oklch(0.12 0.03 245)" : "oklch(0.96 0.02 220)",
        }}
      >
        {lang === "ar"
          ? "🔗 بناء ويدجت قابل للتضمين"
          : "🔗 Embed Widget Builder"}
      </h2>
      <p className="text-sm mb-8 opacity-50">
        {lang === "ar"
          ? "أنشئ ويدجت عد تنازلي لتضمينه في موقعك"
          : "Create a countdown widget to embed on your site"}
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: Config */}
        <div className="space-y-4">
          {/* Search & select event */}
          <div
            className="rounded-2xl p-5"
            style={{ background: cardBg, border: `1px solid ${borderC}` }}
          >
            <h3 className="text-sm font-black mb-3 opacity-70">
              {lang === "ar" ? "1. اختر حدثًا" : "1. Select Event"}
            </h3>
            <input
              type="text"
              value={widgetSearch}
              onChange={(e) => setWidgetSearch(e.target.value)}
              placeholder={lang === "ar" ? "بحث عن حدث..." : "Search events..."}
              className="custom-input mb-3"
              style={{ fontSize: "0.8rem", padding: "0.6rem 0.875rem" }}
            />
            <div className="space-y-1 max-h-52 overflow-y-auto">
              {filtered.map((e, idx) => {
                const catObj = categories.find((c) => c.id === e.c) || {
                  icon: "📅",
                };
                const isSelected =
                  widgetSelectedEvent?.d === e.d &&
                  widgetSelectedEvent?.t.en === e.t.en;
                return (
                  <button
                    key={`${e.d}-${idx}`}
                    type="button"
                    onClick={() => setWidgetSelectedEvent(e)}
                    className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 text-xs font-bold transition"
                    style={{
                      background: isSelected
                        ? "linear-gradient(135deg, oklch(0.58 0.2 225 / 0.25), oklch(0.72 0.16 215 / 0.15))"
                        : isLight
                          ? "oklch(0.94 0.015 220)"
                          : "oklch(0.1 0.02 245 / 0.5)",
                      border: isSelected
                        ? "1px solid oklch(0.65 0.18 220 / 0.5)"
                        : "1px solid transparent",
                      color: isLight
                        ? "oklch(0.15 0.04 245)"
                        : "oklch(0.9 0.03 220)",
                    }}
                  >
                    <span>{catObj.icon}</span>
                    <span className="truncate">
                      {e.t[lang === "ar" ? "ar" : "en"]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language */}
          <div
            className="rounded-2xl p-5"
            style={{ background: cardBg, border: `1px solid ${borderC}` }}
          >
            <h3 className="text-sm font-black mb-3 opacity-70">
              {lang === "ar" ? "2. لغة الويدجت" : "2. Widget Language"}
            </h3>
            <div className="flex gap-2">
              {(["en", "ar"] as Lang[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setWidgetLang(l)}
                  className="flex-1 py-2 rounded-xl text-xs font-black transition"
                  style={{
                    background:
                      widgetLang === l
                        ? "linear-gradient(135deg, oklch(0.58 0.2 225), oklch(0.72 0.16 215))"
                        : isLight
                          ? "oklch(0.92 0.02 220)"
                          : "oklch(0.14 0.025 245)",
                    color:
                      widgetLang === l
                        ? "white"
                        : isLight
                          ? "oklch(0.3 0.04 245)"
                          : "oklch(0.7 0.06 225)",
                    border:
                      widgetLang === l
                        ? "none"
                        : `1px solid ${isLight ? "oklch(0.52 0.2 225 / 0.2)" : "oklch(0.65 0.18 220 / 0.15)"}`,
                  }}
                >
                  {l === "en" ? "🇺🇸 English" : "🇩🇿 العربية"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Preview + code */}
        <div className="space-y-4">
          {/* Preview */}
          <div
            className="rounded-2xl p-5"
            style={{ background: cardBg, border: `1px solid ${borderC}` }}
          >
            <h3 className="text-sm font-black mb-3 opacity-70">
              {lang === "ar" ? "معاينة الويدجت" : "Widget Preview"}
            </h3>
            {widgetSelectedEvent ? (
              <div
                className="rounded-2xl p-4 flex items-center gap-4"
                style={{
                  background: isLight
                    ? "oklch(0.96 0.015 220)"
                    : "oklch(0.08 0.02 250)",
                  border: "1px solid oklch(0.65 0.18 220 / 0.2)",
                  width: "300px",
                  maxWidth: "100%",
                }}
                dir={widgetLang === "ar" ? "rtl" : "ltr"}
              >
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs font-black truncate"
                    style={{ color: "oklch(0.65 0.18 220)" }}
                  >
                    ⏱ TimeWait
                  </p>
                  <p
                    className="text-sm font-black truncate mt-0.5"
                    style={{
                      color: isLight
                        ? "oklch(0.12 0.03 245)"
                        : "oklch(0.95 0.02 220)",
                    }}
                  >
                    {widgetSelectedEvent.t[widgetLang]}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right" dir="ltr">
                  {widgetIsLive ? (
                    <div
                      className="text-sm font-black"
                      style={{ color: "oklch(0.65 0.22 145)" }}
                    >
                      🔴 LIVE
                    </div>
                  ) : widgetDiff > 0 ? (
                    <>
                      <div
                        className="text-2xl font-black font-mono leading-none"
                        style={{ color: "oklch(0.65 0.18 220)" }}
                      >
                        {pad(widgetDays)}
                      </div>
                      <div className="text-[9px] font-bold opacity-50 uppercase tracking-widest">
                        {widgetLang === "ar" ? "يوم" : "DAYS"}
                      </div>
                      <div className="text-xs font-mono opacity-60 mt-0.5">
                        {pad(widgetHours)}:{pad(widgetMins)}
                      </div>
                    </>
                  ) : (
                    <div className="text-xs font-bold opacity-50">
                      {widgetLang === "ar" ? "انتهى" : "Ended"}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 opacity-30 text-sm">
                {lang === "ar"
                  ? "اختر حدثًا لمعاينة الويدجت"
                  : "Select an event to preview"}
              </div>
            )}
          </div>

          {/* Generated code */}
          {widgetSelectedEvent && (
            <div
              className="rounded-2xl p-5"
              style={{ background: cardBg, border: `1px solid ${borderC}` }}
            >
              <h3 className="text-sm font-black mb-3 opacity-70">
                {lang === "ar" ? "كود التضمين" : "Embed Code"}
              </h3>
              <div
                className="rounded-xl p-3 text-[11px] font-mono leading-relaxed break-all mb-3"
                style={{
                  background: isLight
                    ? "oklch(0.92 0.02 220)"
                    : "oklch(0.08 0.02 250)",
                  color: isLight
                    ? "oklch(0.3 0.04 245)"
                    : "oklch(0.7 0.06 225)",
                  border: `1px solid ${isLight ? "oklch(0.52 0.2 225 / 0.2)" : "oklch(0.65 0.18 220 / 0.1)"}`,
                }}
              >
                {iframeCode}
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="w-full py-2.5 rounded-xl text-xs font-black text-white transition hover:opacity-90 active:scale-95"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.58 0.2 225), oklch(0.72 0.16 215))",
                  boxShadow: "0 4px 16px oklch(0.58 0.2 225 / 0.35)",
                }}
              >
                {lang === "ar" ? "📋 نسخ الكود" : "📋 Copy Code"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Widget Embed View (minimal iframe content) ────────────────────────────

function WidgetEmbedView({
  event,
  lang,
  now,
}: { event: EventItem; lang: Lang; now: Date }) {
  const target = new Date(event.d);
  const diff = target.getTime() - now.getTime();
  const isLive =
    now.getTime() - target.getTime() >= 0 &&
    now.getTime() - target.getTime() < 86400000;
  const days = diff > 0 ? Math.floor(diff / 86400000) : 0;
  const hours = diff > 0 ? Math.floor((diff % 86400000) / 3600000) : 0;
  const mins = diff > 0 ? Math.floor((diff % 3600000) / 60000) : 0;
  const secs = diff > 0 ? Math.floor((diff % 60000) / 1000) : 0;

  return (
    <div
      className="flex items-center gap-4 p-4 rounded-2xl"
      style={{
        background: "oklch(0.08 0.02 250)",
        minHeight: "120px",
        border: "1px solid oklch(0.65 0.18 220 / 0.2)",
      }}
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="flex-1 min-w-0">
        <p
          className="text-[10px] font-black uppercase tracking-widest mb-1"
          style={{ color: "oklch(0.65 0.18 220)" }}
        >
          ⏱ TimeWait Ultra
        </p>
        <p
          className="text-sm font-black leading-tight truncate"
          style={{ color: "oklch(0.95 0.02 220)" }}
        >
          {event.t[lang]}
        </p>
      </div>
      <div className="flex-shrink-0 text-right" dir="ltr">
        {isLive ? (
          <div
            className="text-lg font-black"
            style={{ color: "oklch(0.65 0.22 145)" }}
          >
            🔴 LIVE
          </div>
        ) : diff > 0 ? (
          <>
            <div
              className="text-3xl font-black font-mono leading-none"
              style={{ color: "oklch(0.75 0.16 215)" }}
            >
              {pad(days)}
            </div>
            <div className="text-[9px] font-bold opacity-50 uppercase tracking-widest">
              {lang === "ar" ? "يوم" : "DAYS"}
            </div>
            <div
              className="text-xs font-mono mt-1"
              style={{ color: "oklch(0.65 0.18 220)" }}
            >
              {pad(hours)}:{pad(mins)}:{pad(secs)}
            </div>
          </>
        ) : (
          <div className="text-xs font-bold opacity-50">
            {lang === "ar" ? "انتهى" : "Ended"}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Event Page View ──────────────────────────────────────────────────────────

function EventPageView({
  event,
  lang,
  isLight,
  now,
  showToast,
  onBack,
}: {
  event: EventItem;
  lang: Lang;
  isLight: boolean;
  now: Date;
  showToast: (msg: string) => void;
  onBack: () => void;
}) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(iv);
  }, []);
  // tick is used to force re-render for live countdown
  void tick;

  const target = new Date(event.d);
  const { status, time, daysAgo } = computeCountdown(target, now);
  const isLive = status === "live";
  const catObj = categories.find((c) => c.id === event.c) || {
    icon: "📅",
    id: "",
    en: "",
    ar: "",
  };

  const heroTitle =
    status === "live"
      ? event.t[lang]
      : status === "ended"
        ? lang === "ar"
          ? `انتهى منذ ${daysAgo} يوم`
          : `Ended ${daysAgo} days ago`
        : event.t[lang];

  const dateStr = target.toLocaleDateString(lang === "ar" ? "ar-DZ" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}?page=event&e=${encodeURIComponent(event.t.en)}&d=${encodeURIComponent(event.d)}`;
    navigator.clipboard.writeText(url).then(() => {
      showToast(lang === "ar" ? "تم نسخ الرابط! 🔗" : "Link Copied! 🔗");
    });
  };

  const statusDotClass =
    status === "live"
      ? "status-dot-live"
      : status === "ended"
        ? "status-dot-ended"
        : "status-dot-active";

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 pb-20 relative">
      {/* Balloons for live events */}
      <BalloonOverlay show={isLive} />

      {/* Glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-80 blur-[120px] -z-10 rounded-full pointer-events-none"
        style={{
          background: isLive
            ? "oklch(0.55 0.22 160 / 0.1)"
            : "oklch(0.65 0.18 220 / 0.08)",
        }}
      />

      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        className="mb-10 flex items-center gap-2 text-sm font-bold opacity-60 hover:opacity-100 transition"
        style={{
          color: isLight ? "oklch(0.3 0.06 240)" : "oklch(0.75 0.1 220)",
        }}
      >
        {lang === "ar" ? "→ كل الأحداث" : "← All Events"}
      </button>

      {/* Category icon */}
      <div className="text-5xl mb-4">{catObj.icon}</div>

      {/* Status badge */}
      <div
        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 ${isLive ? "live-badge-ring" : ""}`}
        style={{
          background: isLive
            ? "oklch(0.55 0.22 160 / 0.12)"
            : "oklch(0.65 0.18 220 / 0.1)",
          border: isLive
            ? "1px solid oklch(0.55 0.22 160 / 0.3)"
            : "1px solid oklch(0.65 0.18 220 / 0.2)",
          color: isLive ? "oklch(0.75 0.2 155)" : "oklch(0.72 0.16 215)",
        }}
      >
        <span className={statusDotClass} />
        <span>
          {isLive
            ? lang === "ar"
              ? "مباشر الآن"
              : "LIVE NOW"
            : status === "ended"
              ? lang === "ar"
                ? "انتهى"
                : "ENDED"
              : lang === "ar"
                ? "قادم"
                : "UPCOMING"}
        </span>
      </div>

      {/* Title */}
      <h1
        className="text-4xl sm:text-6xl md:text-8xl font-black mb-4 text-center leading-tight tracking-tight px-4 max-w-5xl"
        style={{
          color: isLive
            ? "oklch(0.85 0.14 155)"
            : isLight
              ? "oklch(0.10 0.04 245)"
              : "oklch(0.97 0.02 220)",
          textShadow: isLight
            ? "0 2px 16px oklch(0.52 0.2 225 / 0.15)"
            : "0 2px 30px oklch(0.65 0.18 220 / 0.35)",
        }}
      >
        {heroTitle}
      </h1>

      {/* Date */}
      <p
        className="text-base md:text-lg font-semibold mb-10 opacity-60"
        style={{ color: "oklch(0.72 0.16 215)" }}
      >
        {dateStr}
      </p>

      {/* Countdown boxes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-3xl w-full px-4 mb-10">
        {[
          {
            value: status === "upcoming" ? time.days : 0,
            label: lang === "ar" ? "يوم" : "DAYS",
            isSeconds: false,
          },
          {
            value: status === "upcoming" ? time.hours : 0,
            label: lang === "ar" ? "ساعة" : "HOURS",
            isSeconds: false,
          },
          {
            value: status === "upcoming" ? time.mins : 0,
            label: lang === "ar" ? "دقيقة" : "MINS",
            isSeconds: false,
          },
          {
            value: status === "upcoming" ? time.secs : 0,
            label: lang === "ar" ? "ثانية" : "SECS",
            isSeconds: true,
          },
        ].map(({ value, label, isSeconds }) => (
          <CountdownBox
            key={label}
            value={value}
            label={label}
            isSeconds={isSeconds}
            isLive={isLive}
          />
        ))}
      </div>

      {/* Share button */}
      <button
        type="button"
        onClick={handleShare}
        className="px-8 py-4 rounded-full text-white font-black text-sm hover:scale-105 active:scale-95 transition flex items-center gap-2"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.58 0.2 225), oklch(0.72 0.16 215))",
          boxShadow: "0 4px 20px oklch(0.58 0.2 225 / 0.4)",
        }}
      >
        <span>{lang === "ar" ? "مشاركة الصفحة" : "Share Page"}</span> 🔗
      </button>
    </div>
  );
}

// ─── Create Event View ───────────────────────────────────────────────────────

interface CreateEventViewProps {
  lang: Lang;
  isLight: boolean;
  cName: string;
  setCName: (v: string) => void;
  cDate: string;
  setCDate: (v: string) => void;
  cTime: string;
  setCTime: (v: string) => void;
  customEvents: EventItem[];
  handleCreate: () => void;
  handleSelectEvent: (e: EventItem) => void;
  handleDeleteCustom: (idx: number) => void;
  onBack: () => void;
}

function CreateEventView({
  lang,
  isLight,
  cName,
  setCName,
  cDate,
  setCDate,
  cTime,
  setCTime,
  customEvents,
  handleCreate,
  handleSelectEvent,
  handleDeleteCustom,
  onBack,
}: CreateEventViewProps) {
  const cardBg = isLight
    ? "oklch(1 0 0 / 0.85)"
    : "oklch(0.12 0.025 245 / 0.5)";
  const borderC = isLight
    ? "oklch(0.52 0.2 225 / 0.2)"
    : "oklch(0.65 0.18 220 / 0.12)";
  const inputStyle = {
    background: isLight ? "oklch(0.96 0.01 220)" : undefined,
    color: isLight ? "oklch(0.12 0.03 245)" : undefined,
    borderColor: isLight ? "oklch(0.52 0.2 225 / 0.3)" : undefined,
  };

  return (
    <div className="max-w-2xl mx-auto py-4 pb-20">
      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-sm font-bold opacity-60 hover:opacity-100 transition"
        style={{
          color: isLight ? "oklch(0.3 0.06 240)" : "oklch(0.75 0.1 220)",
        }}
      >
        {lang === "ar" ? "→ العودة للرئيسية" : "← Back to Home"}
      </button>

      {/* Header */}
      <div className="mb-8">
        <h2
          className="text-3xl font-black mb-2"
          style={{
            color: isLight ? "oklch(0.12 0.03 245)" : "oklch(0.96 0.02 220)",
          }}
        >
          {lang === "ar" ? "✨ إنشاء حدث جديد" : "✨ Create New Event"}
        </h2>
        <p className="text-sm opacity-50">
          {lang === "ar"
            ? "أنشئ عدادًا تنازليًا لمناسبتك الخاصة وشاركه مع الآخرين"
            : "Create a personal countdown and share it with others"}
        </p>
      </div>

      {/* Form Card */}
      <div
        className="rounded-[2rem] p-7 md:p-10 relative overflow-hidden mb-6"
        style={{ background: cardBg, border: `1px solid ${borderC}` }}
      >
        <div
          className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-10 -mr-20 -mt-20 pointer-events-none"
          style={{ background: "oklch(0.65 0.18 220)" }}
        />

        <div className="space-y-4 relative">
          {/* Event name */}
          <div>
            <label
              htmlFor="create-event-name"
              className="block text-xs font-black uppercase tracking-widest mb-1.5 opacity-60"
              style={{
                color: isLight ? "oklch(0.3 0.04 245)" : undefined,
              }}
            >
              {lang === "ar" ? "اسم الحدث" : "Event Name"}
            </label>
            <input
              id="create-event-name"
              type="text"
              value={cName}
              onChange={(e) => setCName(e.target.value)}
              placeholder={
                lang === "ar" ? "مثلاً: عيد ميلادي 🎂" : "e.g. My Birthday 🎂"
              }
              className="custom-input"
              style={inputStyle}
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="create-event-date"
                className="block text-xs font-black uppercase tracking-widest mb-1.5 opacity-60"
                style={{
                  color: isLight ? "oklch(0.3 0.04 245)" : undefined,
                }}
              >
                {lang === "ar" ? "التاريخ" : "Date"}
              </label>
              <input
                id="create-event-date"
                type="date"
                value={cDate}
                onChange={(e) => setCDate(e.target.value)}
                className="custom-input"
                style={{
                  ...inputStyle,
                  colorScheme: isLight ? "light" : "dark",
                }}
              />
            </div>
            <div>
              <label
                htmlFor="create-event-time"
                className="block text-xs font-black uppercase tracking-widest mb-1.5 opacity-60"
                style={{
                  color: isLight ? "oklch(0.3 0.04 245)" : undefined,
                }}
              >
                {lang === "ar" ? "الوقت" : "Time"}{" "}
                <span className="opacity-50 normal-case font-medium">
                  ({lang === "ar" ? "اختياري" : "optional"})
                </span>
              </label>
              <input
                id="create-event-time"
                type="time"
                value={cTime}
                onChange={(e) => setCTime(e.target.value)}
                className="custom-input"
                style={{
                  ...inputStyle,
                  colorScheme: isLight ? "light" : "dark",
                }}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleCreate}
            className="w-full text-white font-bold py-4 rounded-xl text-sm active:scale-95 transition hover:opacity-95 mt-2 flex items-center justify-center gap-2"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.58 0.2 225), oklch(0.72 0.16 215))",
              boxShadow: "0 4px 20px oklch(0.58 0.2 225 / 0.4)",
            }}
          >
            <span className="text-lg">🚀</span>
            {lang === "ar"
              ? "ابدأ العد التنازلي وشاركه"
              : "Start Countdown & Share"}
          </button>
        </div>
      </div>

      {/* Saved Events */}
      {customEvents.length > 0 && (
        <div
          className="rounded-[2rem] p-6"
          style={{ background: cardBg, border: `1px solid ${borderC}` }}
        >
          <h3
            className="text-sm font-black mb-4"
            style={{
              color: isLight ? "oklch(0.3 0.04 245)" : "oklch(0.7 0.05 225)",
            }}
          >
            {lang === "ar" ? "📋 أحداثك المحفوظة" : "📋 Your Saved Events"}
          </h3>
          <div className="space-y-2">
            {customEvents.map((ev, idx) => (
              <div
                key={`${ev.d}-${idx}`}
                className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{
                  background: isLight
                    ? "oklch(0.92 0.02 220 / 0.8)"
                    : "oklch(0.1 0.02 245 / 0.6)",
                  border: `1px solid ${isLight ? "oklch(0.52 0.2 225 / 0.15)" : "oklch(0.65 0.18 220 / 0.1)"}`,
                }}
              >
                <div className="min-w-0 flex-1">
                  <p
                    className="text-sm font-bold truncate"
                    style={{
                      color: isLight
                        ? "oklch(0.12 0.03 245)"
                        : "oklch(0.9 0.03 220)",
                    }}
                  >
                    {ev.t[lang]}
                  </p>
                  <p
                    className="text-xs mt-0.5 opacity-50"
                    style={{
                      color: isLight
                        ? "oklch(0.5 0.06 235)"
                        : "oklch(0.55 0.04 225)",
                    }}
                  >
                    {new Date(ev.d).toLocaleDateString(
                      lang === "ar" ? "ar-DZ" : "en-US",
                      { day: "numeric", month: "short", year: "numeric" },
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2 ms-3">
                  <button
                    type="button"
                    onClick={() => {
                      handleSelectEvent(ev);
                      onBack();
                    }}
                    className="text-[10px] font-bold px-3 py-1.5 rounded-lg transition"
                    style={{
                      color: "oklch(0.65 0.18 220)",
                      background: isLight
                        ? "oklch(0.88 0.03 220)"
                        : "oklch(0.2 0.03 245 / 0.6)",
                    }}
                  >
                    {lang === "ar" ? "عرض" : "View"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCustom(idx)}
                    className="text-[10px] font-bold px-2 py-1.5 rounded-lg transition opacity-60 hover:opacity-100"
                    style={{
                      background: isLight
                        ? "oklch(0.88 0.03 220)"
                        : "oklch(0.2 0.03 245 / 0.6)",
                      color: isLight
                        ? "oklch(0.5 0.06 235)"
                        : "oklch(0.6 0.05 225)",
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [lang, setLang] = useState<Lang>(
    () => (localStorage.getItem("tw_lang") as Lang) || "en",
  );
  const [isLight, setIsLight] = useState<boolean>(
    () => localStorage.getItem("tw_theme") === "light",
  );
  const [currentCategory, setCurrentCategory] = useState("all");
  const [countryFilter, setCountryFilter] = useState("gl");
  const [searchQ, setSearchQ] = useState("");
  const [activeEvent, setActiveEvent] = useState<EventItem | null>(null);
  const [customEvents, setCustomEvents] =
    useState<EventItem[]>(loadCustomEvents);
  const [now, setNow] = useState(() => new Date());
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [showBalloons, setShowBalloons] = useState(false);
  const [autoRotateIndex, setAutoRotateIndex] = useState(0);
  const [isManualOverride, setIsManualOverride] = useState(false);
  const [rotateProgressKey, setRotateProgressKey] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // New feature states
  const [currentView, setCurrentView] = useState<AppView>("home");
  const [notifSubs, setNotifSubs] = useState<string[]>(loadNotifSubs);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [eventPageEvent, setEventPageEvent] = useState<EventItem | null>(null);
  // Widget builder state
  const [widgetSelectedEvent, setWidgetSelectedEvent] =
    useState<EventItem | null>(null);
  const [widgetLang, setWidgetLang] = useState<Lang>("en");
  const [widgetSearch, setWidgetSearch] = useState("");

  // Form state
  const [cName, setCName] = useState("");
  const [cDate, setCDate] = useState("");
  const [cTime, setCTime] = useState("");

  const exploreRef = useRef<HTMLDivElement>(null);
  const manualOverrideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // Live clock tick
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Persist theme
  useEffect(() => {
    localStorage.setItem("tw_theme", isLight ? "light" : "dark");
  }, [isLight]);

  // Load saved events & set initial active event (runs once on mount)
  useEffect(() => {
    const savedCustom = loadCustomEvents();
    const allEvents = [...eventsData, ...savedCustom];
    const params = new URLSearchParams(window.location.search);

    // Widget mode — render minimal widget only
    if (params.get("widget") === "1" && params.get("e") && params.get("d")) {
      const wEvent: EventItem = {
        t: {
          en: decodeURIComponent(params.get("e") ?? ""),
          ar: decodeURIComponent(params.get("e") ?? ""),
        },
        d: params.get("d") ?? "",
        c: "shared",
        cc: "gl",
      };
      setEventPageEvent(wEvent);
      setCurrentView("widget");
      return;
    }

    // Event page mode
    if (params.get("page") === "event" && params.get("e") && params.get("d")) {
      const ev: EventItem = {
        t: {
          en: decodeURIComponent(params.get("e") ?? ""),
          ar: decodeURIComponent(params.get("e") ?? ""),
        },
        d: params.get("d") ?? "",
        c: "shared",
        cc: "gl",
      };
      setEventPageEvent(ev);
      setActiveEvent(ev);
      setCurrentView("event");
      return;
    }

    if (params.get("e") && params.get("d")) {
      const sharedEvent: EventItem = {
        t: {
          en: decodeURIComponent(params.get("e") ?? ""),
          ar: decodeURIComponent(params.get("e") ?? ""),
        },
        d: params.get("d") ?? "",
        c: "shared",
        cc: "gl",
      };
      setActiveEvent(sharedEvent);
    } else {
      const n = new Date();
      // Prefer a live event first, then upcoming
      const liveNow = allEvents.filter((e) => {
        const diff = n.getTime() - new Date(e.d).getTime();
        return diff >= 0 && diff < 86400000;
      });
      if (liveNow.length > 0) {
        setActiveEvent(liveNow[0]);
      } else {
        const future = allEvents
          .filter((e) => new Date(e.d) > n)
          .sort((a, b) => new Date(a.d).getTime() - new Date(b.d).getTime());
        setActiveEvent(future[0] ?? allEvents[0] ?? null);
      }
    }

    // Schedule notifications for all subscribed events on load
    const subs = loadNotifSubs();
    if (subs.length > 0) {
      for (const dateStr of subs) {
        const match = allEvents.find((e) => e.d === dateStr);
        if (match) scheduleNotification(match);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply RTL / font class
  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang === "ar" ? "ar" : "en";
    localStorage.setItem("tw_lang", lang);
  }, [lang]);

  const t = i18n[lang];

  // Compute live-today events (events whose date is within the past 24h)
  const allEventsWithCustom = [...eventsData, ...customEvents];
  const liveTodayEvents = allEventsWithCustom.filter((e) => {
    const diff = now.getTime() - new Date(e.d).getTime();
    return diff >= 0 && diff < 86400000;
  });

  // Auto-rotate when 2+ live today events
  // biome-ignore lint/correctness/useExhaustiveDependencies: liveTodayEvents is recomputed each render; only length matters for interval logic
  useEffect(() => {
    if (liveTodayEvents.length < 2 || isManualOverride) return;

    const snapshot = liveTodayEvents;
    const interval = setInterval(() => {
      setAutoRotateIndex((prev) => {
        const next = (prev + 1) % snapshot.length;
        setActiveEvent(snapshot[next]);
        setRotateProgressKey((k) => k + 1);
        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [liveTodayEvents.length, isManualOverride]);

  // Countdown computation
  const activeTarget = activeEvent ? new Date(activeEvent.d) : null;
  const {
    status: cdStatus,
    time: cdTime,
    daysAgo,
  } = activeTarget
    ? computeCountdown(activeTarget, now)
    : {
        status: "ended" as CountdownStatus,
        time: { days: 0, hours: 0, mins: 0, secs: 0 },
        daysAgo: 0,
      };

  // Show balloons when live
  useEffect(() => {
    setShowBalloons(cdStatus === "live");
  }, [cdStatus]);

  const heroTitle = activeEvent
    ? cdStatus === "live"
      ? activeEvent.t[lang]
      : cdStatus === "ended"
        ? lang === "ar"
          ? `انتهى منذ ${daysAgo} ${t.endedAgo}`
          : `Ended ${daysAgo} ${t.endedAgo}`
        : activeEvent.t[lang]
    : "—";

  const heroDate = activeTarget
    ? activeTarget.toLocaleDateString(lang === "ar" ? "ar-DZ" : "en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  // Toast
  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  }, []);

  // Share popup toggle
  const handleShare = useCallback(() => {
    if (!activeEvent) return;
    setShowSharePopup((v) => !v);
  }, [activeEvent]);

  // Copy plain link
  const handleCopyLink = useCallback(() => {
    if (!activeEvent) return;
    const url = `${window.location.origin}${window.location.pathname}?e=${encodeURIComponent(activeEvent.t.en)}&d=${encodeURIComponent(activeEvent.d)}`;
    navigator.clipboard.writeText(url).then(() => {
      showToast(lang === "ar" ? i18n.ar.linkCopied : i18n.en.linkCopied);
      setShowSharePopup(false);
    });
  }, [activeEvent, lang, showToast]);

  // Copy event page link
  const handleCopyEventPage = useCallback(() => {
    if (!activeEvent) return;
    const url = `${window.location.origin}${window.location.pathname}?page=event&e=${encodeURIComponent(activeEvent.t.en)}&d=${encodeURIComponent(activeEvent.d)}`;
    navigator.clipboard.writeText(url).then(() => {
      showToast(
        lang === "ar" ? i18n.ar.eventPageCopied : i18n.en.eventPageCopied,
      );
      setShowSharePopup(false);
    });
  }, [activeEvent, lang, showToast]);

  // Toggle notification subscription
  const handleToggleNotif = useCallback(
    async (event: EventItem) => {
      const already = notifSubs.includes(event.d);
      if (already) {
        const updated = notifSubs.filter((d) => d !== event.d);
        setNotifSubs(updated);
        saveNotifSubs(updated);
        showToast(
          lang === "ar" ? i18n.ar.notifUnsubscribed : i18n.en.notifUnsubscribed,
        );
        return;
      }
      // Request permission if needed
      if (
        typeof Notification !== "undefined" &&
        Notification.permission === "default"
      ) {
        const perm = await Notification.requestPermission();
        if (perm === "denied") {
          showToast(lang === "ar" ? i18n.ar.notifDenied : i18n.en.notifDenied);
          return;
        }
      }
      if (
        typeof Notification !== "undefined" &&
        Notification.permission === "denied"
      ) {
        showToast(lang === "ar" ? i18n.ar.notifDenied : i18n.en.notifDenied);
        return;
      }
      const updated = [...notifSubs, event.d];
      setNotifSubs(updated);
      saveNotifSubs(updated);
      scheduleNotification(event);
      showToast(
        lang === "ar" ? i18n.ar.notifSubscribed : i18n.en.notifSubscribed,
      );
    },
    [notifSubs, lang, showToast],
  );

  // Fullscreen toggle
  const handleFullscreen = useCallback(() => {
    setIsFullscreen((v) => !v);
  }, []);

  // Close fullscreen / share popup on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullscreen(false);
        setShowSharePopup(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close share popup on outside click
  useEffect(() => {
    if (!showSharePopup) return;
    const handler = () => setShowSharePopup(false);
    const timer = setTimeout(
      () => window.addEventListener("click", handler),
      50,
    );
    return () => {
      clearTimeout(timer);
      window.removeEventListener("click", handler);
    };
  }, [showSharePopup]);

  // Select event (manual)
  const handleSelectEvent = useCallback(
    (event: EventItem) => {
      setActiveEvent(event);
      setIsManualOverride(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      launchConfetti();

      // Check if selected event is live
      const diff = now.getTime() - new Date(event.d).getTime();
      const selectedIsLive = diff >= 0 && diff < 86400000;
      setShowBalloons(selectedIsLive);

      // Resume auto-rotation after 30 seconds
      if (manualOverrideTimerRef.current) {
        clearTimeout(manualOverrideTimerRef.current);
      }
      manualOverrideTimerRef.current = setTimeout(() => {
        setIsManualOverride(false);
      }, 30000);
    },
    [now],
  );

  // Create custom event
  const handleCreate = useCallback(() => {
    if (!cName.trim() || !cDate) {
      showToast(
        lang === "ar"
          ? "الرجاء إدخال الاسم والتاريخ"
          : "Please enter name and date",
      );
      return;
    }
    const newEvent: EventItem = {
      t: { en: cName.trim(), ar: cName.trim() },
      d: `${cDate}T${cTime || "00:00"}`,
      c: "custom",
      cc: "gl",
    };
    const updated = [...customEvents, newEvent];
    setCustomEvents(updated);
    saveCustomEvents(updated);
    setActiveEvent(newEvent);
    setCName("");
    setCDate("");
    setCTime("");
    setShowCreateModal(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast(lang === "ar" ? "تم إنشاء الحدث! 🎉" : "Event created! 🎉");
  }, [cName, cDate, cTime, customEvents, lang, showToast]);

  // Create custom event and navigate home
  const handleCreateAndNavigate = useCallback(() => {
    if (!cName.trim() || !cDate) {
      showToast(
        lang === "ar"
          ? "الرجاء إدخال الاسم والتاريخ"
          : "Please enter name and date",
      );
      return;
    }
    const newEvent: EventItem = {
      t: { en: cName.trim(), ar: cName.trim() },
      d: `${cDate}T${cTime || "00:00"}`,
      c: "custom",
      cc: "gl",
    };
    const updated = [...customEvents, newEvent];
    setCustomEvents(updated);
    saveCustomEvents(updated);
    setActiveEvent(newEvent);
    setCName("");
    setCDate("");
    setCTime("");
    setCurrentView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast(lang === "ar" ? "تم إنشاء الحدث! 🎉" : "Event created! 🎉");
  }, [cName, cDate, cTime, customEvents, lang, showToast]);

  // Delete custom event
  const handleDeleteCustom = useCallback(
    (idx: number) => {
      const updated = customEvents.filter((_, i) => i !== idx);
      setCustomEvents(updated);
      saveCustomEvents(updated);
    },
    [customEvents],
  );

  // Filter events for grid
  const filteredEvents = allEventsWithCustom
    .filter((e) => {
      const dateObj = new Date(e.d);
      const diff = now.getTime() - dateObj.getTime();
      const isPast = dateObj < now;
      const isLive = isPast && diff < 86400000;
      // "ended" = past AND not live (> 24h ago)
      const isArchived = isPast && !isLive;

      if (currentCategory === "history") {
        return isArchived;
      }
      // Hide fully archived events from main view
      if (isArchived) return false;
      if (currentCategory !== "all" && e.c !== currentCategory) return false;
      if (countryFilter !== "gl" && e.cc !== countryFilter && e.cc !== "gl")
        return false;
      if (searchQ && !e.t[lang].toLowerCase().includes(searchQ.toLowerCase()))
        return false;
      return true;
    })
    .sort((a, b) => {
      if (currentCategory === "history") {
        return new Date(b.d).getTime() - new Date(a.d).getTime();
      }
      return new Date(a.d).getTime() - new Date(b.d).getTime();
    });

  const statusDotClass =
    cdStatus === "live"
      ? "status-dot-live"
      : cdStatus === "ended"
        ? "status-dot-ended"
        : "status-dot-active";

  const isAutoRotating = liveTodayEvents.length >= 2 && !isManualOverride;

  return (
    <div className={`app-bg min-h-screen pb-20 ${isLight ? "light" : ""}`}>
      {/* Balloon Overlay */}
      <BalloonOverlay show={showBalloons} />

      {/* Toast */}
      <div
        className={`toast-container transition-all duration-300 ${toastVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}
      >
        <div
          className="px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 text-sm"
          style={{
            background: isLight
              ? "oklch(0.15 0.03 245)"
              : "oklch(0.95 0.02 220)",
            color: isLight ? "oklch(0.95 0.02 220)" : "oklch(0.12 0.025 245)",
          }}
        >
          {toastMsg}
        </div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center gap-4">
          {/* Logo */}
          <button
            type="button"
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => window.location.reload()}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-base"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.58 0.2 225), oklch(0.72 0.16 215))",
                boxShadow: "0 4px 12px oklch(0.58 0.2 225 / 0.4)",
              }}
            >
              T
            </div>
            <span
              className="font-black text-lg tracking-tight hidden sm:block"
              style={{ color: isLight ? "oklch(0.12 0.03 245)" : "inherit" }}
            >
              TimeWait{" "}
              <span
                className="text-xs align-top"
                style={{ color: "oklch(0.58 0.2 225)" }}
              >
                ULTRA
              </span>
            </span>
          </button>

          {/* Desktop Search */}
          <div className="relative hidden md:block flex-1 max-w-xs">
            <input
              type="text"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder={
                lang === "ar" ? "بحث عن حدث..." : "Search 220+ events..."
              }
              className="custom-input !py-2 !rounded-full text-sm"
              style={{ paddingRight: "2.5rem" }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 text-xs">
              🔍
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Stats Button */}
            <button
              type="button"
              onClick={() =>
                setCurrentView(currentView === "stats" ? "home" : "stats")
              }
              className={`h-9 px-3 rounded-full flex items-center justify-center font-bold text-xs transition gap-1.5 ${currentView === "stats" ? "text-white" : "glass hover:bg-white/10"}`}
              style={
                currentView === "stats"
                  ? {
                      background:
                        "linear-gradient(135deg, oklch(0.55 0.2 160), oklch(0.65 0.18 145))",
                      boxShadow: "0 2px 12px oklch(0.55 0.2 160 / 0.4)",
                    }
                  : {
                      color: isLight
                        ? "oklch(0.3 0.04 245)"
                        : "oklch(0.75 0.08 220)",
                    }
              }
              title={lang === "ar" ? "إحصائيات" : "Stats"}
            >
              <span>📊</span>
              <span className="hidden sm:inline">{t.stats}</span>
            </button>

            {/* Widget Button */}
            <button
              type="button"
              onClick={() =>
                setCurrentView(currentView === "widget" ? "home" : "widget")
              }
              className={`h-9 px-3 rounded-full flex items-center justify-center font-bold text-xs transition gap-1.5 ${currentView === "widget" ? "text-white" : "glass hover:bg-white/10"}`}
              style={
                currentView === "widget"
                  ? {
                      background:
                        "linear-gradient(135deg, oklch(0.65 0.18 310), oklch(0.72 0.2 295))",
                      boxShadow: "0 2px 12px oklch(0.65 0.18 310 / 0.4)",
                    }
                  : {
                      color: isLight
                        ? "oklch(0.3 0.04 245)"
                        : "oklch(0.75 0.08 220)",
                    }
              }
              title={lang === "ar" ? "ويدجت" : "Widget"}
            >
              <span>🔗</span>
              <span className="hidden sm:inline">{t.widget}</span>
            </button>

            {/* Notification count badge */}
            {notifSubs.length > 0 && (
              <div
                className="h-9 px-2.5 rounded-full glass flex items-center justify-center gap-1 text-xs font-bold"
                style={{ color: "oklch(0.72 0.18 55)" }}
                title={`${notifSubs.length} reminder${notifSubs.length > 1 ? "s" : ""} set`}
              >
                🔔 <span>{notifSubs.length}</span>
              </div>
            )}

            {/* Archive Button */}
            <button
              type="button"
              onClick={() => {
                setCurrentView("home");
                setCurrentCategory((c) =>
                  c === "history" ? "all" : "history",
                );
                exploreRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`h-9 px-3 rounded-full flex items-center justify-center font-bold text-xs transition gap-1.5 ${currentCategory === "history" ? "text-white" : "glass hover:bg-white/10"}`}
              style={
                currentCategory === "history"
                  ? {
                      background:
                        "linear-gradient(135deg, oklch(0.45 0.18 270), oklch(0.55 0.2 255))",
                      boxShadow: "0 2px 12px oklch(0.45 0.18 270 / 0.4)",
                    }
                  : {
                      color: isLight
                        ? "oklch(0.3 0.04 245)"
                        : "oklch(0.75 0.08 220)",
                    }
              }
              title={lang === "ar" ? "الأرشيف" : "Archive"}
            >
              <span>📂</span>
              <span className="hidden sm:inline">
                {lang === "ar" ? "الأرشيف" : "Archive"}
              </span>
            </button>

            {/* Create Event Button */}
            <button
              type="button"
              onClick={() =>
                setCurrentView(currentView === "create" ? "home" : "create")
              }
              className={`h-9 px-3 rounded-full flex items-center justify-center font-bold text-xs text-white transition gap-1.5 hover:scale-105 active:scale-95 ${currentView === "create" ? "opacity-90" : ""}`}
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.58 0.2 225), oklch(0.72 0.16 215))",
                boxShadow: "0 2px 12px oklch(0.58 0.2 225 / 0.4)",
              }}
              title={lang === "ar" ? "إنشاء حدث" : "Create Event"}
            >
              <span className="text-base leading-none">+</span>
              <span className="hidden sm:inline">
                {lang === "ar" ? "إنشاء حدث" : "Create Event"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsLight((v) => !v)}
              className="w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-white/10 transition text-base"
              title={isLight ? "Switch to Dark" : "Switch to Light"}
            >
              {isLight ? "🌙" : "☀️"}
            </button>
            <button
              type="button"
              onClick={() => setLang((l) => (l === "en" ? "ar" : "en"))}
              className="h-9 px-3 rounded-full glass flex items-center justify-center font-bold text-xs hover:bg-white/10 transition"
              style={{ color: "oklch(0.72 0.16 215)" }}
            >
              {lang === "ar" ? "EN" : "عربي"}
            </button>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-28">
        {/* ── Widget Embed View (minimal, no chrome) ── */}
        {currentView === "widget" && eventPageEvent ? (
          <WidgetEmbedView event={eventPageEvent} lang={widgetLang} now={now} />
        ) : currentView === "widget" && !eventPageEvent ? (
          <WidgetBuilderView
            lang={lang}
            isLight={isLight}
            widgetSelectedEvent={widgetSelectedEvent}
            setWidgetSelectedEvent={setWidgetSelectedEvent}
            widgetLang={widgetLang}
            setWidgetLang={setWidgetLang}
            widgetSearch={widgetSearch}
            setWidgetSearch={setWidgetSearch}
            now={now}
            showToast={showToast}
            onBack={() => setCurrentView("home")}
          />
        ) : currentView === "stats" ? (
          <StatsView
            lang={lang}
            isLight={isLight}
            now={now}
            onBack={() => setCurrentView("home")}
          />
        ) : currentView === "event" && eventPageEvent ? (
          <EventPageView
            event={eventPageEvent}
            lang={lang}
            isLight={isLight}
            now={now}
            showToast={showToast}
            onBack={() => {
              setCurrentView("home");
              setEventPageEvent(null);
              window.history.pushState({}, "", window.location.pathname);
            }}
          />
        ) : currentView === "create" ? (
          <CreateEventView
            lang={lang}
            isLight={isLight}
            cName={cName}
            setCName={setCName}
            cDate={cDate}
            setCDate={setCDate}
            cTime={cTime}
            setCTime={setCTime}
            customEvents={customEvents}
            handleCreate={handleCreateAndNavigate}
            handleSelectEvent={handleSelectEvent}
            handleDeleteCustom={handleDeleteCustom}
            onBack={() => setCurrentView("home")}
          />
        ) : (
          <>
            {/* ── Hero ── */}
            <section className="text-center mb-24 relative">
              {/* Glow */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full blur-[120px] -z-10 rounded-full pointer-events-none"
                style={{
                  background:
                    cdStatus === "live"
                      ? "oklch(0.55 0.22 160 / 0.08)"
                      : "oklch(0.65 0.18 220 / 0.06)",
                }}
              />

              {/* Auto-rotate label */}
              {isAutoRotating && (
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-3"
                  style={{
                    background: "oklch(0.55 0.22 160 / 0.12)",
                    border: "1px solid oklch(0.55 0.22 160 / 0.25)",
                    color: "oklch(0.7 0.2 155)",
                  }}
                >
                  <span>🔄</span>
                  <span>
                    {liveTodayEvents.length} {t.autoSwitching}
                  </span>
                </div>
              )}

              {/* Badge */}
              <div
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 relative ${cdStatus === "live" ? "live-badge-ring" : ""}`}
                style={{
                  background:
                    cdStatus === "live"
                      ? "oklch(0.55 0.22 160 / 0.12)"
                      : "oklch(0.65 0.18 220 / 0.1)",
                  border:
                    cdStatus === "live"
                      ? "1px solid oklch(0.55 0.22 160 / 0.3)"
                      : "1px solid oklch(0.65 0.18 220 / 0.2)",
                  color:
                    cdStatus === "live"
                      ? "oklch(0.75 0.2 155)"
                      : "oklch(0.72 0.16 215)",
                }}
              >
                <span className={statusDotClass} />
                <span>
                  {cdStatus === "live"
                    ? t.liveNow
                    : cdStatus === "ended"
                      ? t.ended.toUpperCase()
                      : t.nextBigEvent}
                </span>
              </div>

              {/* Title */}
              <h2
                className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-3 leading-tight tracking-tight"
                style={{
                  color:
                    cdStatus === "live"
                      ? "oklch(0.85 0.14 155)"
                      : cdStatus === "upcoming"
                        ? isLight
                          ? "oklch(0.10 0.04 245)"
                          : "oklch(0.97 0.02 220)"
                        : isLight
                          ? "oklch(0.3 0.04 245)"
                          : "oklch(0.75 0.06 230)",
                  textShadow: isLight
                    ? "0 2px 12px oklch(0.52 0.2 225 / 0.15)"
                    : "0 2px 20px oklch(0.65 0.18 220 / 0.3)",
                }}
              >
                {heroTitle}
              </h2>

              {/* Date */}
              <p
                className="text-sm md:text-base font-semibold mb-10 opacity-60"
                style={{ color: "oklch(0.72 0.16 215)" }}
              >
                {heroDate}
              </p>

              {/* Countdown Boxes */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 max-w-4xl mx-auto mb-6">
                <CountdownBox
                  value={cdStatus === "upcoming" ? cdTime.days : 0}
                  label={t.days}
                  isLive={cdStatus === "live"}
                />
                <CountdownBox
                  value={cdStatus === "upcoming" ? cdTime.hours : 0}
                  label={t.hours}
                  isLive={cdStatus === "live"}
                />
                <CountdownBox
                  value={cdStatus === "upcoming" ? cdTime.mins : 0}
                  label={t.mins}
                  isLive={cdStatus === "live"}
                />
                <CountdownBox
                  value={cdStatus === "upcoming" ? cdTime.secs : 0}
                  label={t.secs}
                  isSeconds
                  isLive={cdStatus === "live"}
                />
              </div>

              {/* Auto-rotate progress bar & dots */}
              {isAutoRotating && (
                <div className="max-w-4xl mx-auto mb-6 px-1">
                  {/* Progress bar */}
                  <div
                    className="h-0.5 rounded-full overflow-hidden mb-3"
                    style={{ background: "oklch(0.55 0.22 160 / 0.15)" }}
                  >
                    <div
                      key={rotateProgressKey}
                      className="h-full rounded-full rotate-progress"
                      style={{ background: "oklch(0.55 0.22 160)" }}
                    />
                  </div>
                  {/* Indicator dots */}
                  <div className="flex justify-center gap-2">
                    {liveTodayEvents.map((liveEvt, idx) => (
                      <button
                        key={`${liveEvt.d}-${liveEvt.t.en}`}
                        type="button"
                        onClick={() => {
                          setAutoRotateIndex(idx);
                          setActiveEvent(liveEvt);
                          setIsManualOverride(true);
                          if (manualOverrideTimerRef.current) {
                            clearTimeout(manualOverrideTimerRef.current);
                          }
                          manualOverrideTimerRef.current = setTimeout(() => {
                            setIsManualOverride(false);
                          }, 30000);
                        }}
                        className="transition-all duration-300"
                        style={{
                          width:
                            idx === autoRotateIndex % liveTodayEvents.length
                              ? "24px"
                              : "8px",
                          height: "8px",
                          borderRadius: "4px",
                          background:
                            idx === autoRotateIndex % liveTodayEvents.length
                              ? "oklch(0.55 0.22 160)"
                              : "oklch(0.55 0.22 160 / 0.3)",
                        }}
                        aria-label={`Event ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex gap-3 justify-center flex-wrap relative">
                {/* Share button with popup */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="px-7 py-3.5 rounded-full text-white font-black text-sm hover:scale-105 active:scale-95 transition flex items-center gap-2"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.58 0.2 225), oklch(0.72 0.16 215))",
                      boxShadow: "0 4px 20px oklch(0.58 0.2 225 / 0.4)",
                    }}
                  >
                    <span>{t.share}</span> 🔗
                  </button>
                  {/* Share Popup */}
                  {showSharePopup && (
                    <div
                      className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 glass-card rounded-2xl p-3 flex flex-col gap-2 w-52 z-50"
                      style={{ boxShadow: "0 8px 32px oklch(0 0 0 / 0.4)" }}
                    >
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-white/10 transition text-left w-full"
                      >
                        {t.copyLink}
                      </button>
                      <button
                        type="button"
                        onClick={handleCopyEventPage}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-white/10 transition text-left w-full"
                      >
                        {t.eventPage}
                      </button>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    exploreRef.current?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="px-7 py-3.5 rounded-full glass hover:bg-white/10 font-bold text-sm transition flex items-center gap-2"
                >
                  <span>{t.explore}</span> ↓
                </button>
                <button
                  type="button"
                  onClick={handleFullscreen}
                  className="px-7 py-3.5 rounded-full glass hover:bg-white/10 font-bold text-sm transition flex items-center gap-2"
                  title={lang === "ar" ? "شاشة كاملة" : "Fullscreen"}
                >
                  <span>⛶</span>
                  <span className="hidden sm:inline">
                    {lang === "ar" ? "شاشة كاملة" : "Fullscreen"}
                  </span>
                </button>
              </div>
            </section>

            {/* ── Ad Space (Leaderboard 728x90) - Top position, highest visibility ── */}
            <div
              className="max-w-4xl mx-auto mb-16 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed"
              style={{
                minHeight: "90px",
                borderColor: isLight
                  ? "oklch(0.52 0.2 225 / 0.2)"
                  : "oklch(0.65 0.18 220 / 0.15)",
                background: isLight
                  ? "oklch(0.94 0.02 220 / 0.6)"
                  : "oklch(0.12 0.025 245 / 0.4)",
              }}
            >
              <span
                className="text-[9px] font-black uppercase tracking-[0.35em] mb-1"
                style={{
                  color: isLight
                    ? "oklch(0.5 0.08 235 / 0.5)"
                    : "oklch(0.6 0.08 220 / 0.3)",
                }}
              >
                Advertisement
              </span>
              <span
                className="text-[11px] font-semibold"
                style={{
                  color: isLight
                    ? "oklch(0.5 0.08 235 / 0.4)"
                    : "oklch(0.6 0.08 220 / 0.25)",
                }}
              >
                728 × 90 — Leaderboard
              </span>
            </div>

            {/* ── Events Grid ── */}
            <div id="explore" ref={exploreRef} className="scroll-mt-24">
              {/* Header */}
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-5 border-b border-white/5 pb-6">
                <div>
                  <h3
                    className="text-xl font-black flex items-center gap-2 mb-1"
                    style={{
                      color: isLight ? "oklch(0.12 0.03 245)" : "inherit",
                    }}
                  >
                    <span style={{ color: "oklch(0.58 0.2 225)" }}>#</span>{" "}
                    {t.upcoming}
                  </h3>
                  <p className="text-xs opacity-40">{t.filterDesc}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                  {/* Country Select */}
                  <div className="relative flex-grow md:flex-grow-0">
                    <select
                      value={countryFilter}
                      onChange={(e) => setCountryFilter(e.target.value)}
                      className="custom-select w-full md:w-auto pl-4 pr-8 py-2.5 rounded-full text-sm font-semibold"
                    >
                      <option value="gl">
                        {lang === "ar" ? "🌍 العالم كله" : "🌍 All World"}
                      </option>
                      <option value="dz">
                        {lang === "ar" ? "🇩🇿 الجزائر" : "🇩🇿 Algeria"}
                      </option>
                      <option value="sa">
                        {lang === "ar" ? "🇸🇦 السعودية" : "🇸🇦 Saudi Arabia"}
                      </option>
                      <option value="eg">
                        {lang === "ar" ? "🇪🇬 مصر" : "🇪🇬 Egypt"}
                      </option>
                      <option value="ae">
                        {lang === "ar" ? "🇦🇪 الإمارات" : "🇦🇪 UAE"}
                      </option>
                      <option value="us">
                        {lang === "ar"
                          ? "🇺🇸 الولايات المتحدة"
                          : "🇺🇸 United States"}
                      </option>
                      <option value="uk">
                        {lang === "ar"
                          ? "🇬🇧 المملكة المتحدة"
                          : "🇬🇧 United Kingdom"}
                      </option>
                      <option value="fr">
                        {lang === "ar" ? "🇫🇷 فرنسا" : "🇫🇷 France"}
                      </option>
                      <option value="de">
                        {lang === "ar" ? "🇩🇪 ألمانيا" : "🇩🇪 Germany"}
                      </option>
                      <option value="it">
                        {lang === "ar" ? "🇮🇹 إيطاليا" : "🇮🇹 Italy"}
                      </option>
                      <option value="es">
                        {lang === "ar" ? "🇪🇸 إسبانيا" : "🇪🇸 Spain"}
                      </option>
                      <option value="tr">
                        {lang === "ar" ? "🇹🇷 تركيا" : "🇹🇷 Turkey"}
                      </option>
                      <option value="jp">
                        {lang === "ar" ? "🇯🇵 اليابان" : "🇯🇵 Japan"}
                      </option>
                      <option value="cn">
                        {lang === "ar" ? "🇨🇳 الصين" : "🇨🇳 China"}
                      </option>
                      <option value="in">
                        {lang === "ar" ? "🇮🇳 الهند" : "🇮🇳 India"}
                      </option>
                      <option value="kr">
                        {lang === "ar" ? "🇰🇷 كوريا الجنوبية" : "🇰🇷 South Korea"}
                      </option>
                      <option value="br">
                        {lang === "ar" ? "🇧🇷 البرازيل" : "🇧🇷 Brazil"}
                      </option>
                      <option value="ca">
                        {lang === "ar" ? "🇨🇦 كندا" : "🇨🇦 Canada"}
                      </option>
                      <option value="au">
                        {lang === "ar" ? "🇦🇺 أستراليا" : "🇦🇺 Australia"}
                      </option>
                      <option value="mx">
                        {lang === "ar" ? "🇲🇽 المكسيك" : "🇲🇽 Mexico"}
                      </option>
                      <option value="id">
                        {lang === "ar" ? "🇮🇩 إندونيسيا" : "🇮🇩 Indonesia"}
                      </option>
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] pointer-events-none opacity-50">
                      ▼
                    </span>
                  </div>

                  {/* Archive Toggle */}
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentCategory((c) =>
                        c === "history" ? "all" : "history",
                      )
                    }
                    className={`filter-btn ${currentCategory === "history" ? "active" : ""}`}
                  >
                    <span>📂</span>{" "}
                    <span className="hidden sm:inline">{t.archiveBtn}</span>
                    <span className="sm:hidden">Archive</span>
                  </button>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((cat) => (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCurrentCategory(cat.id)}
                    className={`filter-btn ${currentCategory === cat.id ? "active" : ""}`}
                  >
                    <span>{cat.icon}</span> {cat[lang]}
                  </button>
                ))}
              </div>

              {/* Mobile Search */}
              <div className="md:hidden mb-6">
                <input
                  type="text"
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder={lang === "ar" ? "بحث..." : "Search..."}
                  className="custom-input"
                />
              </div>

              {/* Grid + Sidebar Ad */}
              <div className="flex gap-4 items-start">
                {/* Events Grid */}
                <div className="flex-1 min-w-0">
                  {filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3">
                      {filteredEvents.map((e, idx) => (
                        <EventCard
                          key={`${e.d}-${e.t.en}-${idx}`}
                          event={e}
                          lang={lang}
                          now={now}
                          onSelect={handleSelectEvent}
                          isHistory={currentCategory === "history"}
                          isSubscribed={notifSubs.includes(e.d)}
                          onToggleNotif={handleToggleNotif}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 opacity-40">
                      <p className="text-4xl mb-3">🔍</p>
                      <p className="font-bold text-sm">
                        {lang === "ar"
                          ? "لا توجد أحداث مطابقة"
                          : "No events found matching your criteria"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Skyscraper Ad - Sidebar (hidden on small screens) */}
                <div
                  className="hidden xl:flex flex-col items-center justify-center rounded-2xl border-2 border-dashed flex-shrink-0 sticky top-24"
                  style={{
                    width: "160px",
                    minHeight: "600px",
                    borderColor: isLight
                      ? "oklch(0.52 0.2 225 / 0.2)"
                      : "oklch(0.65 0.18 220 / 0.15)",
                    background: isLight
                      ? "oklch(0.94 0.02 220 / 0.6)"
                      : "oklch(0.12 0.025 245 / 0.4)",
                  }}
                >
                  <span
                    className="text-[9px] font-black uppercase tracking-widest mb-1 [writing-mode:vertical-rl]"
                    style={{
                      color: isLight
                        ? "oklch(0.5 0.08 235 / 0.5)"
                        : "oklch(0.6 0.08 220 / 0.3)",
                    }}
                  >
                    Advertisement
                  </span>
                  <span
                    className="text-[10px] font-semibold mt-2 text-center px-2"
                    style={{
                      color: isLight
                        ? "oklch(0.5 0.08 235 / 0.4)"
                        : "oklch(0.6 0.08 220 / 0.25)",
                    }}
                  >
                    160 × 600
                  </span>
                </div>
              </div>
            </div>

            {/* ── Ad Space (Rectangle 336x280) - Mid-page, high CTR position ── */}
            <div className="flex flex-col md:flex-row gap-4 mt-16 mb-4 items-stretch">
              <div
                className="flex-1 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed"
                style={{
                  minHeight: "280px",
                  borderColor: isLight
                    ? "oklch(0.52 0.2 225 / 0.2)"
                    : "oklch(0.65 0.18 220 / 0.15)",
                  background: isLight
                    ? "oklch(0.94 0.02 220 / 0.6)"
                    : "oklch(0.12 0.025 245 / 0.4)",
                }}
              >
                <span
                  className="text-[9px] font-black uppercase tracking-[0.35em] mb-1"
                  style={{
                    color: isLight
                      ? "oklch(0.5 0.08 235 / 0.5)"
                      : "oklch(0.6 0.08 220 / 0.3)",
                  }}
                >
                  Advertisement
                </span>
                <span
                  className="text-[11px] font-semibold"
                  style={{
                    color: isLight
                      ? "oklch(0.5 0.08 235 / 0.4)"
                      : "oklch(0.6 0.08 220 / 0.25)",
                  }}
                >
                  336 × 280 — Medium Rectangle
                </span>
              </div>
              <div
                className="flex-1 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed"
                style={{
                  minHeight: "280px",
                  borderColor: isLight
                    ? "oklch(0.52 0.2 225 / 0.2)"
                    : "oklch(0.65 0.18 220 / 0.15)",
                  background: isLight
                    ? "oklch(0.94 0.02 220 / 0.6)"
                    : "oklch(0.12 0.025 245 / 0.4)",
                }}
              >
                <span
                  className="text-[9px] font-black uppercase tracking-[0.35em] mb-1"
                  style={{
                    color: isLight
                      ? "oklch(0.5 0.08 235 / 0.5)"
                      : "oklch(0.6 0.08 220 / 0.3)",
                  }}
                >
                  Advertisement
                </span>
                <span
                  className="text-[11px] font-semibold"
                  style={{
                    color: isLight
                      ? "oklch(0.5 0.08 235 / 0.4)"
                      : "oklch(0.6 0.08 220 / 0.25)",
                  }}
                >
                  336 × 280 — Medium Rectangle
                </span>
              </div>
            </div>

            {/* ── Create Custom Event ── */}
            <section className="max-w-2xl mx-auto mt-16" id="create-section">
              <div
                className="glass-card rounded-[2rem] p-7 md:p-10 relative overflow-hidden text-center"
                style={{ borderColor: "oklch(0.65 0.18 220 / 0.2)" }}
              >
                <div
                  className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-15 -mr-16 -mt-16"
                  style={{ background: "oklch(0.65 0.18 220)" }}
                />

                <h3 className="text-2xl font-black mb-1">{t.createTitle}</h3>
                <p className="opacity-50 mb-7 text-sm">{t.createSub}</p>

                <div className="space-y-3 text-left">
                  <input
                    type="text"
                    value={cName}
                    onChange={(e) => setCName(e.target.value)}
                    placeholder={
                      lang === "ar"
                        ? "اسم الحدث (مثلاً: عيد ميلادي)"
                        : "Event Name (e.g. My Birthday)"
                    }
                    className="custom-input"
                  />
                  <div className="flex gap-3">
                    <input
                      type="date"
                      value={cDate}
                      onChange={(e) => setCDate(e.target.value)}
                      className="custom-input"
                    />
                    <input
                      type="time"
                      value={cTime}
                      onChange={(e) => setCTime(e.target.value)}
                      className="custom-input"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleCreate}
                    className="w-full text-white font-bold py-3.5 rounded-xl text-sm active:scale-95 transition"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.58 0.2 225), oklch(0.72 0.16 215))",
                      boxShadow: "0 4px 20px oklch(0.58 0.2 225 / 0.35)",
                    }}
                  >
                    {lang === "ar"
                      ? "ابدأ العد التنازلي 🚀"
                      : "Start Countdown 🚀"}
                  </button>
                </div>

                {/* Saved custom events */}
                {customEvents.length > 0 && (
                  <div className="mt-8 text-left">
                    <h4 className="text-sm font-black mb-3 opacity-70">
                      {t.savedEvents}
                    </h4>
                    <div className="space-y-2">
                      {customEvents.map((ev, idx) => (
                        <div
                          key={`${ev.d}-${idx}`}
                          className="flex items-center justify-between px-4 py-3 rounded-xl"
                          style={{
                            background: isLight
                              ? "oklch(0.92 0.02 220 / 0.8)"
                              : "oklch(0.1 0.02 245 / 0.6)",
                            border: `1px solid oklch(${isLight ? "0.52 0.2 225" : "0.65 0.18 220"} / 0.1)`,
                          }}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold truncate">
                              {ev.t[lang]}
                            </p>
                            <p className="text-xs opacity-40 mt-0.5">
                              {new Date(ev.d).toLocaleDateString(
                                lang === "ar" ? "ar-DZ" : "en-US",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ms-3">
                            <button
                              type="button"
                              onClick={() => handleSelectEvent(ev)}
                              className="text-[10px] font-bold px-2 py-1 rounded-lg hover:bg-white/10 transition"
                              style={{ color: "oklch(0.72 0.16 215)" }}
                            >
                              {lang === "ar" ? "عرض" : "View"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCustom(idx)}
                              className="text-[10px] font-bold px-2 py-1 rounded-lg hover:bg-destructive/20 transition opacity-60 hover:opacity-100"
                              title={t.deleteEvent}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {customEvents.length === 0 && (
                  <p className="mt-6 text-xs opacity-30">{t.noSaved}</p>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      {/* ── Ad Space (Footer Banner 728x90) ── */}
      <div className="max-w-4xl mx-auto mt-16 mb-0 px-4 sm:px-6">
        <div
          className="rounded-2xl flex flex-col items-center justify-center border-2 border-dashed"
          style={{
            minHeight: "90px",
            borderColor: isLight
              ? "oklch(0.52 0.2 225 / 0.18)"
              : "oklch(0.65 0.18 220 / 0.12)",
            background: isLight
              ? "oklch(0.94 0.02 220 / 0.5)"
              : "oklch(0.12 0.025 245 / 0.35)",
          }}
        >
          <span
            className="text-[9px] font-black uppercase tracking-[0.35em] mb-1"
            style={{
              color: isLight
                ? "oklch(0.5 0.08 235 / 0.45)"
                : "oklch(0.6 0.08 220 / 0.25)",
            }}
          >
            Advertisement
          </span>
          <span
            className="text-[11px] font-semibold"
            style={{
              color: isLight
                ? "oklch(0.5 0.08 235 / 0.35)"
                : "oklch(0.6 0.08 220 / 0.2)",
            }}
          >
            728 × 90 — Footer Banner
          </span>
        </div>
      </div>

      {/* ── Fullscreen Countdown Modal ── */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center overflow-hidden"
          style={{
            backgroundColor: isLight ? "#f0f9ff" : "#05081a",
            color: isLight ? "#0c1a2e" : "#e8f4ff",
          }}
        >
          {/* Background glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                cdStatus === "live"
                  ? "radial-gradient(ellipse 80% 60% at 50% 50%, oklch(0.55 0.22 160 / 0.15), transparent)"
                  : "radial-gradient(ellipse 80% 60% at 50% 50%, oklch(0.58 0.2 225 / 0.12), transparent)",
            }}
          />

          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="absolute top-5 right-5 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition hover:scale-110 active:scale-95"
            style={{
              backgroundColor: isLight
                ? "rgba(14,165,233,0.12)"
                : "rgba(56,189,248,0.12)",
              border: `1px solid ${isLight ? "rgba(14,165,233,0.3)" : "rgba(56,189,248,0.25)"}`,
              color: isLight ? "#0369a1" : "#7dd3fc",
            }}
            title={lang === "ar" ? "إغلاق" : "Close (Esc)"}
          >
            ✕
          </button>

          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 ${cdStatus === "live" ? "live-badge-ring" : ""}`}
            style={{
              backgroundColor:
                cdStatus === "live"
                  ? "rgba(34,197,94,0.12)"
                  : "rgba(56,189,248,0.1)",
              border:
                cdStatus === "live"
                  ? "1px solid rgba(34,197,94,0.35)"
                  : "1px solid rgba(56,189,248,0.25)",
              color: cdStatus === "live" ? "#4ade80" : "#38bdf8",
            }}
          >
            <span className={statusDotClass} />
            <span>
              {cdStatus === "live"
                ? t.liveNow
                : cdStatus === "ended"
                  ? t.ended.toUpperCase()
                  : t.nextBigEvent}
            </span>
          </div>

          {/* Event title */}
          <h2
            className="text-4xl sm:text-6xl md:text-8xl font-black mb-4 text-center leading-tight tracking-tight px-6"
            style={{
              color:
                cdStatus === "live"
                  ? "#4ade80"
                  : isLight
                    ? "#0c1a2e"
                    : "#f0f8ff",
              textShadow: isLight
                ? "0 2px 20px rgba(14,165,233,0.2)"
                : "0 2px 40px rgba(56,189,248,0.4)",
            }}
          >
            {heroTitle}
          </h2>

          {/* Date */}
          <p
            className="text-base md:text-lg font-semibold mb-12"
            style={{
              color: isLight ? "#0ea5e9" : "#38bdf8",
              opacity: 0.7,
            }}
          >
            {heroDate}
          </p>

          {/* Countdown boxes — large */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 w-full max-w-5xl px-6 mb-10">
            {[
              {
                value: cdStatus === "upcoming" ? cdTime.days : 0,
                label: t.days,
                isSeconds: false,
              },
              {
                value: cdStatus === "upcoming" ? cdTime.hours : 0,
                label: t.hours,
                isSeconds: false,
              },
              {
                value: cdStatus === "upcoming" ? cdTime.mins : 0,
                label: t.mins,
                isSeconds: false,
              },
              {
                value: cdStatus === "upcoming" ? cdTime.secs : 0,
                label: t.secs,
                isSeconds: true,
              },
            ].map(({ value, label, isSeconds }) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center py-10 md:py-14 rounded-[2rem] relative overflow-hidden"
                style={{
                  backgroundColor: isLight
                    ? "rgba(224,242,254,0.9)"
                    : "rgba(15,23,42,0.85)",
                  border: isLight
                    ? "1px solid rgba(14,165,233,0.2)"
                    : "1px solid rgba(56,189,248,0.15)",
                  boxShadow: isLight
                    ? "0 8px 32px rgba(14,165,233,0.12)"
                    : "0 8px 32px rgba(0,0,0,0.4)",
                }}
              >
                <span
                  className="block font-mono text-7xl sm:text-8xl md:text-9xl font-black leading-none tracking-tighter"
                  style={{
                    color: isSeconds
                      ? "#38bdf8"
                      : cdStatus === "live"
                        ? "#4ade80"
                        : isLight
                          ? "#0c1a2e"
                          : "#f0f8ff",
                    textShadow: isSeconds
                      ? "0 0 30px rgba(56,189,248,0.5)"
                      : isLight
                        ? "none"
                        : "0 0 40px rgba(56,189,248,0.3)",
                  }}
                >
                  {pad(value)}
                </span>
                <p
                  className="text-xs md:text-sm font-black mt-4 uppercase tracking-[0.3em]"
                  style={{
                    color: isSeconds
                      ? "#38bdf8"
                      : isLight
                        ? "rgba(12,26,46,0.55)"
                        : "rgba(224,242,254,0.55)",
                  }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* ESC hint */}
          <p
            className="text-xs font-medium"
            style={{
              color: isLight ? "rgba(12,26,46,0.35)" : "rgba(224,242,254,0.3)",
            }}
          >
            {lang === "ar" ? "اضغط Esc للإغلاق" : "Press Esc to exit"}
          </p>
        </div>
      )}

      {/* ── Create Event Modal ── */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{
            background: "oklch(0 0 0 / 0.6)",
            backdropFilter: "blur(8px)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCreateModal(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setShowCreateModal(false);
          }}
          role="presentation"
        >
          <div
            className="rounded-[2rem] p-7 md:p-10 relative overflow-hidden w-full max-w-lg"
            style={{
              background: isLight
                ? "oklch(0.98 0.01 220 / 0.98)"
                : "oklch(0.13 0.025 245 / 0.97)",
              border: `1px solid ${isLight ? "oklch(0.52 0.2 225 / 0.25)" : "oklch(0.65 0.18 220 / 0.2)"}`,
              boxShadow: isLight
                ? "0 20px 60px oklch(0.52 0.2 225 / 0.2)"
                : "0 20px 60px oklch(0 0 0 / 0.6)",
              backdropFilter: "blur(20px)",
              color: isLight ? "oklch(0.12 0.03 245)" : "oklch(0.95 0.02 220)",
            }}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm transition opacity-60 hover:opacity-100"
              style={{
                background: isLight
                  ? "oklch(0.88 0.03 220)"
                  : "oklch(0.2 0.03 245 / 0.8)",
                border: `1px solid ${isLight ? "oklch(0.52 0.2 225 / 0.25)" : "oklch(0.65 0.18 220 / 0.2)"}`,
                color: isLight ? "oklch(0.2 0.04 245)" : "oklch(0.85 0.04 220)",
              }}
            >
              ✕
            </button>

            <div
              className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-15 -mr-16 -mt-16"
              style={{ background: "oklch(0.65 0.18 220)" }}
            />

            <h3
              className="text-2xl font-black mb-1 text-center"
              style={{
                color: isLight
                  ? "oklch(0.10 0.04 245)"
                  : "oklch(0.96 0.02 220)",
              }}
            >
              {lang === "ar" ? "إنشاء حدث جديد" : "Create New Event"}
            </h3>
            <p
              className="mb-7 text-sm text-center"
              style={{
                color: isLight ? "oklch(0.45 0.06 240)" : "oklch(0.6 0.05 225)",
              }}
            >
              {lang === "ar"
                ? "تتبع مناسباتك الخاصة"
                : "Track your personal moments"}
            </p>

            <div className="space-y-3">
              <input
                type="text"
                value={cName}
                onChange={(e) => setCName(e.target.value)}
                placeholder={
                  lang === "ar"
                    ? "اسم الحدث (مثلاً: عيد ميلادي)"
                    : "Event Name (e.g. My Birthday)"
                }
                className="custom-input"
                style={{
                  background: isLight ? "oklch(0.96 0.01 220)" : undefined,
                  color: isLight ? "oklch(0.12 0.03 245)" : undefined,
                  borderColor: isLight
                    ? "oklch(0.52 0.2 225 / 0.3)"
                    : undefined,
                }}
              />
              <div className="flex gap-3">
                <input
                  type="date"
                  value={cDate}
                  onChange={(e) => setCDate(e.target.value)}
                  className="custom-input"
                  style={{
                    background: isLight ? "oklch(0.96 0.01 220)" : undefined,
                    color: isLight ? "oklch(0.12 0.03 245)" : undefined,
                    borderColor: isLight
                      ? "oklch(0.52 0.2 225 / 0.3)"
                      : undefined,
                    colorScheme: isLight ? "light" : "dark",
                  }}
                />
                <input
                  type="time"
                  value={cTime}
                  onChange={(e) => setCTime(e.target.value)}
                  className="custom-input"
                  style={{
                    background: isLight ? "oklch(0.96 0.01 220)" : undefined,
                    color: isLight ? "oklch(0.12 0.03 245)" : undefined,
                    borderColor: isLight
                      ? "oklch(0.52 0.2 225 / 0.3)"
                      : undefined,
                    colorScheme: isLight ? "light" : "dark",
                  }}
                />
              </div>
              <button
                type="button"
                onClick={handleCreate}
                className="w-full text-white font-bold py-3.5 rounded-xl text-sm active:scale-95 transition"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.58 0.2 225), oklch(0.72 0.16 215))",
                  boxShadow: "0 4px 20px oklch(0.58 0.2 225 / 0.35)",
                }}
              >
                {lang === "ar" ? "ابدأ العد التنازلي 🚀" : "Start Countdown 🚀"}
              </button>
            </div>

            {/* Saved custom events inside modal */}
            {customEvents.length > 0 && (
              <div className="mt-7">
                <h4
                  className="text-sm font-black mb-3"
                  style={{
                    color: isLight
                      ? "oklch(0.3 0.04 245)"
                      : "oklch(0.7 0.05 225)",
                  }}
                >
                  {lang === "ar" ? "أحداثك المحفوظة" : "Saved Events"}
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {customEvents.map((ev, idx) => (
                    <div
                      key={`${ev.d}-${idx}`}
                      className="flex items-center justify-between px-4 py-3 rounded-xl"
                      style={{
                        background: isLight
                          ? "oklch(0.92 0.02 220 / 0.8)"
                          : "oklch(0.1 0.02 245 / 0.6)",
                        border: `1px solid ${isLight ? "oklch(0.52 0.2 225 / 0.15)" : "oklch(0.65 0.18 220 / 0.1)"}`,
                      }}
                    >
                      <div className="min-w-0 flex-1">
                        <p
                          className="text-sm font-bold truncate"
                          style={{
                            color: isLight
                              ? "oklch(0.12 0.03 245)"
                              : "oklch(0.9 0.03 220)",
                          }}
                        >
                          {ev.t[lang]}
                        </p>
                        <p
                          className="text-xs mt-0.5"
                          style={{
                            color: isLight
                              ? "oklch(0.5 0.06 235)"
                              : "oklch(0.55 0.04 225)",
                          }}
                        >
                          {new Date(ev.d).toLocaleDateString(
                            lang === "ar" ? "ar-DZ" : "en-US",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ms-3">
                        <button
                          type="button"
                          onClick={() => {
                            handleSelectEvent(ev);
                            setShowCreateModal(false);
                          }}
                          className="text-[10px] font-bold px-2 py-1 rounded-lg transition"
                          style={{
                            color: "oklch(0.65 0.18 220)",
                            background: isLight
                              ? "oklch(0.88 0.03 220)"
                              : "oklch(0.2 0.03 245 / 0.6)",
                          }}
                        >
                          {lang === "ar" ? "عرض" : "View"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCustom(idx)}
                          className="text-[10px] font-bold px-2 py-1 rounded-lg transition opacity-60 hover:opacity-100"
                          style={{
                            background: isLight
                              ? "oklch(0.88 0.03 220)"
                              : "oklch(0.2 0.03 245 / 0.6)",
                            color: isLight
                              ? "oklch(0.5 0.06 235)"
                              : "oklch(0.6 0.05 225)",
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer
        className="mt-16 text-center py-10"
        style={{
          borderTop: `1px solid ${isLight ? "oklch(0.82 0.04 225 / 0.5)" : "oklch(1 0 0 / 0.05)"}`,
        }}
      >
        <p
          className="text-xs font-black opacity-30 uppercase tracking-widest mb-2"
          style={{ color: isLight ? "oklch(0.3 0.04 245)" : "inherit" }}
        >
          TimeWait Ultra V6 © {new Date().getFullYear()}
        </p>
        <p className="text-xs opacity-20">
          Built with <span style={{ color: "oklch(0.72 0.16 0)" }}>♥</span>{" "}
          using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-60 transition"
            style={{ color: "oklch(0.72 0.16 215)" }}
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
