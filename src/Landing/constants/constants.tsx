import { MenuItem } from "@/Landing/constants/types";

import logJpg from "@/assets/log.jpg";

export const IMAGES = {
  BG_JPG: logJpg,
  BG_PNG: logJpg,
  HERO: logJpg,
  LOGO: logJpg,
};
import {
  ChartArea,
  Building2,
  Component,
  Code,
  BetweenHorizonalEnd,
  BrainCircuit,
  Blocks,
  Terminal,
  Package,
  SquareMousePointer,
  ChartPie,
  Files,
  UserRoundPen,
  GitFork,
  LaptopMinimal,
  ArrowBigDownDash,
  CreditCard,
  Twitter,
  Github,
  Linkedin,
  Instagram,
  Youtube,
} from "lucide-react";

import {
  
  FileText,
  BookOpen,
  Newspaper,
  User,
  Users,
  UserCircle,
} from "lucide-react";

//brands
export const brands = [
  <svg
    className="w-24 h-24 text-gray-800 dark:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      fill-rule="evenodd"
      d="M21.7 8.037a4.26 4.26 0 0 0-.789-1.964 2.84 2.84 0 0 0-1.984-.839c-2.767-.2-6.926-.2-6.926-.2s-4.157 0-6.928.2a2.836 2.836 0 0 0-1.983.839 4.225 4.225 0 0 0-.79 1.965 30.146 30.146 0 0 0-.2 3.206v1.5a30.12 30.12 0 0 0 .2 3.206c.094.712.364 1.39.784 1.972.604.536 1.38.837 2.187.848 1.583.151 6.731.2 6.731.2s4.161 0 6.928-.2a2.844 2.844 0 0 0 1.985-.84 4.27 4.27 0 0 0 .787-1.965 30.12 30.12 0 0 0 .2-3.206v-1.516a30.672 30.672 0 0 0-.202-3.206Zm-11.692 6.554v-5.62l5.4 2.819-5.4 2.801Z"
      clip-rule="evenodd"
    />
  </svg>,
  <svg
    className="w-24 h-24 text-gray-800 dark:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      fill-rule="evenodd"
      d="M12.037 21.998a10.313 10.313 0 0 1-7.168-3.049 9.888 9.888 0 0 1-2.868-7.118 9.947 9.947 0 0 1 3.064-6.949A10.37 10.37 0 0 1 12.212 2h.176a9.935 9.935 0 0 1 6.614 2.564L16.457 6.88a6.187 6.187 0 0 0-4.131-1.566 6.9 6.9 0 0 0-4.794 1.913 6.618 6.618 0 0 0-2.045 4.657 6.608 6.608 0 0 0 1.882 4.723 6.891 6.891 0 0 0 4.725 2.07h.143c1.41.072 2.8-.354 3.917-1.2a5.77 5.77 0 0 0 2.172-3.41l.043-.117H12.22v-3.41h9.678c.075.617.109 1.238.1 1.859-.099 5.741-4.017 9.6-9.746 9.6l-.215-.002Z"
      clip-rule="evenodd"
    />
  </svg>,
  <svg
    className="w-24 h-24 text-gray-800 dark:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="m20.7011 10.1255-.0253-.0672-2.4501-6.63953c-.0498-.13013-.1381-.24053-.2521-.31534-.1141-.07354-.2472-.10896-.3812-.10147-.1341.00748-.2628.05751-.3686.14332-.1047.08828-.1806.2079-.2175.34259l-1.6543 5.2556H8.65334l-1.65429-5.2556c-.03588-.13542-.11197-.25564-.21745-.34356-.10584-.08582-.23449-.13584-.36857-.14333-.13409-.00748-.26716.02794-.38125.10148-.11376.07511-.20195.18541-.25213.31534l-2.45472 6.6367-.02437.0671c-.35269.9569-.39623 2.007-.12404 2.9918.27219.9849.84535 1.8511 1.63305 2.4682l.00844.0068.02249.0166 3.73223 2.9022 1.84647 1.4512 1.1247.8817c.1316.1037.2922.1599.4574.1599.1652 0 .3258-.0562.4574-.1599l1.1247-.8817 1.8464-1.4512 3.7548-2.9198.0093-.0077c.786-.6172 1.3578-1.4826 1.6296-2.4661.2717-.9835.2288-2.0321-.1224-2.9881Z"
    />
  </svg>,
  <svg
    className="w-24 h-24 text-gray-800 dark:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M11.782 5.72a4.773 4.773 0 0 0-4.8 4.173 3.43 3.43 0 0 1 2.741-1.687c1.689 0 2.974 1.972 3.758 2.587a5.733 5.733 0 0 0 5.382.935c2-.638 2.934-2.865 3.137-3.921-.969 1.379-2.44 2.207-4.259 1.231-1.253-.673-2.19-3.438-5.959-3.318ZM6.8 11.979A4.772 4.772 0 0 0 2 16.151a3.431 3.431 0 0 1 2.745-1.687c1.689 0 2.974 1.972 3.758 2.587a5.733 5.733 0 0 0 5.382.935c2-.638 2.933-2.865 3.137-3.921-.97 1.379-2.44 2.208-4.259 1.231-1.253-.673-2.19-3.443-5.963-3.317Z" />
  </svg>,
  <svg
    className="w-24 h-24 text-gray-800 dark:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M17 20v-5h2v6.988H3V15h1.98v5H17Z" />
    <path d="m6.84 14.522 8.73 1.825.369-1.755-8.73-1.825-.369 1.755Zm1.155-4.323 8.083 3.764.739-1.617-8.083-3.787-.739 1.64Zm3.372-5.481L10.235 6.08l6.859 5.704 1.132-1.362-6.859-5.704ZM15.57 17H6.655v2h8.915v-2ZM12.861 3.111l6.193 6.415 1.414-1.415-6.43-6.177-1.177 1.177Z" />
  </svg>,
];

// Header
export const navMenu: MenuItem[] = [
  {
    href: "/products",
    label: "Products",
    submenu: [
      {
        href: "#",
        icon: <ChartArea />,
        label: "User Analytics",
        desc: "Powerful options to securely authenticate and manage",
      },
      {
        href: "#",
        icon: <Building2 />,
        label: "B2B SaaS Suite",
        desc: "Add-on features built specifically for B2B applications",
      },
      {
        href: "#",
        icon: <Component />,
        label: "React Components",
        desc: "Embeddable prebuilt UI components for quick and seamless integrations",
      },
      {
        href: "#",
        icon: <Code />,
        label: "Next.js Analytics",
        desc: "The fastest and most seamless authentication solution for Next.js",
      },
      {
        href: "#",
        icon: <BetweenHorizonalEnd />,
        label: "AnalytiX Elements",
        desc: "Unstyled UI primitives for endless customization. Powered by AnalytiX",
      },
      {
        href: "#",
        icon: <BrainCircuit />,
        label: "Authentication for AI",
        desc: "Authentication and abuse protection tailored to AI applications",
      },
    ],
  },
  {
    href: "/features",
    label: "Features",
  },
  {
    href: "/docs",
    label: "Docs",
    submenu: [
      {
        href: "#",
        icon: <Terminal />,
        label: "Getting Started",
        desc: "Powerful options to securely authenticate and manage",
      },
      {
        href: "#",
        icon: <Package />,
        label: "Core Concepts",
        desc: "Add-on features built specifically for B2B applications",
      },
      {
        href: "#",
        icon: <SquareMousePointer />,
        label: "Customization",
        desc: "Embeddable prebuilt UI components for quick and seamless integrations",
      },
      {
        href: "#",
        icon: <Blocks />,
        label: "Official Plugins",
        desc: "The fastest and most seamless authentication solution for Next.js",
      },
    ],
  },
  {
    href: "/pricing",
    label: "Pricing",
  },
];

// Hero
export const heroData = {
  sectionSubtitle: "All in one analytics tool",
  sectionTitle: "Presenting the next-gen user",
  decoTitle: "analytics",
  sectionText:
    "Next-gen user analytics: Gain valuable insights into user behavior and drive data-informed decision-making with our revolutionary platform.",
};

// Feature
export const featureData = {
  sectionSubtitle: "Features",
  sectionTitle: "Discover Powerful Features",
  sectionText:
    "Unleash the power of our platform with a multitude of powerful features, empowering you to achieve your goals.",
  features: [
    {
      icon: <ChartPie size={32} />,
      iconBoxColor: "bg-blue-600",
      title: "Advance Analytics",
      desc: "Experience advanced analytics capabilities that enable you to dive deep into data, uncover meaningful patterns, and derive actionable insights",
      imgSrc: IMAGES.BG_JPG,
    },
    {
      icon: <Files size={32} />,
      iconBoxColor: "bg-cyan-500",
      title: "Automated Reports",
      desc: "Save time and effort with automated reporting, generating comprehensive and accurate reports automatically, streamlining your data analysis",
      imgSrc: IMAGES.BG_PNG,
    },
    {
      icon: <UserRoundPen size={32} />,
      iconBoxColor: "bg-yellow-500",
      title: "Retention Report",
      desc: "Enhance retention with our report, maximizing customer engagement and loyalty for business",
      imgSrc: IMAGES.HERO,
    },
    {
      icon: <GitFork size={32} />,
      iconBoxColor: "bg-red-500",
      title: "A/B Test Variants",
      desc: "Efficiently compare A/B test variants to determine the most effective strategies",
      imgSrc: IMAGES.LOGO,
    },
    {
      icon: <Blocks size={32} />,
      iconBoxColor: "bg-purple-500",
      title: "Integration Directory",
      desc: "Seamlessly integrate with our directory, maximizing efficiency and unlocking the full potentials",
      imgSrc: IMAGES.HERO,
    },
  ],
};
// Process
export const processData = {
  sectionSubtitle: "How it works",
  sectionTitle: "Easy Process to Get Started",
  sectionText:
    "Discover how it works by leveraging advanced algorithms and data analysis techniques.",
  list: [
    {
      icon: <LaptopMinimal size={32} />,
      title: "Create your account",
      text: "Join us now and create your account to start exploring our platform and unlocking exciting features.",
    },
    {
      icon: <ArrowBigDownDash size={32} />,
      title: "Install our tracking app",
      text: "Install our tracking app to effortlessly monitor and manage your activities, gaining valuable insights and optimizing your performance.",
    },
    {
      icon: <CreditCard size={32} />,
      title: "Start tracking your website",
      text: "Start tracking your website effortlessly to gain valuable insights into visitor behavior, performance metrics, and optimization opportunities.",
    },
  ],
};

// Overview
export const overviewData = {
  sectionSubtitle: "Overview",
  sectionTitle: "All-In-One Analytics Tool",
  sectionText:
    "Powerful analytics made easy. Make data-driven decisions with our all-in-one tool.",
  listTitle: "More than 1M+ people around the world are already using",
  list: [
    {
      title: "1M+",
      text: "Active Downloads",
    },
    {
      title: "4.86",
      text: "Average Rating",
    },
    {
      title: "60K+",
      text: "Active Users",
    },
  ],
};

// Review
export const reviewData = {
  sectionSubtitle: "Reviews",
  sectionTitle: "What Our Customers Are Says",
  reviewCard: [
    {
      title: "We’re building a better application now, thanks to AnalytiX.",
      text: "Our application is undergoing significant improvements with the help of NioLand, resulting in enhanced functionality, improved user experience",
      reviewAuthor: "Wade Warren",
      date: "3month ago",
    },
    {
      title: "Great Service from a expert support system of AnalytiX",
      text: "Experience exceptional service and support from AnalytiX expert team, dedicated to providing knowledgeable assistance and ensuring a seamless",
      reviewAuthor: "Dianne Russell",
      date: "3month ago",
    },
    {
      title: "Pricing is amazing for the small businesses around the world",
      text: "Our pricing is tailored to suit the needs of small businesses worldwide, offering affordable and competitive rates that provide excellent value for",
      reviewAuthor: "Marvin McKinney",
      date: "3month ago",
    },
  ],
};

// Blog
export const blogData = {
  sectionSubtitle: "Our Blog",
  sectionTitle: "Resource Center",
  sectionText:
    "Unlock the potential of our resource center, accessing valuable information and insights for your business growth.",
  blogs: [
    {
      imgSrc: FileText,
      badge: "Growth",
      title: "Why customer retention is the ultimate growth strategy?",
      author: {
        avatarSrc: User,
        authorName: "John Carte",
        publishDate: "Oct 10, 2024",
        readingTime: "8 min read",
      },
    },
    {
      imgSrc: BookOpen,
      badge: "Marketing",
      title: "Optimizing your advertising campaigns for higher ROAS",
      author: {
        avatarSrc: Users,
        authorName: "Annette Black",
        publishDate: "Jul 15, 2024",
        readingTime: "5 min read",
      },
    },
    {
      imgSrc: Newspaper,
      badge: "Growth",
      title: "How to build the ultimate tech stack for growth",
      author: {
        avatarSrc: UserCircle,
        authorName: "Ralph Edwards",
        publishDate: "Mar 24, 2024",
        readingTime: "2 min read",
      },
    },
  ],
};

// Cta
export const ctaData = {
  text: "Start tracking your user analytics to boost your business",
};

// Footer
export const footerData = {
  links: [
    {
      title: "Product",
      items: [
        {
          href: "#",
          label: "Components",
        },
        {
          href: "#",
          label: "Pricing",
        },
        {
          href: "#",
          label: "Dashboard",
        },
        {
          href: "#",
          label: "Feature requests",
        },
      ],
    },
    {
      title: "Developers",
      items: [
        {
          href: "#",
          label: "Documentation",
        },
        {
          href: "#",
          label: "Discord server",
        },
        {
          href: "#",
          label: "Support",
        },
        {
          href: "#",
          label: "Glossary",
        },
        {
          href: "#",
          label: "Changelog",
        },
      ],
    },
    {
      title: "Company",
      items: [
        {
          href: "#",
          label: "About",
        },
        {
          href: "#",
          label: "Careers",
        },
        {
          href: "#",
          label: "Blog",
        },
        {
          href: "#",
          label: "Contact",
        },
      ],
    },
    {
      title: "Legal",
      items: [
        {
          href: "#",
          label: "Terms and Conditions",
        },
        {
          href: "#",
          label: "Privacy Policy",
        },
        {
          href: "#",
          label: "Data Processing Agreement",
        },
        {
          href: "#",
          label: "Cookie manager",
        },
      ],
    },
  ],
  copyright: "© 2024 codewithsadee",
  socialLinks: [
    {
      href: "https://x.com/codewithsadee_",
      icon: <Twitter size={18} />,
    },
    {
      href: "https://github.com/codewithsadee",
      icon: <Github size={18} />,
    },
    {
      href: "https://www.linkedin.com/in/codewithsadee/",
      icon: <Linkedin size={18} />,
    },
    {
      href: "https://www.instagram.com/codewithsadee",
      icon: <Instagram size={18} />,
    },
    {
      href: "https://www.youtube.com/codewithsadee",
      icon: <Youtube size={18} />,
    },
  ],
};
