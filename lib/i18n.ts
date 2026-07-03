/**
 * OpenSyntax Academy – i18n Translation System
 * Supported: English (en), Arabic (ar), Tunisian Darija (tn), French (fr), German (de)
 */

export type Locale = "en" | "ar" | "tn" | "fr" | "de"

export const LOCALES: { code: Locale; label: string; nativeLabel: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", label: "English",  nativeLabel: "English",   dir: "ltr" },
  { code: "ar", label: "Arabic",   nativeLabel: "العربية",   dir: "rtl" },
  { code: "tn", label: "Tunisian", nativeLabel: "تونسي",     dir: "rtl" },
  { code: "fr", label: "French",   nativeLabel: "Français",  dir: "ltr" },
  { code: "de", label: "German",   nativeLabel: "Deutsch",   dir: "ltr" },
]

export type TranslationKeys = {
  // Navbar
  nav_courses: string
  nav_dashboard: string
  nav_resources: string
  nav_search: string
  nav_community: string
  nav_status: string
  nav_changelog: string
  nav_contributing: string
  nav_terms: string
  nav_privacy: string
  nav_known_bugs: string

  // Hero
  hero_badge: string
  hero_headline_1: string
  hero_headline_2: string
  hero_sub: string
  hero_cta_start: string
  hero_cta_community: string

  // Stats
  stat_courses: string
  stat_lessons: string
  stat_content: string
  stat_free: string

  // Terminal
  terminal_welcome_1: string
  terminal_welcome_2: string

  // Footer
  footer_tagline: string
  footer_courses: string
  footer_more_courses: string
  footer_community: string
  footer_instagram: string
  footer_github: string
  footer_legal: string
  footer_status: string
  footer_changelog: string
  footer_contributing: string
  footer_certificates: string
  footer_terms: string
  footer_privacy: string
  footer_issues: string
  footer_known_bugs: string
  footer_report_bug: string
  footer_copyright: string

  // CTA section
  cta_title: string
  cta_sub: string
  cta_button: string
}

const translations: Record<Locale, TranslationKeys> = {
  en: {
    nav_courses: "Courses",
    nav_dashboard: "Dashboard",
    nav_resources: "Resources",
    nav_search: "Search...",
    nav_community: "Community",
    nav_status: "Platform Status",
    nav_changelog: "Changelog",
    nav_contributing: "Contributing",
    nav_terms: "Terms of Service",
    nav_privacy: "Privacy Policy",
    nav_known_bugs: "Known Bugs",

    hero_badge: "Next-Level Open Source Education",
    hero_headline_1: "Master the Art of",
    hero_headline_2: "Advanced Development",
    hero_sub: "A premium, completely free platform built to elevate your skills. Forget toy examples—dive deep into the real architectures powering production systems today.",
    hero_cta_start: "Start Learning Free",
    hero_cta_community: "Join Community",

    stat_courses: "Premium Courses",
    stat_lessons: "In-depth Lessons",
    stat_content: "Video Content",
    stat_free: "Free Forever",

    terminal_welcome_1: "Welcome to OpenSyntax OS v5.0.0.",
    terminal_welcome_2: "Type 'help' to see available commands.",

    footer_tagline: "The next evolution of open-source developer education. 100% community-funded, free forever.",
    footer_courses: "Courses",
    footer_more_courses: "More Courses",
    footer_community: "Community",
    footer_instagram: "Instagram Profile",
    footer_github: "GitHub ↗",
    footer_legal: "Legal & Platform",
    footer_status: "Platform Status",
    footer_changelog: "Changelog",
    footer_contributing: "Contributing",
    footer_certificates: "🏆 Certificates",
    footer_terms: "Terms of Service",
    footer_privacy: "Privacy Policy",
    footer_issues: "Issues",
    footer_known_bugs: "Known Bugs",
    footer_report_bug: "Report a Bug ↗",
    footer_copyright: "OpenSyntax Academy. Open-source & community-funded.",

    cta_title: "Ready to level up?",
    cta_sub: "Join thousands of developers mastering real-world skills — completely free, forever.",
    cta_button: "Explore All Courses",
  },

  // ── Arabic ──
  ar: {
    nav_courses: "الدورات",
    nav_dashboard: "لوحة التحكم",
    nav_resources: "الموارد",
    nav_search: "ابحث...",
    nav_community: "المجتمع",
    nav_status: "حالة المنصة",
    nav_changelog: "سجل التغييرات",
    nav_contributing: "المساهمة",
    nav_terms: "شروط الخدمة",
    nav_privacy: "سياسة الخصوصية",
    nav_known_bugs: "الأخطاء المعروفة",

    hero_badge: "تعليم مفتوح المصدر بمستوى متقدم",
    hero_headline_1: "أتقن فن",
    hero_headline_2: "التطوير المتقدم",
    hero_sub: "منصة مجانية بالكامل مصممة لرفع مهاراتك. تجاوز الأمثلة البسيطة وادخل في أعماق البنى الحقيقية التي تشغّل أنظمة الإنتاج اليوم.",
    hero_cta_start: "ابدأ التعلم مجانًا",
    hero_cta_community: "انضم للمجتمع",

    stat_courses: "دورة متميزة",
    stat_lessons: "درس معمّق",
    stat_content: "محتوى مرئي",
    stat_free: "مجاني للأبد",

    terminal_welcome_1: "مرحبًا بك في OpenSyntax OS v5.0.0.",
    terminal_welcome_2: "اكتب 'help' لعرض الأوامر المتاحة.",

    footer_tagline: "التطور القادم في تعليم المطورين مفتوح المصدر. ممول مجتمعيًا 100% ومجاني للأبد.",
    footer_courses: "الدورات",
    footer_more_courses: "دورات إضافية",
    footer_community: "المجتمع",
    footer_instagram: "صفحة إنستغرام",
    footer_github: "GitHub ↗",
    footer_legal: "القانوني والمنصة",
    footer_status: "حالة المنصة",
    footer_changelog: "سجل التغييرات",
    footer_contributing: "المساهمة",
    footer_certificates: "🏆 الشهادات",
    footer_terms: "شروط الخدمة",
    footer_privacy: "سياسة الخصوصية",
    footer_issues: "المشكلات",
    footer_known_bugs: "الأخطاء المعروفة",
    footer_report_bug: "الإبلاغ عن خطأ ↗",
    footer_copyright: "OpenSyntax Academy. مفتوح المصدر وممول مجتمعيًا.",

    cta_title: "مستعد للارتقاء؟",
    cta_sub: "انضم لآلاف المطورين الذين يتقنون مهارات العالم الحقيقي — مجانًا تمامًا، للأبد.",
    cta_button: "استكشف جميع الدورات",
  },

  // ── Tunisian Darija ──
  tn: {
    nav_courses: "الدروس",
    nav_dashboard: "تابلو دو بور",
    nav_resources: "الموارد",
    nav_search: "سيرشي...",
    nav_community: "المجتمع",
    nav_status: "حالة البلاطفورم",
    nav_changelog: "سجل التغييرات",
    nav_contributing: "مشاركة",
    nav_terms: "شروط الخدمة",
    nav_privacy: "سياسة الخصوصية",
    nav_known_bugs: "البوق المعروفين",

    hero_badge: "تعليم مفتوح المصدر من مستوى عالي",
    hero_headline_1: "تعلم صناعة",
    hero_headline_2: "البرمجة المتقدمة",
    hero_sub: "بلاطفورم مجاني بالكامل مصمم باش يرفع مهاراتك. متعدش توقف على أمثلة بسيطة — غوص عميق في البنى الحقيقية اللي تشغّل الأنظمة الكبيرة اليوم.",
    hero_cta_start: "ابدأ التعلم بالمجان",
    hero_cta_community: "انضم للمجتمع",

    stat_courses: "دورة متميزة",
    stat_lessons: "درس معمّق",
    stat_content: "محتوى فيديو",
    stat_free: "مجاني للأبد",

    terminal_welcome_1: "مرحبا بيك في OpenSyntax OS v5.0.0.",
    terminal_welcome_2: "اكتب 'help' باش تشوف الأوامر المتاحة.",

    footer_tagline: "التطور الجاي في تعليم المطورين مفتوح المصدر. ممول مجتمعيًا 100% ومجاني للأبد.",
    footer_courses: "الدورات",
    footer_more_courses: "دورات أخرى",
    footer_community: "المجتمع",
    footer_instagram: "صفحة إنستغرام",
    footer_github: "GitHub ↗",
    footer_legal: "القانوني والبلاطفورم",
    footer_status: "حالة الخدمة",
    footer_changelog: "سجل التغييرات",
    footer_contributing: "المشاركة",
    footer_certificates: "🏆 الشهادات",
    footer_terms: "شروط الخدمة",
    footer_privacy: "سياسة الخصوصية",
    footer_issues: "المشاكل",
    footer_known_bugs: "البوق المعروفين",
    footer_report_bug: "بلّغ عن بوق ↗",
    footer_copyright: "OpenSyntax Academy. مفتوح المصدر وممول مجتمعيًا.",

    cta_title: "حاضر تترقى؟",
    cta_sub: "انضم لآلاف المطورين اللي يتقنوا مهارات العالم الحقيقي — بالمجان، للأبد.",
    cta_button: "اكتشف كل الدورات",
  },

  // ── French ──
  fr: {
    nav_courses: "Cours",
    nav_dashboard: "Tableau de bord",
    nav_resources: "Ressources",
    nav_search: "Rechercher...",
    nav_community: "Communauté",
    nav_status: "Statut de la plateforme",
    nav_changelog: "Journal des modifications",
    nav_contributing: "Contribuer",
    nav_terms: "Conditions d'utilisation",
    nav_privacy: "Politique de confidentialité",
    nav_known_bugs: "Bogues connus",

    hero_badge: "Éducation open source de haut niveau",
    hero_headline_1: "Maîtrisez l'art du",
    hero_headline_2: "Développement avancé",
    hero_sub: "Une plateforme premium et entièrement gratuite conçue pour élever vos compétences. Oubliez les exemples simplistes — plongez dans les architectures réelles qui alimentent les systèmes de production aujourd'hui.",
    hero_cta_start: "Commencer gratuitement",
    hero_cta_community: "Rejoindre la communauté",

    stat_courses: "Cours premium",
    stat_lessons: "Leçons approfondies",
    stat_content: "Contenu vidéo",
    stat_free: "Gratuit pour toujours",

    terminal_welcome_1: "Bienvenue dans OpenSyntax OS v5.0.0.",
    terminal_welcome_2: "Tapez 'help' pour voir les commandes disponibles.",

    footer_tagline: "La prochaine évolution de l'éducation développeur open source. 100% financé par la communauté, gratuit pour toujours.",
    footer_courses: "Cours",
    footer_more_courses: "Plus de cours",
    footer_community: "Communauté",
    footer_instagram: "Profil Instagram",
    footer_github: "GitHub ↗",
    footer_legal: "Légal & Plateforme",
    footer_status: "Statut de la plateforme",
    footer_changelog: "Journal des modifications",
    footer_contributing: "Contribuer",
    footer_certificates: "🏆 Certificats",
    footer_terms: "Conditions d'utilisation",
    footer_privacy: "Confidentialité",
    footer_issues: "Problèmes",
    footer_known_bugs: "Bogues connus",
    footer_report_bug: "Signaler un bogue ↗",
    footer_copyright: "OpenSyntax Academy. Open source & financé par la communauté.",

    cta_title: "Prêt à passer au niveau supérieur ?",
    cta_sub: "Rejoignez des milliers de développeurs qui maîtrisent des compétences réelles — complètement gratuit, pour toujours.",
    cta_button: "Explorer tous les cours",
  },

  // ── German ──
  de: {
    nav_courses: "Kurse",
    nav_dashboard: "Dashboard",
    nav_resources: "Ressourcen",
    nav_search: "Suchen...",
    nav_community: "Community",
    nav_status: "Plattformstatus",
    nav_changelog: "Änderungsprotokoll",
    nav_contributing: "Mitwirken",
    nav_terms: "Nutzungsbedingungen",
    nav_privacy: "Datenschutzrichtlinie",
    nav_known_bugs: "Bekannte Fehler",

    hero_badge: "Open-Source-Bildung auf höchstem Niveau",
    hero_headline_1: "Meistere die Kunst der",
    hero_headline_2: "Fortgeschrittenen Entwicklung",
    hero_sub: "Eine erstklassige, völlig kostenlose Plattform, die deine Fähigkeiten auf ein neues Level bringt. Vergiss einfache Beispiele – tauche tief in die echten Architekturen ein, die Produktionssysteme heute antreiben.",
    hero_cta_start: "Kostenlos starten",
    hero_cta_community: "Community beitreten",

    stat_courses: "Premium-Kurse",
    stat_lessons: "Tiefgehende Lektionen",
    stat_content: "Videoinhalt",
    stat_free: "Für immer kostenlos",

    terminal_welcome_1: "Willkommen bei OpenSyntax OS v5.0.0.",
    terminal_welcome_2: "Gib 'help' ein, um verfügbare Befehle zu sehen.",

    footer_tagline: "Die nächste Evolution der Open-Source-Entwicklerausbildung. 100% community-finanziert, für immer kostenlos.",
    footer_courses: "Kurse",
    footer_more_courses: "Weitere Kurse",
    footer_community: "Community",
    footer_instagram: "Instagram-Profil",
    footer_github: "GitHub ↗",
    footer_legal: "Rechtliches & Plattform",
    footer_status: "Plattformstatus",
    footer_changelog: "Änderungsprotokoll",
    footer_contributing: "Mitwirken",
    footer_certificates: "🏆 Zertifikate",
    footer_terms: "Nutzungsbedingungen",
    footer_privacy: "Datenschutz",
    footer_issues: "Probleme",
    footer_known_bugs: "Bekannte Fehler",
    footer_report_bug: "Fehler melden ↗",
    footer_copyright: "OpenSyntax Academy. Open-Source & community-finanziert.",

    cta_title: "Bereit für den nächsten Level?",
    cta_sub: "Schließ dich Tausenden von Entwicklern an, die echte Fähigkeiten meistern – völlig kostenlos, für immer.",
    cta_button: "Alle Kurse entdecken",
  },
}

export function getTranslations(locale: Locale): TranslationKeys {
  return translations[locale] ?? translations.en
}

export const DEFAULT_LOCALE: Locale = "en"
export const I18N_STORAGE_KEY = "opensyntax_locale"
