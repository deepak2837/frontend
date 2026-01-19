"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, Calendar, User, Download } from "lucide-react";
import MarkdownRenderer from "@/components/Notes/MarkdownRenderer";
import PDFViewer from "@/components/Notes/PDFViewer";
import ImageGallery from "@/components/Notes/ImageGallery";
import PPTSlider from "@/components/Notes/PPTSlider";
import VideoPlayer from "@/components/Notes/VideoPlayer";
import NoteCard from "@/components/Notes/NoteCard";

const NoteDetailClient = ({ note, relatedNotes }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("description");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const contentTabs = [];
  if (note.description) contentTabs.push({ id: "description", label: "Description" });
  if (note.content?.pdf?.length > 0) contentTabs.push({ id: "pdf", label: "PDFs" });
  if (note.content?.images?.length > 0) contentTabs.push({ id: "images", label: "Images" });
  if (note.content?.ppt?.length > 0) contentTabs.push({ id: "ppt", label: "Presentations" });
  if (note.content?.videos?.length > 0) contentTabs.push({ id: "videos", label: "Videos" });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Header */}
      <header className="relative bg-gradient-to-r from-primary to-primary/80 rounded-xl md:rounded-2xl mb-6 md:mb-8 overflow-hidden max-w-7xl mx-auto px-4 py-8 md:py-12 w-full">
        <div className="absolute inset-0 bg-pattern opacity-10" aria-hidden="true"></div>
        <div className="relative p-5 md:p-8 lg:p-12 text-white">
          <button
            onClick={() => router.push("/notes")}
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Notes
          </button>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">{note.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/90">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {note.views} views
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(note.createdAt)}
            </span>
            {note.author?.name && (
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {note.author.name}
              </span>
            )}
            <span className="px-3 py-1 bg-white/20 rounded-full capitalize">
              {note.type} - {note.category}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 pb-8">
          {/* Content Tabs */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              {/* Tab Headers */}
              <div className="border-b border-gray-200 overflow-x-auto">
                <div className="flex">
                  {contentTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${
                        activeTab === tab.id
                          ? "text-pink-600 border-b-2 border-pink-600"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "description" && (
                  <div className="prose max-w-none">
                    <MarkdownRenderer content={note.description} />
                  </div>
                )}

                {activeTab === "pdf" && note.content?.pdf?.length > 0 && (
                  <div className="space-y-6">
                    {note.content.pdf.map((pdf, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-800">{pdf.fileName}</h3>
                          <a
                            href={pdf.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </a>
                        </div>
                        <PDFViewer url={pdf.url} />
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "images" && note.content?.images?.length > 0 && (
                  <ImageGallery images={note.content.images} />
                )}

                {activeTab === "ppt" && note.content?.ppt?.length > 0 && (
                  <div className="space-y-6">
                    {note.content.ppt.map((ppt, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-800">{ppt.fileName}</h3>
                          <a
                            href={ppt.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </a>
                        </div>
                        <PPTSlider slides={[ppt]} />
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "videos" && note.content?.videos?.length > 0 && (
                  <div className="space-y-6">
                    {note.content.videos.map((video, index) => (
                      <div key={index}>
                        {video.fileName && (
                          <h3 className="font-medium text-gray-800 mb-2">{video.fileName}</h3>
                        )}
                        <VideoPlayer video={video} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="font-bold text-gray-800 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related Notes */}
            {relatedNotes && relatedNotes.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Related Notes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedNotes.map((relatedNote) => (
                    <NoteCard key={relatedNote._id} note={relatedNote} />
                  ))}
                </div>
              </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default NoteDetailClient;
