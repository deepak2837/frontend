import { Metadata } from 'next';

export const metadata = {
  title: 'Careers at MedGloss - Join Our Medical Education Revolution',
  description: 'Join MedGloss and help revolutionize medical education. We\'re hiring for various roles including software developers, content creators, medical educators, and more. Be part of our mission to make medical education accessible to everyone.',
  keywords: [
    'medical careers',
    'healthcare jobs', 
    'medical education careers',
    'MedGloss jobs',
    'medical content creation',
    'medical technology jobs',
    'medical software developer',
    'medical content writer',
    'medical educator',
    'healthcare technology',
    'medical assessment specialist',
    '3D medical visualization',
    'medical video content',
    'medical community manager'
  ],
  openGraph: {
    title: 'Careers at MedGloss - Join Our Medical Education Revolution',
    description: 'Join MedGloss and help revolutionize medical education. We\'re hiring for various roles including software developers, content creators, medical educators, and more.',
    type: 'website',
    url: 'https://medgloss.com/career',
    siteName: 'MedGloss',
    images: [
      {
        url: 'https://medgloss.com/og-career.jpg',
        width: 1200,
        height: 630,
        alt: 'MedGloss Careers - Medical Education Jobs'
      }
    ],
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Careers at MedGloss - Join Our Medical Education Revolution',
    description: 'Join MedGloss and help revolutionize medical education. We\'re hiring for various roles including software developers, content creators, medical educators, and more.',
    images: ['https://medgloss.com/og-career.jpg']
  },
  alternates: {
    canonical: 'https://medgloss.com/career'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code'
  }
};

export default function CareerLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "MedGloss",
            "url": "https://medgloss.com",
            "logo": "https://medgloss.com/logo.png",
            "description": "MedGloss is a free online platform that provides educational content for medical students and the public.",
            "sameAs": [
              "https://www.facebook.com/medgloss",
              "https://www.twitter.com/medgloss",
              "https://www.linkedin.com/company/medgloss"
            ],
            "jobPosting": [
              {
                "@type": "JobPosting",
                "title": "Software Development Engineer",
                "description": "Join our dynamic development team to build innovative healthcare solutions.",
                "datePosted": "2024-12-01",
                "validThrough": "2025-06-01",
                "employmentType": "FULL_TIME",
                "hiringOrganization": {
                  "@type": "Organization",
                  "name": "MedGloss"
                },
                "jobLocation": {
                  "@type": "Place",
                  "address": {
                    "@type": "PostalAddress",
                    "addressCountry": "IN"
                  }
                }
              },
              {
                "@type": "JobPosting",
                "title": "Medical Content Writer & Blog Creator",
                "description": "Create engaging, accurate, and educational medical content.",
                "datePosted": "2024-12-01",
                "validThrough": "2025-06-01",
                "employmentType": "FULL_TIME",
                "hiringOrganization": {
                  "@type": "Organization",
                  "name": "MedGloss"
                },
                "jobLocation": {
                  "@type": "Place",
                  "address": {
                    "@type": "PostalAddress",
                    "addressCountry": "IN"
                  }
                }
              }
            ]
          })
        }}
      />
      {children}
    </>
  );
} 