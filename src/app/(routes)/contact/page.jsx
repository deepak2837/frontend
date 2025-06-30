'use client';
import React, { useState } from 'react';
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(false);
    setError("");
    try {
      const res = await fetch(`${baseUrl}/api/v1/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit. Please try again.");
      }
      setSubmitted(true);
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-gray-900 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>
      <p className="mb-4 text-center">We'd love to hear from you! Reach out with your questions, feedback, or partnership inquiries.</p>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1 font-semibold" htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold" htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full px-8 py-3 text-lg font-semibold rounded-full bg-blue-600 hover:bg-blue-700 transition-all text-white shadow-lg"
        >
          Send Message
        </button>
        {error && (
          <p className="text-red-600 text-center mt-2">{error}</p>
        )}
        {submitted && (
          <p className="text-green-600 text-center mt-2">Thank you for contacting us! We'll get back to you soon.</p>
        )}
      </form>
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">Contact Details</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Email: <a href="mailto:help@medgloss.com" className="text-blue-600 underline">help@medgloss.com</a></li>
          <li>Phone: <a href="tel:+919896887732" className="text-blue-600 underline">+91 98968 87732</a></li>
        </ul>
        <h2 className="text-xl font-semibold mb-2">Connect With Us</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Twitter: <a href="https://x.com/medgloss" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">@medgloss</a></li>
          <li>Instagram: <a href="https://www.instagram.com/medgloss_official/" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">@medgloss_official</a></li>
          <li>LinkedIn: <a href="https://www.linkedin.com/company/medgloss" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">MedGloss</a></li>
        </ul>
      </div>
      <p className="mt-8 text-center text-gray-500 text-sm">© {new Date().getFullYear()} MedGloss. All rights reserved.</p>
    </div>
  );
} 