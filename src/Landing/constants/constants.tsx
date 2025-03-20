import { MenuItem } from "@/Landing/constants/types";
// blog pics
import blog1 from "@/assets/blog/blog1.png";
import avatar1 from "@/assets/blog/blog1avatar.png";
import blog2 from "@/assets/blog/blog2.png";
import avatar2 from "@/assets/blog/blog2avatar.png";
import blog3 from "@/assets/blog/blog3.png";
import avatar3 from "@/assets/blog/blog3avatar.webp";
// feature pics
import feature1 from "@/assets/feature/feature1.jpg";
import feature2 from "@/assets/feature/feature2.jpg";
import feature3 from "@/assets/feature/feature3.jpg";
import feature4 from "@/assets/feature/feature4.jpeg";
import feature5 from "@/assets/feature/feature5.jpeg";

export const featureImages = {
  feature1: feature1,
  feature2: feature2,
  feature3: feature3,
  feature4: feature4,
  feature5: feature5,
};
import {
  BarChart2,
  Github,
  Linkedin,
  Instagram,
  Workflow,
  Newspaper,
  Eye,
  Rocket,
  Settings,
  Star,
  Server,
  Users,
  Activity,
  UserPlus,
  TagIcon,
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
      fillRule="evenodd"
      d="M21.7 8.037a4.26 4.26 0 0 0-.789-1.964 2.84 2.84 0 0 0-1.984-.839c-2.767-.2-6.926-.2-6.926-.2s-4.157 0-6.928.2a2.836 2.836 0 0 0-1.983.839 4.225 4.225 0 0 0-.79 1.965 30.146 30.146 0 0 0-.2 3.206v1.5a30.12 30.12 0 0 0 .2 3.206c.094.712.364 1.39.784 1.972.604.536 1.38.837 2.187.848 1.583.151 6.731.2 6.731.2s4.161 0 6.928-.2a2.844 2.844 0 0 0 1.985-.84 4.27 4.27 0 0 0 .787-1.965 30.12 30.12 0 0 0 .2-3.206v-1.516a30.672 30.672 0 0 0-.202-3.206Zm-11.692 6.554v-5.62l5.4 2.819-5.4 2.801Z"
      clipRule="evenodd"
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
      fillRule="evenodd"
      d="M12.037 21.998a10.313 10.313 0 0 1-7.168-3.049 9.888 9.888 0 0 1-2.868-7.118 9.947 9.947 0 0 1 3.064-6.949A10.37 10.37 0 0 1 12.212 2h.176a9.935 9.935 0 0 1 6.614 2.564L16.457 6.88a6.187 6.187 0 0 0-4.131-1.566 6.9 6.9 0 0 0-4.794 1.913 6.618 6.618 0 0 0-2.045 4.657 6.608 6.608 0 0 0 1.882 4.723 6.891 6.891 0 0 0 4.725 2.07h.143c1.41.072 2.8-.354 3.917-1.2a5.77 5.77 0 0 0 2.172-3.41l.043-.117H12.22v-3.41h9.678c.075.617.109 1.238.1 1.859-.099 5.741-4.017 9.6-9.746 9.6l-.215-.002Z"
      clipRule="evenodd"
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
  sectionTitle: "Presenting the next-gen equipment",
  decoTitle: "tracking system",
  sectionText:
    "Next-gen IT asset management: Gain complete visibility into your hardware and software inventory and drive efficient resource allocation with our comprehensive platform.",
};

// Feature
export const featureData = {
  sectionSubtitle: "Features",
  sectionTitle: "Efficient IT Asset Management",
  sectionText:
    "Manage your IT assets seamlessly with a powerful suite of features designed to enhance tracking, monitoring, and reporting.",

  features: [
    {
      icon: <Server size={32} />,
      iconBoxColor: "bg-blue-600",
      title: "Asset Management",
      desc: "Add, update, and delete IT equipment while storing crucial details like name, serial number, and status.",
      imgSrc: featureImages.feature1,
    },
    {
      icon: <Users size={32} />,
      iconBoxColor: "bg-cyan-700",
      title: "Assignment Tracking",
      desc: "Easily assign equipment to employees and track which employee has which device",
      imgSrc: featureImages.feature2,
    },
    {
      icon: <Activity size={32} />,
      iconBoxColor: "bg-emerald-500",
      title: "Status Monitoring",
      desc: "Keep track of asset status—Available, Assigned, or Under Repair—to optimize asset utilization.",
      imgSrc: featureImages.feature3,
    },
    {
      icon: <BarChart2 size={32} />,
      iconBoxColor: "bg-violet-700",
      title: "Basic Reporting",
      desc: "Gain insights into total assets, assigned assets, and available assets with clear and concise reporting.",
      imgSrc: featureImages.feature4,
    },
    {
      icon: <UserPlus size={32} />,
      iconBoxColor: "bg-teal-600",
      title: "Employee Management",
      desc: "Add and manage employees within the system, allowing seamless asset assignment and tracking.",
      imgSrc: featureImages.feature5,
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
      date: "3 months ago",
    },
    {
      title: "Great service from the expert support system of Flux",
      text: "Experience exceptional service and support from Flux's expert team, dedicated to providing knowledgeable assistance and ensuring seamless asset management",
      reviewAuthor: "Dianne Russell",
      date: "3 months ago",
    },
    {
      title: "Pricing is amazing for small IT departments around the world",
      text: "AssetTrack's pricing is tailored to suit the needs of small IT departments worldwide, offering affordable and competitive rates that provide excellent value for",
      reviewAuthor: "Marvin McKinney",
      date: "3 months ago",
    },
  ],
};

// Blog
export const blogData = {
  sectionSubtitle: "Our Blog",
  sectionTitle: "Resource Center",
  sectionText:
    "Unlock the potential of our resource center, accessing valuable information and insights for effective IT asset management.",
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
  links: [
    {
      title: "Product",
      items: [
        {
          href: "#",
          label: "Hardware Tracking",
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
      title: "IT Managers",
      items: [
        {
          href: "#",
          label: "Documentation",
        },
        {
          href: "#",
          label: "Support forum",
        },
        {
          href: "#",
          label: "Technical support",
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

  socialLinks: [
    {
      href: "https://github.com/miguelkarma",
      icon: <Github size={18} />,
    },
    {
      href: "https://www.linkedin.com/",
      icon: <Linkedin size={18} />,
    },
    {
      href: "https://www.instagram.com/migzyr",
      icon: <Instagram size={18} />,
    },
  ],
};
