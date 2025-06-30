import React from "react";

export default function TermsOfUse() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-2 text-blue-700 text-center">Terms of Use</h1>
      <p className="text-sm text-gray-500 mb-6 text-center">Last updated: <span className="font-semibold">June 2024</span></p>
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-blue-600 mb-2">Introduction</h2>
        <p className="text-gray-800">
          Welcome to <span className="font-bold text-blue-700">Medgloss</span>! By accessing or using our website and services, you agree to these Terms of Use. Please read them carefully. If you do not agree, please do not use our website.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-blue-600 mb-2">Who We Are</h2>
        <p className="text-gray-800">
          <span className="font-bold text-blue-700">Medgloss</span> provides free educational content, including blogs, mock tests, question banks, previous year papers, videos, 3D models, virtual surgery, medicine/drug information, Medgloss AI, and more. Our content is created by students, creators, and contributors for the benefit of learners and the public.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-blue-600 mb-2">Copyright &amp; Content Use</h2>
        <ul className="list-disc ml-6 text-gray-800 space-y-1">
          <li>All content on this website is protected by copyright and owned by <span className="font-bold">Medgloss</span> or its contributors.</li>
          <li>You may use our content for <span className="font-semibold text-green-700">personal, non-commercial, educational purposes only</span>.</li>
          <li>You may not copy, reproduce, redistribute, or use our content for commercial purposes without our written permission.</li>
          <li>Attribution is <span className="font-semibold text-blue-700">required</span> if you share or reference our content elsewhere.</li>
        </ul>
        <p className="text-xs mt-2 text-gray-600">
          If you believe any content on Medgloss infringes your copyright, please email us at <a href="mailto:help@medgloss.com" className="underline text-blue-600">help@medgloss.com</a>. Upon verification, we will promptly remove the content.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-blue-600 mb-2">User Responsibilities</h2>
        <ul className="list-disc ml-6 text-gray-800 space-y-1">
          <li>Do not misuse our content or services.</li>
          <li>Do not attempt to copy, scrape, or redistribute content without permission.</li>
          <li>Respect the intellectual property rights of <span className="font-bold">Medgloss</span> and all contributors.</li>
          <li>Use the website in compliance with all applicable laws and regulations.</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-blue-600 mb-2">Content Ownership</h2>
        <p className="text-gray-800">
          Content submitted by users, students, or contributors remains their intellectual property, but by submitting, you grant <span className="font-bold text-blue-700">Medgloss</span> a license to display, share, and use your content on our platform.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-blue-600 mb-2">Non-Commercial Use</h2>
        <p className="text-gray-800">
          Our website and its resources are <span className="font-semibold text-green-700">free for personal and educational use</span>. Any commercial use, including selling, republishing, or mass distribution, is strictly prohibited without our explicit written consent.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-blue-600 mb-2">Changes to Terms</h2>
        <p className="text-gray-800">
          We may update these Terms of Use from time to time. Continued use of the website means you accept any changes. Please review this page regularly.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-blue-600 mb-2">Contact</h2>
        <p className="text-gray-800">
          For questions, permissions, or concerns, please contact us at <a href="mailto:help@medgloss.com" className="underline text-blue-600">help@medgloss.com</a>.
        </p>
      </section>
    </main>
  );
}