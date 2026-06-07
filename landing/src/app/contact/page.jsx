"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setStatus("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("✅ Message submitted successfully!");

        setForm({
          name: "",
          email: "",
          subject: "",
          message: "",
        });

        setTimeout(() => {
          setStatus("");
        }, 3000);
      } else {
        setStatus(`❌ ${data.error || "Failed to submit message."}`);

        setTimeout(() => {
          setStatus("");
        }, 3000);
      }
    } catch (error) {
      console.error(error);

      setStatus("❌ Something went wrong. Please try again.");

      setTimeout(() => {
        setStatus("");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-5xl font-bold mb-4 text-white">
          Contact Us
        </h1>

        <p className="text-lg text-gray-400">
          Need help with Paraline? Reach out to us for support,
          feedback, bug reports, or feature requests.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm p-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Send a Message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-4 rounded-xl bg-black/30 border border-white/10 text-white outline-none"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-4 rounded-xl bg-black/30 border border-white/10 text-white outline-none"
            />

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-black/30 border border-white/10 text-white outline-none"
            />

            <textarea
              name="message"
              rows="6"
              placeholder="Message"
              value={form.message}
              onChange={handleChange}
              required
              className="w-full p-4 rounded-xl bg-black/30 border border-white/10 text-white outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-4 rounded-xl transition"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

            {status && (
              <div
                className={`mt-4 p-4 rounded-xl border ${
                  status.includes("✅")
                    ? "bg-green-500/10 border-green-500 text-green-400"
                    : "bg-red-500/10 border-red-500 text-red-400"
                }`}
              >
                {status}
              </div>
            )}
          </form>
        </div>

        {/* Contact Info */}
        <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm p-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Get in Touch
          </h2>

          <div className="space-y-6 text-gray-300 text-lg">
            <p>📧 support@paraline.app</p>

            <p>
              🐙 GitHub Repository
            </p>

            <p>
              💡 Found a bug? Have an idea? We'd love to hear from you.
            </p>

            <p>
              🚀 Our team typically responds within 24–48 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}