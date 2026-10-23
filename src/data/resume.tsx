import { Icons } from "@/components/icons";
import { FolderIcon, HomeIcon } from "lucide-react";

export const DATA = {
  name: "Salman Al Farisi",
  initials: "SA",
  url: "https://salmanalfarisi.id",
  location: "Yogyakarta, ID",
  locationLink: "https://www.google.com/maps/place/yogyakarta",
  description:
    "Nurse & Full-Stack Developer | Healthcare AI Builder",
  summary:
    "Registered Nurse (Ns) with a strong passion for technology, especially web development. I build full-stack web applications and healthcare technology products — founder of [NakesPro](#projects), [Setapak](#projects), and [Ngaskep](#projects) — combining clinical domain expertise with production-grade web development. Currently based in Yogyakarta, Indonesia.",
  avatarUrl: "/me.png",
  skills: {
    own: [
      "Python",
      "Prompt Engineering",
      "Healthcare AI",
      "PostgreSQL",
      "Cloudflare R2",
      "MySQL",
      "Wordpress",
      "Elementor",
      "Git",
      "Photoshop",
      "Premiere Pro",
      "Canva",
      "SEO",
      "Google Search Console",
      "cPanel",
    ],
    aiAssisted: [
      "NestJS",
      "TypeScript",
      "Next.js",
      "React",
      "Nuxt 3",
      "Prisma",
      "Tailwind CSS",
      "Docker",
      "Better Auth",
      "Framer Motion",
    ],
  },
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/#projects", icon: FolderIcon, label: "Projects" },
  ],
  contact: {
    email: "salmandevindo@gmail.com",
    tel: "+628568461024",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/inisalman",
        icon: Icons.github,

        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/salmanalfarisi-id/",
        icon: Icons.linkedin,

        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "mailto:salmandevindo@gmail.com",
        icon: Icons.email,

        navbar: false,
      },
    },
  },

  work: [
    {
      company: "Self-Employed",
      href: "https://salmanalfarisi.id",
      badges: [],
      location: "Remote",
      title: "Freelance Full-Stack Developer & Graphic Designer",
      logoUrl: "/sa-logo.svg",
      start: "2021",
      end: "Until Now",
      description:
        "Built and deployed 3 production web apps: NakesPro (healthcare homecare marketplace), Setapak (mental health self-help companion), and Ngaskep (digital nursing assistant). Managed full DevOps pipeline with Docker Swarm, Easypanel, and Cloudflare R2. Client work includes a construction company website. Also handle freelance graphic design for various clients, organizations, and health events — designing banners and certificates, along with flyers, posters, and social media visuals. Tech stack: TypeScript, Next.js, Nuxt 3, NestJS, PostgreSQL, Prisma. Design tools: Photoshop and Canva.",
    },
    {
      company: "RSKD Duren Sawit",
      href: "https://rsdurensawit.jakarta.go.id/",
      badges: [],
      location: "East Jakarta, Indonesia",
      title: "Professional Nurse",
      logoUrl: "/rsds.jpg",
      start: "Sept 2024",
      end: "Oct 2026",
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
      school: "Dicoding",
      href: "https://www.dicoding.com/certificates/53XEMO610PRN",
      renderUrl: "",
      degree: "Belajar Machine Learning untuk Pemula",
      logoUrl:
        "https://dicoding-web-img.sgp1.digitaloceanspaces.com/original/commons/new-ui-logo.png",
      start: "October 2026",
      end: "",
      description:
        "Completed Dicoding's beginner Machine Learning class covering the ML workflow, supervised learning (classification and regression), unsupervised learning (clustering), feature engineering, overfitting/underfitting, and hyperparameter tuning — capped with a final submission building ML models on tabular data.",
    },
    {
      school: "Dicoding",
      href: "https://www.dicoding.com/certificates/6RPNOD79QX2M",
      renderUrl: "",
      degree: "Memulai Pemrograman dengan Python",
      logoUrl:
        "https://dicoding-web-img.sgp1.digitaloceanspaces.com/original/commons/new-ui-logo.png",
      start: "September 2026",
      end: "",
      description:
        "Completed Dicoding's foundational Python programming class covering data types, control flow, functions, OOP, PEP8 style, and unit testing, with hands-on practice across Visual Studio Code, Jupyter Notebook, and Google Colaboratory.",
    },
    {
      school: "Hacktiv8 IBM SkillsBuild",
      href: "https://students.hacktiv8.com/certificates/bc0098be-f2cd-4b44-bbe9-731ecf192420",
      renderUrl:
        "https://certificate-and-transcript.s3.ap-southeast-1.amazonaws.com/documents/e16c9f7e-775f-4f27-afc6-479184aa72af/1785205457870-bc0098be-f2cd-4b44-bbe9-731ecf192420-page-1.jpg",
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
      renderUrl: "",
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
      renderUrl: "",
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
      dates: "2026 - Present",
      active: true,
      description:
        "Healthcare homecare marketplace connecting patients with healthcare professionals across Indonesia. Features professional search, service filtering, WhatsApp booking flow, and a funnel-tracking REST API.",
      technologies: [
        "Next.js",
        "Tailwind CSS",
        "PostgreSQL",
        "Cloudflare R2",
        "Docker",
        "Easypanel",
        "SEO",
        "Google Search Console",
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
      title: "PEMIRA Poltekkes Jakarta I",
      href: "https://pemira.mpmpoltekkesjakarta1.com",
      dates: "2021 - Present",
      active: true,
      description:
        "Online general election (Pemilihan Raya) platform for student organizations at Poltekkes Kemenkes Jakarta I — covering HIMA, BEM, and MPM elections. Provides a secure digital voting flow with voter authentication, candidate profiles, and an admin dashboard for managing the election process.",
      technologies: [
        "Nuxt 3",
        "Vue",
        "Tailwind CSS",
        "TypeScript",
        "Cloudflare",
      ],
      links: [
        {
          type: "Website",
          href: "https://pemira.mpmpoltekkesjakarta1.com",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "",
      video: "/pemira.webm",
    },
    {
      title: "Naratama Creative",
      href: "/project/naratama",
      dates: "2023 - 2025",
      active: false,
      description:
        "Landing page for Naratama Creative Agency, a creative industry agency focused on graphic design, animation, photography, and videography. The site supports the agency's branding, promotion, social media, and company profile work, helping organizations, companies, and individuals through creative ideas.",
      technologies: [
        "WordPress",
        "Elementor",
        "cPanel",
        "SEO",
        "Google Search Console",
      ],
      links: [
        {
          type: "Website",
          href: "/project/naratama",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "",
      video: "/naratama.mp4",
    },
    {
      title: "Kopiluvium",
      href: "",
      dates: "2023 - 2025",
      active: false,
      description:
        "Website for Kopiluvium, a popular Indonesian coffee shop and social hub brand originating from Tanjung Priok, North Jakarta. Built as a brand showcase and company profile site to highlight the coffee menu, store atmosphere, and social hub experience.",
      technologies: [
        "WordPress",
        "Elementor",
        "cPanel",
        "SEO",
        "Google Search Console",
      ],
      links: [],
      image: "",
      video: "/kopiluvium.mp4",
    },
    {
      title: "Ngaskep",
      href: "https://ngaskep.web.id",
      dates: "2026 - Present",
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
    {
      title: "Setapak",
      href: "https://setapak.ngaskep.web.id",
      dates: "2026 - Present",
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
          href: "https://setapak.ngaskep.web.id",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "",
      video: "/setapak.mp4",
    },
    {
      title: "Desain Grafis (Freelance)",
      href: "",
      dates: "2020 - 2025",
      active: false,
      description:
        "Freelance graphic design work spanning flyers, posters, certificates, event branding, and social media visuals for various clients, organizations, and health events. Tools: Photoshop and Canva.",
      technologies: ["Photoshop", "Canva"],
      links: [],
      image: "",
      images: [
        "/project/graphic-design/gd-01.webp",
        "/project/graphic-design/gd-02.webp",
        "/project/graphic-design/gd-03.webp",
        "/project/graphic-design/gd-04.webp",
        "/project/graphic-design/gd-05.webp",
        "/project/graphic-design/gd-06.webp",
        "/project/graphic-design/gd-07.webp",
        "/project/graphic-design/gd-08.webp",
        "/project/graphic-design/gd-09.webp",
        "/project/graphic-design/gd-10.webp",
        "/project/graphic-design/gd-11.webp",
        "/project/graphic-design/gd-12.webp",
        "/project/graphic-design/gd-13.webp",
        "/project/graphic-design/gd-14.webp",
        "/project/graphic-design/gd-15.webp",
      ],
      video: "",
    },
  ],
  
    
  
} as const;
