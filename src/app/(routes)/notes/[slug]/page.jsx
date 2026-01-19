import { notFound } from "next/navigation";
import NoteDetailClient from "./NoteDetailClient";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/notes/by-slug/${resolvedParams.slug}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      return {
        title: "Note Not Found | MedGloss",
        description: "The requested note could not be found.",
      };
    }

    const data = await response.json();
    const note = data.data?.note;

    if (!note) {
      return {
        title: "Note Not Found | MedGloss",
        description: "The requested note could not be found.",
      };
    }

    return {
      title: note.metaTitle || `${note.title} | MedGloss`,
      description: note.metaDescription || note.description.substring(0, 160),
      keywords: note.keywords?.join(", "),
      openGraph: {
        title: note.title,
        description: note.description.substring(0, 160),
        images: note.thumbnail?.url ? [note.thumbnail.url] : [],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: note.title,
        description: note.description.substring(0, 160),
        images: note.thumbnail?.url ? [note.thumbnail.url] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Study Notes | MedGloss",
      description: "Medical study notes and resources",
    };
  }
}

export default async function NoteDetailPage({ params }) {
  const resolvedParams = await params;
  let note = null;
  let relatedNotes = [];
  let error = null;

  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/notes/by-slug/${resolvedParams.slug}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }
      throw new Error("Failed to fetch note");
    }

    const data = await response.json();
    note = data.data?.note;
    relatedNotes = data.data?.relatedNotes || [];

    if (!note) {
      notFound();
    }
  } catch (err) {
    console.error("Error fetching note:", err);
    error = err.message;
  }

  if (error || !note) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Error Loading Note
          </h1>
          <p className="text-gray-600">{error || "Note not found"}</p>
        </div>
      </div>
    );
  }

  // Generate JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: note.title,
    description: note.description,
    image: note.thumbnail?.url,
    datePublished: note.createdAt,
    dateModified: note.updatedAt,
    author: {
      "@type": "Person",
      name: note.author?.name || "MedGloss",
    },
    publisher: {
      "@type": "Organization",
      name: "MedGloss",
      logo: {
        "@type": "ImageObject",
        url: "https://medgloss.com/logo.png",
      },
    },
    keywords: note.keywords?.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NoteDetailClient note={note} relatedNotes={relatedNotes} />
    </>
  );
}
