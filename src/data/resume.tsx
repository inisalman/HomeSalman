import { Icons } from "@/components/icons";
import { FolderIcon, HomeIcon } from "lucide-react";

export const DATA = {
  name: "Salman Al Farisi",
  initials: "SA",
  url: "https://salmanalfarisi.id",
  location: "Jakarta, ID",
  locationLink: "https://www.google.com/maps/place/jakarta",
  description:
    "Professional Nurse and Computer Enthusiast",
  summary:
    "Currently working for [RSKD Duren Sawit as Professional Nurse](#work), sometimes freelance as [Graphic Design, and Website Development](#projects). Based in Jakarta, Indonesia. This website contains design works that I have produced over the past few years. Find various types of design projects such as banner designs, flyer designs, video editing, website development, and many more.",
  avatarUrl: "/me.png",
  skills: [
    "Next.js",
    "React",
    "Nuxt",
    "NestJS",
    "TypeScript",
    "PostgreSQL",
    "Prisma",
    "Tailwind CSS",
    "Docker",
    "Cloudflare R2",
    "Next.js API Routes",
    "Better Auth",
    "Framer Motion",
    "MySQL",
    "Wordpress",
    "Photoshop",
    "Premiere Pro",
    "Canva",
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/#projects", icon: FolderIcon, label: "Projects" },
  ],
  contact: {
    email: "hello@example.com",
    tel: "+123456789",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/inisalman",
        icon: Icons.github,

        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/salman-al-farisi-b942a3143/",
        icon: Icons.linkedin,

        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "#",
        icon: Icons.email,

        navbar: false,
      },
    },
  },

  work: [
    {
      company: "RSKD Duren Sawit",
      href: "https://rsdurensawit.jakarta.go.id/",
      badges: [],
      location: "East Jakarta, Indonesia",
      title: "Professional Nurse",
      logoUrl: "/rsds.jpg",
      start: "Sept 2024",
      end: "Until Now",
      description:
        "I have been working as a nurse in the psychiatric ward for patients with co-occurring physical illnesses at RSKD Duren Sawit, Jakarta. I provide holistic nursing care for individuals with mental health disorders and physical conditions, including administering medications, monitoring vital signs, and delivering therapeutic interventions such as group activity therapy and therapeutic communication. I have also completed the Workshop on Psychiatric Emergency Nursing to strengthen my skills in managing psychiatric",
    },
    {
      company: "RSUP Persahabatan",
      badges: [],
      href: "https://rspersahabatan.co.id/",
      location: "East Jakarta, Indonesia",
      title: "Professional Nurse",
      logoUrl: "/rsup.jpg",
      start: "Feb 2022",
      end: "Oct 2024",
      description:
        "From 2022 to 2024, I worked as a nurse in the Pulmonary TB Isolation Ward at RSUP Persahabatan, Jakarta. I was responsible for providing comprehensive nursing care to patients with tuberculosis, including infection prevention measures, medication administration, and patient monitoring in an isolation setting. During this period, I obtained a certification in Tuberculosis (TB) Management Training for Nurses in Private Health Facilities, which enhanced my competency in handling TB cases in clinical practice.",
    },

  ],
  education: [
    {
      school: "Universitas Nasional",
      href: "https://www.unas.ac.id/",
      degree: "Professional Nursing Program (Ns)",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/6/65/Universitas_Nasional_Logo_with_Text.png?utm_source=id.wikipedia.org&utm_campaign=index&utm_content=original",
      start: "2024",
      end: "2025",
    },
    {
      school: "Universitas Nasional",
      href: "https://www.unas.ac.id/",
      degree: "Bachelor's Degree of Nursing (S. Kep)",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/6/65/Universitas_Nasional_Logo_with_Text.png?utm_source=id.wikipedia.org&utm_campaign=index&utm_content=original",
      start: "2023",
      end: "2024",
    },
    {
      school: "Poltekkes Kemenkes Jakarta I",
      href: "https://www.poltekkesjakarta1.ac.id/",
      degree: "Diploma in Nursing (Amd. Kep)",
      logoUrl: "https://i0.wp.com/www.poltekkesjakarta1.ac.id/wp-content/uploads/2024/05/Logo-Poltekkes-Jakarta-I-Transparan.png?resize=1024%2C236&ssl=1",
      start: "2018",
      end: "2021",
    },
  ],
  training: [
    {
      school: "Hacktiv8 IBM SkillsBuild",
      href: "https://students.hacktiv8.com/certificates/bc0098be-f2cd-4b44-bbe9-731ecf192420",
      degree: "AI Agent for Healthcare",
      logoUrl: "https://academic.hacktiv8.com/static/media/hacktiv-navbar.35edca5f.png",
      start: "July 2026",
      end: "",
      description:
        "Completed an IBM SkillsBuild training program on AI Agent applications in healthcare, demonstrating foundational exposure to AI-driven solutions in the healthcare domain.",
    },
    {
      school: "KEMENKES",
      href: "https://sertifikatlms.kemkes.go.id/index.php/Sertifikat/generate/4d7a637a4e444d334d7a67744d7a597a4e7930304e7a4d344c5749344d7a41744d7a677a4e7a4d344d7a457a4d6a4d30",
      degree: "Basic Trauma Cardiac Life Support (BTCLS)",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/89/Logo_Kementerian_Kesehatan_Republik_Indonesia_%282024_rev%29.svg",
      start: "April 2026",
      end: "",
      description:
        "Completed Basic Trauma Cardiac Life Support (BTCLS) training covering fundamental emergency management, trauma care, cardiac emergencies, and initial life support procedures for patients in critical conditions.",
    },
    {
      school: "Pro Emergency",
      href: "https://lms.kemkes.go.id/certificate/view/7787ca9c-2b9a-4f5b-937e-d9a7f0e9dc1c",
      degree: "Workshop Psychiatric Emergency Nursing",
      logoUrl: "https://www.proemergency.com/assets/gambar/logo/20231003172541.png",
      start: "November 2024",
      end: "",
      description:
        "Participated in a workshop focused on the assessment and initial management of psychiatric emergencies, including emergency nursing approaches, patient safety, crisis intervention, and appropriate nursing care for patients experiencing acute psychiatric conditions.",
    },
  ],
  projects: [
    {
      title: "NakesPro",
      href: "https://nakespro.id",
      dates: "2025 - Present",
      active: true,
      description:
        "Healthcare homecare marketplace connecting patients with healthcare professionals across Indonesia. Features professional search, service filtering, WhatsApp booking flow, and a funnel-tracking REST API.",
      technologies: [
        "Next.js 16",
        "React 19",
        "Tailwind CSS",
        "PostgreSQL",
        "Next.js API Routes",
        "Cloudflare R2",
        "Docker",
        "Easypanel",
      ],
      links: [
        {
          type: "Website",
          href: "https://nakespro.id",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "",
      video: "/nakespro.mp4",
    },
    {
      title: "Setapak",
      href: "https://setapak.build.web.id",
      dates: "2025 - Present",
      active: true,
      description:
        "Mental health self-help companion with PHQ-9/GAD-7 screening, daily mood check-in, and crisis support flow for users with anxiety and depressive symptoms.",
      technologies: [
        "Nuxt 3",
        "NestJS",
        "PostgreSQL",
        "Prisma",
        "Better Auth",
        "Tailwind CSS",
        "TypeScript",
      ],
      links: [
        {
          type: "Website",
          href: "https://setapak.build.web.id",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "",
      video: "/setapak.mp4",
    },
    {
      title: "Ngaskep",
      href: "https://ngaskep.web.id",
      dates: "2025 - Present",
      active: true,
      description:
        "Digital nursing assistant for care planning: SDKI diagnoses, SIKI interventions, SLKI outcomes, health calculators, and a digital SOP library.",
      technologies: [
        "Next.js",
        "React",
        "Tailwind CSS",
        "TypeScript",
        "PostgreSQL",
      ],
      links: [
        {
          type: "Website",
          href: "https://ngaskep.web.id",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "",
      video: "/ngaskep.mp4",
    },
  ],
  
    
  
} as const;
