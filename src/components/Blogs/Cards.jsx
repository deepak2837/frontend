import Image from "next/image";
import Link from "next/link";

const BlogCard = ({ post }) => {
  const defaultImage = "/default-blog.jpg";

  const getImageUrl = (imageUrl) => {
    if (!imageUrl || imageUrl === "no_image" || !imageUrl.startsWith("http")) {
      return defaultImage;
    }
    return imageUrl;
  };

  return (
    <div
      className="rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/20 flex flex-col group relative bg-gradient-to-br from-white/60 via-pink-50 to-orange-50 backdrop-blur-md hover:scale-[1.03] hover:border-pink-300"
      style={{ minHeight: 260, maxWidth: 320 }}
    >
      {/* Image with glass overlay */}
      <div className="relative w-full h-32 sm:h-28 overflow-hidden">
        <Image
          src={getImageUrl(post.coverImage)}
          alt={post.title || "Blog post"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          priority={false}
        />
        {/* Glass overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10" />
        {/* Stats pill group */}
        <div className="absolute top-2 left-2 flex gap-1 z-20">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/70 text-pink-600 border border-pink-200 shadow-sm backdrop-blur-md">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 10c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"/></svg>
            {post.viewCount || 0}
          </span>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/70 text-pink-600 border border-pink-200 shadow-sm backdrop-blur-md">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 9l-2 2-2-2m0 6l2-2 2 2"/></svg>
            {post.likeCount || 0}
          </span>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/70 text-pink-600 border border-pink-200 shadow-sm backdrop-blur-md">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 17l4 4 4-4m0-5V3"/></svg>
            {post.readingTime ? `${post.readingTime}m` : ""}
          </span>
        </div>
      </div>
      <Link
        href={`/blog/${post.slug}`}
        className="flex flex-col h-full no-underline relative z-10 flex-1"
      >
        {/* Card content */}
        <div className="p-3 flex-grow flex flex-col justify-between relative z-10 mt-[-8px]">
          <div className="rounded-lg bg-white/80 backdrop-blur-md border border-white/30 px-2 py-1 shadow-sm">
            <h2 className="text-sm font-extrabold bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent mb-1 drop-shadow line-clamp-2">
              {post.subtitle}
            </h2>
            <p className="text-gray-700 text-xs mb-1 line-clamp-1">{post.summary}</p>
            <div className="flex flex-wrap gap-1 mb-0.5">
              {post.tags && post.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r from-pink-400 to-orange-400 text-white border border-white/20 shadow-sm select-none">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;
