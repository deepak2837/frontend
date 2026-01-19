import { cookies } from "next/headers";
import NotesClient from "./NotesClient";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata = {
  title: "Study Notes | MedGloss",
  description:
    "Browse comprehensive medical study notes organized by exam, course, and subject. Access PDFs, images, presentations, and videos for your medical education.",
};

export default async function NotesPage() {
  let notesData = [];
  let error = null;

  try {
    const response = await fetch(`${BASE_URL}/api/v1/notes/list/published`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch notes");
    }

    const data = await response.json();
    notesData = data.data?.notes || [];
  } catch (err) {
    console.error("Error fetching notes:", err);
    error = err.message;
  }

  return <NotesClient initialNotes={notesData} initialError={error} />;
}
