"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, Calendar, User, FileText, Image as ImageIcon, Video, FileSpreadsheet } from "lucide-react";

const NoteCard = ({ note }) => {
  const router = useRouter();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getContentTypeBadges = () => {
    const badges = [];
    if (note.content?.pdf?.length > 0) {
      badges.push({ icon: FileText, label: "PDF", color: "bg-red-100 text-red-700" });
    }
    if (note.content?.images?.length > 0) {
      badges.push({ icon: ImageIcon, label: "Images", color: "bg-blue-100 text-blue-700" });
    }
    if (note.content?.ppt?.length > 0) {
      badges.push({ icon: FileSpreadsheet, label: "PPT", color: "bg-orange-100 text-orange-700" });
    }
    if (note.content?.videos?.length > 0) {
      badges.push({ icon: Video, label: "Video", color: "bg-purple-100 text-purple-700" });
    }
    return badges;
  };

  const contentBadges = getContentTypeBadges();

  return (
    <div
      onClick={() => router.push(`/notes/${note.slug}`)}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-hidden group"
    >
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-pink-100 to-purple-100 overflow-hidden">
        {note.thumbnail?.url ? (
          <Image
            src={note.thumbnail.url}
            alt={note.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText className="w-16 h-16 text-gray-400" />
          </div>
        )}
        
        {/* Type Badge */}
        <div className="absolute top-2 right-2">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 capitalize">
            {note.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
          {note.title}
        </h3>

        {/* Category */}
        <p className="text-sm text-gray-600 mb-3">
          <span className="font-medium">{note.category}</span>
        </p>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {note.description}
        </p>

        {/* Content Type Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {contentBadges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <span
                key={index}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}
              >
                <Icon className="w-3 h-3" />
                {badge.label}
              </span>
            );
          })}
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {note.views || 0}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(note.createdAt)}
            </span>
          </div>
          {note.author?.name && (
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {note.author.name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
