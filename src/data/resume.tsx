import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon } from "lucide-react";

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
    "Wordpress",
    "Photoshop",
    "Premiere Pro",
    "Canva",
    "Elementor Pro",
    "Cpanel",
    "Ms Office",

  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blog", icon: NotebookIcon, label: "Blog" },
  ],
  contact: {
    email: "hello@example.com",
    tel: "+123456789",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://dub.sh/dillion-github",
        icon: Icons.github,

        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://dub.sh/dillion-linkedin",
        icon: Icons.linkedin,

        navbar: true,
      },
      X: {
        name: "X",
        url: "https://dub.sh/dillion-twitter",
        icon: Icons.x,

        navbar: true,
      },
      Youtube: {
        name: "Youtube",
        url: "https://dub.sh/dillion-youtube",
        icon: Icons.youtube,
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
    {
      company: "Vaksinasi Nasional",
      href: "",
      badges: [],
      location: "Santa Clara, CA",
      title: "Vaksinator Covid-19",
      logoUrl: "",
      start: "Aug 2021",
      end: "Feb 2022",
      description:
        "From 2021 to 2022, I worked as a part-time vaccinator in the National Vaccination Program held by PT Bank Central Asia Tbk and the Financial Services Authority (OJK). In this role, I was responsible for administering COVID-19 vaccines, ensuring proper documentation, and providing post-vaccination observation and education to recipients.",
    },
    {
      company: "Salmanalfarisi.id",
      href: "https://salmanalfarisi.id",
      badges: [],
      location: "Remote",
      title: "Freelance",
      logoUrl: "/splunk.svg",
      start: "January 2019",
      end: "April 2019",
      description:
        "Co-developed a prototype iOS app with another intern in Swift for the new Splunk Phantom security orchestration product (later publicly demoed and launched at .conf annual conference in Las Vegas). Implemented a realtime service for the iOS app in Django (Python) and C++; serialized data using protobufs transmitted over gRPC resulting in an approximate 500% increase in data throughput.",
    },

  ],
  education: [
    {
      school: "Universitas Nasional",
      href: "https://www.unas.ac.id/",
      degree: "Professional Nursing Program",
      logoUrl: "https://th.bing.com/th/id/R.179f695c6b01d5854fc2662a15929364?rik=jg%2fFaj5sRRS9ug&riu=http%3a%2f%2fbppro.unas.ac.id%2fwp-content%2fuploads%2f2018%2f12%2fLogo-UNAS-Universitas-Nasional-Original-PNG.png&ehk=IbbDjtJrVfXuJGwaBK63eannwESRL0BYNIzIPQfaqvg%3d&risl=&pid=ImgRaw&r=0",
      start: "2024",
      end: "2025",
    },
    {
      school: "Universitas Nasional",
      href: "https://www.unas.ac.id/",
      degree: "Bachelor's Degree of Nursing",
      logoUrl: "https://th.bing.com/th/id/R.179f695c6b01d5854fc2662a15929364?rik=jg%2fFaj5sRRS9ug&riu=http%3a%2f%2fbppro.unas.ac.id%2fwp-content%2fuploads%2f2018%2f12%2fLogo-UNAS-Universitas-Nasional-Original-PNG.png&ehk=IbbDjtJrVfXuJGwaBK63eannwESRL0BYNIzIPQfaqvg%3d&risl=&pid=ImgRaw&r=0",
      start: "2023",
      end: "2024",
    },
    {
      school: "Poltekkes Kemenkes Jakarta I",
      href: "https://www.poltekkesjakarta1.ac.id/",
      degree: "Diploma in Nursing",
      logoUrl: "https://akupintar.id/documents/20143/0/Poltekkes+Jakarta+I.jpg/c4542fd0-6b91-89b4-740b-33e8d2ef18f7?version=1.0&t=1521033508075&imageThumbnail=1",
      start: "2018",
      end: "2021",
    },
  ],
  projects: [
    {
      title: "Chat Collect",
      href: "https://chatcollect.com",
      dates: "Jan 2024 - Feb 2024",
      active: true,
      description:
        "With the release of the [OpenAI GPT Store](https://openai.com/blog/introducing-the-gpt-store), I decided to build a SaaS which allows users to collect email addresses from their GPT users. This is a great way to build an audience and monetize your GPT API usage.",
      technologies: [
        "Next.js",
        "Typescript",
        "PostgreSQL",
        "Prisma",
        "TailwindCSS",
        "Stripe",
        "Shadcn UI",
        "Magic UI",
      ],
      links: [
        {
          type: "Website",
          href: "https://chatcollect.com",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "",
      video:
        "https://pub-83c5db439b40468498f97946200806f7.r2.dev/chat-collect.mp4",
    },
    {
      title: "Magic UI",
      href: "https://magicui.design",
      dates: "June 2023 - Present",
      active: true,
      description:
        "Designed, developed and sold animated UI components for developers.",
      technologies: [
        "Next.js",
        "Typescript",
        "PostgreSQL",
        "Prisma",
        "TailwindCSS",
        "Stripe",
        "Shadcn UI",
        "Magic UI",
      ],
      links: [
        {
          type: "Website",
          href: "https://magicui.design",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/magicuidesign/magicui",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video: "https://cdn.magicui.design/bento-grid.mp4",
    },
    {
      title: "llm.report",
      href: "https://llm.report",
      dates: "April 2023 - September 2023",
      active: true,
      description:
        "Developed an open-source logging and analytics platform for OpenAI: Log your ChatGPT API requests, analyze costs, and improve your prompts.",
      technologies: [
        "Next.js",
        "Typescript",
        "PostgreSQL",
        "Prisma",
        "TailwindCSS",
        "Shadcn UI",
        "Magic UI",
        "Stripe",
        "Cloudflare Workers",
      ],
      links: [
        {
          type: "Website",
          href: "https://llm.report",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/dillionverma/llm.report",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video: "https://cdn.llm.report/openai-demo.mp4",
    },
    {
      title: "Automatic Chat",
      href: "https://automatic.chat",
      dates: "April 2023 - March 2024",
      active: true,
      description:
        "Developed an AI Customer Support Chatbot which automatically responds to customer support tickets using the latest GPT models.",
      technologies: [
        "Next.js",
        "Typescript",
        "PostgreSQL",
        "Prisma",
        "TailwindCSS",
        "Shadcn UI",
        "Magic UI",
        "Stripe",
        "Cloudflare Workers",
      ],
      links: [
        {
          type: "Website",
          href: "https://automatic.chat",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "",
      video:
        "https://pub-83c5db439b40468498f97946200806f7.r2.dev/automatic-chat.mp4",
    },
  ],
  
    
  
} as const;
