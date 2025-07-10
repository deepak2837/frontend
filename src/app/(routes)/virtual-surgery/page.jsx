// No "use client" directive needed for SSG/SSR components

import React from "react";
import Image from "next/image";
import Link from "next/link";


// Import images
import VirtualSurgeryImage from "../../../../public/img1.jpg";
import HeroBackgroundImage from "../../../../public/img2.jpg";
import AnatomyModelImage from "../../../../public/img15.jpeg";
import SurgicalSimImage from "../../../../public/img4.jpg";
import TeamworkImage from "../../../../public/img8.jpeg";
import VRHeadsetImage from "../../../../public/img6.jpg";
import FutureTechImage from "../../../../public/img12.jpeg";
import placeholderAvatar from "../../../../public/doctor.jpg";

// SEO Metadata
export const metadata = {
  title: "Virtual Surgery Education - Immersive Medical Training with VR Technology",
  description: "Discover how Virtual Reality is transforming medical education with risk-free surgical training, 3D anatomy exploration, and immersive patient simulations. Learn about VR applications in healthcare education.",
  keywords: "virtual surgery, medical education, VR training, surgical simulation, medical VR, anatomy education, healthcare technology, medical students, surgical training, virtual reality medicine",
  authors: [{ name: "Medical Education Team" }],
  creator: "Medical Education Platform",
  publisher: "MedGloss",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://medgloss.com"),
  alternates: {
    canonical: "/virtual-surgery",
  },
  openGraph: {
    title: "Virtual Surgery Education - Revolutionary Medical Training",
    description: "Experience the future of medical education with immersive Virtual Reality surgical training. Safe, effective, and accessible learning for medical students and healthcare professionals.",
    url: "https://medgloss.com/virtual-surgery",
    siteName: "MedGloss",
    images: [
      {
        url: "https://medgloss.com/_next/static/media/img2.5c41c1be.jpg",
        width: 1200,
        height: 630,
        alt: "Virtual Surgery Education - Medical VR Training",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Virtual Surgery Education - Revolutionary Medical Training",
    description: "Experience the future of medical education with immersive Virtual Reality surgical training. Safe, effective, and accessible learning.",
    images: ["https://medgloss.com/_next/static/media/img2.5c41c1be.jpg"],
    creator: "@medgloss", // optional if you own the handle
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "6nZhB5qr_BAhWcPGHaPqnpgZ3LcGf40ghiUsEsrqiP0",
    yahoo: "6nZhB5qr_BAhWcPGHaPqnpgZ3LcGf40ghiUsEsrqiP0",
    bing: "6nZhB5qr_BAhWcPGHaPqnpgZ3LcGf40ghiUsEsrqiP0",
  },
};

// Structured Data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "MedGloss",
  "description": "Leading platform for Virtual Reality medical education and surgical training.",
  "url": "https://medgloss.com/virtual-surgery",
  "logo": "https://medgloss.com/_next/image?url=%2Fmedglosslogo-photoaidcom-cropped.png&w=1920&q=75",
  "sameAs": [
    "https://x.com/medgloss",
    "https://www.linkedin.com/company/medgloss",
    "https://www.instagram.com/medgloss_official"
  ],
  "hasOfferingCatalog": {
    "@type": "OfferingCatalog",
    "name": "Virtual Surgery Training Programs",
    "itemListElement": [
      {
        "@type": "Course",
        "name": "Anatomy Exploration in VR",
        "description": "Interactive 3D anatomical models for enhanced spatial understanding",
        "provider": {
          "@type": "Organization",
          "name": "MedGloss"
        }
      },
      {
        "@type": "Course",
        "name": "Surgical Skill Training",
        "description": "Risk-free surgical procedure practice in virtual environments",
        "provider": {
          "@type": "Organization",
          "name": "MedGloss"
        }
      },
      {
        "@type": "Course",
        "name": "Diagnostic Practice",
        "description": "Virtual patient interactions and diagnostic reasoning training",
        "provider": {
          "@type": "Organization",
          "name": "MedGloss"
        }
      }
    ]
  },
  "review": [
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Dr. Sarah Chen"
      },
      "reviewBody": "Virtual surgery training reduced my procedural errors by 40% during my clinical rotations. The spatial awareness I gained was invaluable.",
      "name": "Third Year Surgical Resident Review"
    },
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Prof. James Rodriguez"
      },
      "reviewBody": "As an anatomy instructor, VR has transformed how I teach complex structures. Students grasp spatial relationships much faster now.",
      "name": "Faculty Review on VR Teaching"
    },
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Mia Jefferson"
      },
      "reviewBody": "The ability to practice rare cases repeatedly in VR gave me confidence when I encountered similar situations in clinical practice.",
      "name": "Student Experience with VR Training"
    }
  ]
};

// Color constants
const pinkColor = "#FE6B8B";
const orangeColor = "#FF8E53";
const lightPinkBorder = "#FED7DD";
const lightPinkBg = "#FFF0F3";
const lightOrangeBg = "#FFF4EC";
const deepBlue = "#3A5B84";

// Reusable Components
const Section = ({ children, className = "", id = "" }) => (
  <section id={id} className={`py-16 px-6 lg:py-24 ${className}`}>
    <div className="max-w-6xl mx-auto">{children}</div>
  </section>
);

const GradientText = ({ children, className = "" }) => (
  <span
    className={`bg-gradient-to-tr from-[${pinkColor}] to-[${orangeColor}] bg-clip-text text-transparent ${className}`}
  >
    {children}
  </span>
);

const StaticButtonClasses = (primary = true) =>
  `${
    primary
      ? `bg-gradient-to-tr from-[${pinkColor}] to-[${orangeColor}] text-white hover:from-[#E4607B] hover:to-[#E57E48]`
      : `bg-white text-[${pinkColor}] border border-[${lightPinkBorder}] hover:bg-[${pinkColor}]/10`
  } px-6 py-3 rounded-lg font-medium shadow-sm hover:shadow-md transition-all text-sm md:text-base`;

const Card = ({ icon, title, description, className = "", image = null }) => (
  <article
    className={`bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow h-full flex flex-col overflow-hidden group ${className}`}
  >
    {image && (
      <div className="h-48 w-full -mt-6 -mx-6 mb-6 overflow-hidden relative">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
      </div>
    )}
    <div className={`text-[${pinkColor}] mb-4 ${image ? "mt-0" : "mt-0"}`}>
      {icon && React.cloneElement(icon, { className: "h-8 w-8" })}
    </div>
    <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600 text-sm flex-grow">{description}</p>
  </article>
);

const FeatureWithImage = ({
  title,
  description,
  image,
  reversed = false,
  icon = null,
}) => (
  <article
    className={`grid md:grid-cols-2 items-center gap-8 lg:gap-12 mb-12 lg:mb-16`}
  >
    <div className={`flex-1 ${reversed ? "md:order-2" : "md:order-1"}`}>
      <div className="relative h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden shadow-xl group">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transform transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    </div>
    <div
      className={`flex-1 flex flex-col justify-center ${
        reversed ? "md:order-1" : "md:order-2"
      }`}
    >
      <div className="flex items-center mb-3">
        {icon && (
          <div className={`mr-3 text-[${pinkColor}]`}>
            {React.cloneElement(icon, { className: "h-6 w-6" })}
          </div>
        )}
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
          {title}
        </h2>
      </div>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  </article>
);

const TestimonialCard = ({ quote, author, role }) => (
  <article className="bg-white p-6 rounded-xl shadow-lg h-full flex flex-col">
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 rounded-full overflow-hidden mr-4 relative flex-shrink-0">
        <Image
          src={placeholderAvatar}
          alt={`${author} - ${role}`}
          fill
          sizes="48px"
          className="object-cover"
        />
      </div>
      <div>
        <h4 className="font-medium text-gray-800">{author}</h4>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
    <blockquote className="text-gray-600 italic flex-grow">{`"${quote}"`}</blockquote>
  </article>
);

const IconBox = ({ number, label, icon }) => (
  <div className="text-center p-6 bg-white rounded-xl shadow-md flex flex-col items-center h-full hover:shadow-lg transition-shadow">
    <div
      className={`inline-flex p-4 rounded-full bg-[${pinkColor}]/10 text-[${pinkColor}] mb-4`}
    >
      {React.cloneElement(icon, { className: "h-10 w-10" })}
    </div>
    <p className={`text-4xl font-bold mb-2 text-[${deepBlue}]`}>{number}</p>
    <p className="text-gray-600 text-sm flex-grow">{label}</p>
  </div>
);

// Data definitions
const applications = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4.874 15.016C2.825 13.48 2 10.93 2 8.108 2 4.18 5.582 1 10 1s8 3.18 8 7.108c0 2.822-.825 5.372-2.874 6.908m-12.252 0v2.976a2 2 0 002 2h8.252a2 2 0 002-2v-2.976m-12.252 0l-1.5 1.5m15.252 0l1.5 1.5M12 17.25a2.625 2.625 0 110-5.25 2.625 2.625 0 010 5.25z"
        />
      </svg>
    ),
    title: "Anatomy Exploration",
    description:
      "Visualize and interact with complex 3D anatomical models in an immersive space, enhancing spatial understanding.",
    image: AnatomyModelImage,
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
        />
      </svg>
    ),
    title: "Surgical Skill Training",
    description:
      "Practice procedural steps, instrument handling, and decision-making in realistic, risk-free simulated surgical environments.",
    image: SurgicalSimImage,
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M8 16l-1.879-1.879a5.25 5.25 0 010-7.424L12 1l5.879 5.879a5.25 5.25 0 010 7.424L16 16M12 19v-6"
        />
      </svg>
    ),
    title: "Diagnostic Practice",
    description:
      "Encounter virtual patients with diverse symptoms and practice diagnostic reasoning and patient interaction skills.",
    image: VirtualSurgeryImage,
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    title: "Teamwork & Communication",
    description:
      "Participate in multi-user VR scenarios simulating emergency rooms or operating theaters to practice collaboration and communication.",
    image: TeamworkImage,
  },
];

const techComponents = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-1.414a5 5 0 010-7.072m7.072 0a5 5 0 010 7.072M12 18a3 3 0 100-6 3 3 0 000 6z"
        />
      </svg>
    ),
    title: "VR Headsets",
    description:
      "Provide visual and auditory immersion (e.g., Meta Quest, HTC Vive, Varjo).",
    image: VRHeadsetImage,
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 2.25v4.8m5.96 7.32a6 6 0 01-5.841 7.38m0-7.38a6 6 0 005.841-7.38m0 7.38l-3.18-3.181"
        />
      </svg>
    ),
    title: "Input Devices",
    description:
      "Handheld controllers, gloves, or specialized tools for interaction.",
    image: null,
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    title: "Simulation Software",
    description:
      "The core engine rendering environments, physics, and educational content.",
    image: null,
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2.5m0 0V17m0 0a1.5 1.5 0 003 0m-3 0h6.5m0 0V17m0 0a1.5 1.5 0 003 0m-3 0V14m0 0v-2.5a1.5 1.5 0 00-3 0m3 0h-3"
        />
      </svg>
    ),
    title: "Haptics (Optional)",
    description:
      "Devices providing force feedback or tactile sensations for realism.",
    image: null,
  },
];

const statsData = [
  {
    number: "87%",
    label: "Students report improved understanding",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    number: "36%",
    label: "Faster skill acquisition vs. traditional",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    number: "92%",
    label: "Reduction in anxiety for first procedures",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
  {
    number: "450+",
    label: "Medical schools implementing VS",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
  },
];

const testimonials = [
  {
    quote:
      "Virtual surgery training reduced my procedural errors by 40% during my clinical rotations. The spatial awareness I gained was invaluable.",
    author: "Dr. Sarah Chen",
    role: "3rd Year Surgical Resident",
  },
  {
    quote:
      "As an anatomy instructor, VR has transformed how I teach complex structures. Students grasp spatial relationships much faster now.",
    author: "Prof. James Rodriguez",
    role: "Medical School Faculty",
  },
  {
    quote:
      "The ability to practice rare cases repeatedly in VR gave me confidence when I encountered similar situations in clinical practice.",
    author: "Mia Jefferson",
    role: "Medical Student",
  },
];

// This tells Next.js to generate this page at build time
export const generateStaticParams = async () => {
  return [];
};

export default function VirtualSurgeryEducationPage() {
  return (
    <>
      {/* Structured Data Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      
      <div className="bg-gray-50 font-sans text-gray-700">
        {/* Hero Section */}
        <section
          id="intro"
          className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-24 pb-12 px-4"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(254, 107, 139, 0.05)), url('${HeroBackgroundImage.src}')`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute w-48 h-48 rounded-full bg-pink-200/20 -top-16 -left-16 opacity-50" />
            <div className="absolute w-32 h-32 rounded-full bg-rose-200/20 bottom-16 -right-16 opacity-50" />
            <div className="absolute w-40 h-40 rounded-full bg-orange-200/15 top-1/4 right-1/4 opacity-40" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="inline-block p-3 rounded-full bg-gradient-to-tr from-pink-100 to-orange-100 shadow-lg mb-6">
              <div
                className={`bg-gradient-to-tr from-[${pinkColor}] to-[${orangeColor}] p-4 rounded-full shadow-inner`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 text-white">
              We Are Bringing{" "}
              <GradientText>Virtual Surgery</GradientText>
              {" "}For You
            </h1>
            <p className="text-lg md:text-xl text-white mb-8 max-w-2xl mx-auto">
              Discover how Virtual Reality is transforming healthcare education,
              offering unprecedented opportunities for skill development and
              anatomical understanding.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#what-is-vs"
                className={StaticButtonClasses(true)}
                aria-label="Learn more about Virtual Surgery Education"
              >
                <span className="flex items-center justify-center">
                  <span>Discover More</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* What is Virtual Surgery Section */}
        <Section id="what-is-vs" className="bg-white">
          <FeatureWithImage
            title="What is Virtual Surgery?"
            description="Virtual Surgery uses immersive technologies like Virtual Reality (VR) and Augmented Reality (AR) to create simulated medical environments. It allows users to interact with virtual anatomical models, instruments, and patient scenarios in a highly realistic, yet completely safe, digital space. Think of it as a sophisticated, interactive flight simulator for healthcare professionals."
            image={VirtualSurgeryImage}
            reversed={false}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
        </Section>

      {/* --- Why It Matters for Students --- */}
      <Section id="why-vs" className={`bg-[${lightOrangeBg}]`}>
        <h2 className="text-3xl lg:text-4xl font-bold mb-10 lg:mb-12 text-center text-gray-800">
          Why <GradientText>VS Matters</GradientText> for Your Education
        </h2>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          <Card
            title="Risk-Free Practice"
            description="Master complex procedures and critical decision-making without any risk to real patients. Repeat steps as needed to build proficiency."
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />{" "}
              </svg>
            }
          />
          <Card
            title="Enhanced Understanding"
            description="Explore 3D anatomy and pathologies in ways traditional textbooks cannot offer. Deepen spatial reasoning and contextual knowledge."
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />{" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />{" "}
              </svg>
            }
          />
          <Card
            title="Accessibility & Repetition"
            description="Access diverse clinical scenarios and rare cases on-demand. Practice consistently to build muscle memory and confidence."
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m-15.357-2A8.001 8.001 0 0019.418 15m0 0H15"
                />{" "}
              </svg>
            }
          />
        </div>
      </Section>

      {/* --- Applications in Education --- */}
      <Section id="applications" className="bg-white">
        <h2 className="text-3xl lg:text-4xl font-bold mb-10 lg:mb-12 text-center text-gray-800">
          Key <GradientText>Applications</GradientText> in Learning
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {applications.map((app) => (
            // Removed motion.div wrapper
            <Card key={app.title} {...app} />
          ))}
        </div>
      </Section>

      {/* --- Technology Overview --- */}
      <Section id="tech" className={`bg-[${lightPinkBg}]`}>
        <h2 className="text-3xl lg:text-4xl font-bold mb-10 lg:mb-12 text-center text-gray-800">
          The <GradientText>Technology</GradientText> Behind VS
        </h2>
        <FeatureWithImage
          title={techComponents[0].title}
          description={techComponents[0].description}
          image={techComponents[0].image}
          reversed={true}
          icon={techComponents[0].icon}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-8">
          {techComponents.slice(1).map((tech) => (
            // Removed motion.div wrapper
            <div
              key={tech.title}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow text-center"
            >
              <div
                className={`inline-flex p-3 rounded-full bg-[${pinkColor}]/10 text-[${pinkColor}] mb-4`}
              >
                {tech.icon}
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">{tech.title}</h4>
              <p className="text-gray-600 text-sm">{tech.description}</p>
            </div>
          ))}
        </div>
        <p className="text-center mt-10 text-gray-600 text-sm italic">
          Technology combinations vary based on specific training needs and
          resources.
        </p>
      </Section>

      {/* --- Impact Stats Section --- */}
      <Section id="stats" className="bg-white">
        <h2 className="text-3xl lg:text-4xl font-bold mb-10 lg:mb-12 text-center text-gray-800">
          Measurable <GradientText>Impact</GradientText> on Education
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {statsData.map((stat, index) => (
            <IconBox key={index} {...stat} />
          ))}
        </div>
        <p className="text-center mt-8 text-gray-500 text-xs italic">
          *(Stats compiled from various educational studies, specific results
          may vary)
        </p>
      </Section>

      {/* --- Testimonials Section --- */}
      <Section id="testimonials" className={`bg-[${lightOrangeBg}]`}>
        <h2 className="text-3xl lg:text-4xl font-bold mb-10 lg:mb-12 text-center text-gray-800">
          Voices from the <GradientText>MedEd Community</GradientText>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </Section>

      {/* --- Future of VS --- */}
      <Section id="future" className="bg-white">
        <FeatureWithImage
          title="The Future is Immersive"
          description="Virtual Surgery and related XR technologies are rapidly evolving. Expect more realistic simulations, AI-powered feedback, wider curriculum integration, collaborative remote learning, and potential use in real-time surgical guidance. Staying informed about these advancements is key for tomorrow's healthcare leaders."
          image={FutureTechImage}
          reversed={false}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10m0-2.657A8 8 0 0117.657 18.657M10 14a2 2 0 11-4 0 2 2 0 014 0z"
              />{" "}
            </svg>
          }
        />
      </Section>

      {/* --- Resources & Next Steps --- */}
      <Section
        id="resources"
        className={`bg-gradient-to-br from-[${lightPinkBg}] to-[${lightOrangeBg}]/50`}
      >
        <h2 className="text-3xl lg:text-4xl font-bold mb-10 lg:mb-12 text-center text-gray-800">
          Resources & <GradientText>Next Steps</GradientText>
        </h2>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 bg-white/70 p-8 rounded-xl shadow-lg backdrop-blur-sm">
          {/* Static Content */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 mr-2 text-[${pinkColor}]`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />{" "}
              </svg>
              Explore Further
            </h3>
            <ul className="list-none space-y-3 text-gray-600">
              <li className="flex items-start">
                {" "}
                <span className={`text-[${pinkColor}] mr-2 mt-1`}>›</span> Check
                if your institution has a simulation lab with VR capabilities.{" "}
              </li>
              <li className="flex items-start">
                {" "}
                <span className={`text-[${pinkColor}] mr-2 mt-1`}>›</span>{" "}
                Search PubMed/Google Scholar for Virtual Reality Medical
                Education or Virtual Surgery Simulation.{" "}
              </li>
              <li className="flex items-start">
                {" "}
                <span className={`text-[${pinkColor}] mr-2 mt-1`}>›</span>{" "}
                Explore platforms like Osso VR, Fundamental Surgery, or
                PrecisionOS (check for student access/demos).{" "}
              </li>
            </ul>
          </div>
          {/* Static Content */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 mr-2 text-[${pinkColor}]`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3.418"
                />{" "}
              </svg>
              Stay Updated & Engage
            </h3>
            <p className="text-gray-600 mb-4">
              The field is evolving fast! Follow key journals (e.g., JMIR),
              conferences (AIME, Medicine Meets VR), and reputable tech news
              sources.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Keep exploring and consider how these tools can enhance your
              learning journey!
            </p>
          </div>
        </div>
      </Section>
    </div> 
  </>
);
}
