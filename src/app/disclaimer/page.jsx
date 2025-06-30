import React from "react";

export default function Disclaimer() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-2 text-blue-700 text-center">Disclaimer</h1>
      <p className="text-sm text-gray-500 mb-6 text-center">Last updated: <span className="font-semibold">June 2024</span></p>
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-blue-600 mb-2">Informational Purposes Only</h2>
        <p className="mb-4 text-gray-800">
          All content provided on <span className="font-bold text-blue-700">Medgloss</span>, including blogs, mock tests, question banks, previous year papers, videos, 3D models, virtual surgery, medicine/drug information, and Medgloss AI, is for informational and educational purposes only. It is not intended as professional advice (medical, legal, or otherwise). For more details, see our <a href="/disclaimer" className="underline text-blue-600">&quot;Disclaimer&quot;</a> and <a href="/privacy-policy" className="underline text-blue-600">&quot;Privacy Policy&quot;</a> pages.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-blue-600 mb-2">No Professional Advice</h2>
        <p className="text-gray-800">
          The information on this website does not constitute professional advice or recommendations. Always seek the advice of a qualified professional regarding any questions you may have. Do not disregard or delay seeking professional advice because of something you read on <span className="font-bold text-blue-700">Medgloss</span>.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-blue-600 mb-2">No Warranties</h2>
        <p className="text-gray-800">
          <span className="font-bold text-blue-700">Medgloss</span> provides content <span className="italic">&quot;as is&quot;</span> without warranties of any kind, express or implied. We do not guarantee the accuracy, completeness, or reliability of any content.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-blue-600 mb-2">Limitation of Liability</h2>
        <p className="text-gray-800">
          <span className="font-bold text-blue-700">Medgloss</span>, its creators, students, and contributors are not liable for any loss, injury, or damage resulting from the use of our website or reliance on any information provided. Use the website at your own risk.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-blue-600 mb-2">Third-Party Content</h2>
        <p className="text-gray-800">
          Our website may contain links to third-party websites or content. We do not endorse or take responsibility for third-party content. Accessing third-party sites is at your own risk.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-blue-600 mb-2">Contact</h2>
        <p className="text-gray-800">
          For questions or concerns about this disclaimer, please contact us at <a href="mailto:help@medgloss.com" className="underline text-blue-600">help@medgloss.com</a>.
        </p>
      </section>
    </main>
  );
}