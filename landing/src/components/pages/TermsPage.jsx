import { motion } from "framer-motion";

export default function TermsPage({ setCurrentPage }) {
  const sections = [
    {
      title: "Acceptance of Terms",
      content: "By accessing or using Paraline, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use the software."
    },
    {
      title: "Open Source Notice",
      content: "Paraline is an open-source project. While the source code is available under the MIT License, your use of the software hosted or distributed by us is still subject to these terms. Please refer to the LICENSE file in the repository for specific code-level permissions."
    },
    {
      title: "Usage Disclaimer",
      content: "Paraline is provided 'as is' for visual enhancement purposes. You are responsible for ensuring that your use of the software complies with all local laws and regulations. We do not guarantee compatibility with all hardware configurations or Windows versions."
    },
    {
      title: "No Warranty / Liability",
      content: "Paraline is provided without warranty of any kind, express or implied. In no event shall the authors or copyright holders be liable for any claim, damages, or other liability, whether in an action of contract, tort, or otherwise, arising from, out of, or in connection with the software or the use or other dealings in the software."
    },
    {
      title: "External Links",
      content: "Our website and application may contain links to external sites (such as GitHub). We have no control over the content or practices of these sites and cannot be held responsible for their privacy policies or terms of service."
    },
    {
      title: "Software Modifications",
      content: "We reserve the right to modify, suspend, or discontinue Paraline at any time without notice. We are not liable to you or any third party for any modification, price change, suspension, or discontinuance of the service."
    },
    {
      title: "Future Changes to Terms",
      content: "We may update our Terms and Conditions from time to time. You are advised to review this page periodically for any changes. Changes to these Terms and Conditions are effective when they are posted on this page."
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center px-4 py-24 md:py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-3xl relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] tracking-[0.2em] uppercase font-bold text-white/60 mb-6"
          >
            Legal Information
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent mb-6">
            Terms & Conditions
          </h1>
          <p className="text-sm md:text-base text-white/40 max-w-xl mx-auto leading-relaxed">
            Please read these terms carefully before using the Paraline visualizer.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.05, duration: 0.5 }}
              className="p-8 rounded-2xl border border-white/[0.06] bg-[#050816]/40 backdrop-blur-xl hover:border-white/[0.1] transition-colors group"
            >
              <h2 className="text-lg font-semibold text-white/90 mb-3 flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 group-hover:bg-cyan-400 transition-colors" />
                {section.title}
              </h2>
              <p className="text-sm md:text-base text-white/50 leading-relaxed font-light">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Footer Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <button
            onClick={() => {
                setCurrentPage("home");
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/5 text-xs tracking-widest uppercase font-bold text-white/70 hover:bg-white/10 hover:text-white transition-all group"
          >
            <svg 
              className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </motion.div>

        <div className="mt-24 text-center text-[10px] tracking-[0.2em] uppercase text-white/20">
          Last Updated: May 19, 2026
        </div>
      </motion.div>
    </div>
  );
}
