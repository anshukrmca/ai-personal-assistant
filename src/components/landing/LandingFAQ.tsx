"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

export function LandingFAQ() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How does Anshu AI connect to my Gmail and Calendar?",
      a: "We integrate securely using OAuth 2.0. The assistant only reads email notifications and calendar slots required to answer your commands. We prioritize your privacy and never sell or train public models on your private data."
    },
    {
      q: "Does it execute tasks automatically on its own?",
      a: "By default, Anshu AI operates in a 'Human-in-the-loop' safety mode. High-priority actions, such as sending emails or deleting events, generate dynamic execution cards in your dashboard, waiting for your approval. You can toggle fully autonomous modes for trusted senders."
    },
    {
      q: "What messaging integrations are supported?",
      a: "Currently, we offer pre-built integrations for Gmail, Google Calendar, WhatsApp, and Slack. Outlook, Discord, Telegram, and LinkedIn integration are launching soon."
    },
    {
      q: "Can I use my own custom phone number?",
      a: "Yes, you can configure WhatsApp delivery channels to forward briefings and execute assistant commands directly using standard chat commands."
    }
  ];

  return (
    <section id="faq" className="py-20 md:py-28 border-t border-slate-200 dark:border-white/[0.05] max-w-4xl mx-auto px-4 sm:px-6 transition-colors duration-300">
      
      {/* Header */}
      <div className="text-center mb-16 flex flex-col gap-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-50 dark:bg-violet-500/5 text-violet-600 dark:text-violet-400 text-[12px] font-bold w-fit mx-auto transition-colors duration-300">
          <HelpCircle className="w-3.5 h-3.5" /> Common Questions
        </div>
        <h2 className="font-display font-black text-3xl text-slate-900 dark:text-white leading-tight transition-colors duration-300">
          Frequently Asked Questions
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-[15px] transition-colors duration-300">
          Everything you need to know about setting up and safety of your assistant.
        </p>
      </div>

      {/* FAQs */}
      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = activeFaq === idx;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-2xl overflow-hidden hover:border-slate-300 dark:hover:border-white/[0.08] transition-colors shadow-sm dark:shadow-none"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-5 text-left flex justify-between items-center text-slate-900 dark:text-white font-bold text-[15px] sm:text-[16px] cursor-pointer transition-colors duration-300"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-violet-600 dark:text-violet-400' : ''}`} />
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen ? 'max-h-40 border-t border-slate-100 dark:border-white/[0.03]' : 'max-h-0'
                }`}
              >
                <p className="px-6 py-5 text-slate-600 dark:text-slate-400 text-[13.5px] leading-relaxed transition-colors duration-300">
                  {faq.a}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
