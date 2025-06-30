import React from 'react';

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-900 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">About MedGloss</h1>
      <p className="mb-4 text-lg text-center">
        MedGloss is a free, innovative platform dedicated to empowering students and medical aspirants with high-quality educational resources and community-driven content.
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-2">Our Mission</h2>
      <p className="mb-4">
        Our mission is to make medical education accessible, interactive, and engaging for everyone. We believe in the power of community and technology to transform learning experiences.
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-2">What We Offer</h2>
      <ul className="list-disc ml-6 mb-4">
        <li><b>Blogs:</b> User-generated articles and insights on medical topics.</li>
        <li><b>Videos:</b> Educational and explanatory videos to enhance understanding.</li>
        <li><b>3D Models:</b> Interactive anatomical and medical models for immersive learning.</li>
        <li><b>Mock Tests:</b> Practice exams to help you prepare for medical entrance and professional exams.</li>
        <li><b>Question Banks:</b> Curated collections of questions for self-assessment and revision.</li>
        <li><b>Previous Year Question Papers:</b> Access to past exam papers for better preparation.</li>
        <li><b>MedGloss AI:</b> Smart tools and features powered by AI to support your studies.</li>
        <li><b>Student Support:</b> A supportive community and resources to help you succeed.</li>
      </ul>
      <h2 className="text-2xl font-semibold mt-8 mb-2">Who We Are</h2>
      <p className="mb-4">
        MedGloss is built by a passionate team of educators, technologists, and students who understand the challenges of medical education. We are committed to providing a platform where knowledge is shared, questions are answered, and learning never stops.
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-2">Connect With Us</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Twitter: <a href="https://x.com/medgloss" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">@medgloss</a></li>
        <li>Instagram: <a href="https://www.instagram.com/medgloss_official/" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">@medgloss_official</a></li>
        <li>LinkedIn: <a href="https://www.linkedin.com/company/medgloss" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">MedGloss</a></li>
      </ul>
      <p className="mt-8 text-center text-gray-500 text-sm">© {new Date().getFullYear()} MedGloss. All rights reserved.</p>
    </div>
  );
} 