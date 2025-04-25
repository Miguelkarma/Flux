import { MenuItem } from "@/Landing/constants/types";
// blog pics
import blog1 from "@/assets/blog/blog1.png";
import avatar1 from "@/assets/blog/blog1avatar.png";
import blog2 from "@/assets/blog/blog2.png";
import avatar2 from "@/assets/blog/blog2avatar.png";
import blog3 from "@/assets/blog/blog3.png";
import avatar3 from "@/assets/blog/blog3avatar.webp";

import {
  Github,
  Linkedin,
  Instagram,
  Workflow,
  Newspaper,
  Eye,
  Rocket,
  Settings,
  Star,
  UserPlus,
  TagIcon,
  Layout,
  MousePointerClick,
  Sparkles,
} from "lucide-react";

//stats

export const brandTagline =
  "Streamlining IT asset tracking for efficiency and compliance.";

export const statsSection = {
  title: "Asset Monitor",
  description: "Complete visibility and control over your IT infrastructure",
  stats: [
    {
      value: "98%",
      label: "Audit Compliance Rate",
    },
    {
      value: "65%",
      label: "Reduction in Lost Assets",
    },
    {
      value: "3.5x",
      label: "Faster Asset Deployment",
    },
    {
      value: "42%",
      label: "Lower Maintenance Costs",
    },
  ],
};
// Header
export const navMenu: MenuItem[] = [
  {
    href: "#features",
    label: "Features",
    icon: <Settings />,
  },
  {
    href: "#process",
    label: "Process",
    icon: <Workflow />,
  },

  {
    href: "#overview",
    label: "Overview",
    icon: <Eye />,
  },
  {
    href: "#reviews",
    label: "Reviews",
    icon: <Star />,
  },
  {
    href: "#blog",
    label: "Blogs",
    icon: <Newspaper />,
  },
  {
    href: "#cta",
    label: "Try Now",
    icon: <Rocket />,
  },
];

// Hero
export const heroData = {
  sectionSubtitle: "IT asset management",
  sectionTitle: "Presenting the lightweight equipment",
  decoTitle: "tracking system",
  sectionText:
    "Lightweight IT asset management: Gain complete visibility into your hardware inventory and drive efficient resource allocation with our comprehensive platform.",
};

// Feature
export const featureData = {
  features: [
    {
      icon: <Layout size={32} />,
      iconBoxColor: "bg-sky-600",
      title: "Dashboard Visibility",
      desc: "Get a centralized view of all your IT equipment with real-time status, location, and assignment tracking.",
    },
    {
      icon: <Sparkles size={32} />,
      iconBoxColor: "bg-sky-600",
      title: "Smart QR Scanning",
      desc: "Register and identify assets instantly using QR codes — no paperwork, no hassle.",
    },
    {
      icon: <MousePointerClick size={32} />,
      iconBoxColor: "bg-sky-600",
      title: "Automated Lifecycle Management",
      desc: "Track asset usage, maintenance, and retirement automatically with reminders and history logs.",
    },
  ],
};

// Process
export const processData = {
  sectionSubtitle: "How it works",
  sectionTitle: "Easy Process to Get Started",
  sectionText:
    "Discover how our IT asset management system works by leveraging advanced tracking and inventory management techniques.",
  list: [
    {
      icon: <UserPlus size={32} />,
      title: "Create your account",
      text: "Join us now and create your account to start exploring our platform and unlocking powerful asset tracking features.",
    },

    {
      icon: <TagIcon size={32} />,
      title: "Start tagging your assets",
      text: "Start tagging your IT assets effortlessly to gain complete visibility into your equipment lifecycle, maintenance needs, and utilization metrics.",
    },
  ],
};

// Overview
export const overviewData = {
  sectionSubtitle: "Overview",

  list: [
    {
      title: "Tracking",
      text: "Monitor IT assets",
    },
    {
      title: "Optimized Utilization",
      text: "Improve asset lifecycle management",
    },
    {
      title: "Seamless",
      text: "Automate inventory",
    },
  ],
};

// Review
export const reviewData = {
  sectionSubtitle: "Reviews",
  sectionTitle: "What Our Customers Are Saying",
  reviewCard: [
    {
      title: "We've reduced equipment losses by 85% thanks to Flux.",
      text: "Our IT department is running more efficiently with the help of Flux, resulting in better equipment utilization, improved maintenance scheduling",
      reviewAuthor: "Wade Warren",
      date: "1 months ago",
    },
    {
      title: "Great service from the expert support system of Flux",
      text: "Experience exceptional service and support from Flux's expert team, dedicated to providing knowledgeable assistance and ensuring seamless asset management",
      reviewAuthor: "Dianne Russell",
      date: "3 months ago",
    },
    {
      title: "Pricing is amazing for small IT departments around the world",
      text: "Flux pricing is tailored to suit the needs of small IT departments worldwide, offering affordable and competitive rates that provide excellent value for",
      reviewAuthor: "Marvin McKinney",
      date: "4 months ago",
    },
  ],
};

// Blog
export const blogData = {
  sectionSubtitle: "Blogs",
  sectionTitle: "Resource Center",
  sectionText:
    "Unlock the potential of accessing valuable information and insights for effective IT asset management.",
  blogs: [
    {
      href: "https://www.assetpanda.com/resource-center/blog/it-asset-management-best-practices/",
      imgSrc: blog1,
      badge: "Best Practices",
      title: "IT Asset Management Best Practices - Complete Guide (2024)",
      author: {
        avatarSrc: avatar1,
        authorName: "AssetPanda",
        publishDate: "July 15, 2024",
        readingTime: "9 min read",
      },
    },
    {
      href: "https://www.atlassian.com/itsm/it-asset-management?",
      imgSrc: blog2,
      badge: "Guide",
      title: "ITAM: The Ultimate Guide to IT Asset Management ",
      author: {
        avatarSrc: avatar2,
        authorName: "Atlassian",
        publishDate: "May 15, 2023",
        readingTime: "10 min read",
      },
    },
    {
      href: "https://www.issuetrak.com/blog/what-is-it-asset-management-why-is-it-asset-management-important?",
      imgSrc: blog3,
      badge: "Optimization",
      title: "Enhancing Operational Efficiency through IT Asset Management",
      author: {
        avatarSrc: avatar3,
        authorName: "Issuetrak",
        publishDate: "September 4, 2024",
        readingTime: "5 min read",
      },
    },
  ],
};

// Cta
export const ctaData = {
  text: "Start tracking your IT assets to optimize resource allocation and reduce costs",
};

// Footer
export const footerData = {
  socialLinks: [
    {
      href: "https://github.com/miguelkarma",
      icon: <Github size={18} />,
    },
    {
      href: "https://ph.linkedin.com/in/paul-miguel-santos-17aa43320",
      icon: <Linkedin size={18} />,
    },
    {
      href: "https://www.instagram.com/migzyr",
      icon: <Instagram size={18} />,
    },
  ],
};
