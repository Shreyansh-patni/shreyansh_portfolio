"use client";

import React from "react";

export function ContactForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" aria-label="Contact form">
      {/* Name Input */}
      <div>
        <label
          htmlFor="contact-name"
          className="block text-[13px] font-medium text-foreground mb-1.5"
        >
          Name <span className="text-red-500/80">*</span>
        </label>
        <input
          type="text"
          id="contact-name"
          name="name"
          required
          placeholder="Your name"
          className="w-full px-3.5 py-2.5 rounded-lg bg-surface/50 border border-border/80 text-foreground text-[14px] placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-2 focus:ring-foreground/20 focus:border-border/90 transition-colors"
        />
      </div>

      {/* Email Input */}
      <div>
        <label
          htmlFor="contact-email"
          className="block text-[13px] font-medium text-foreground mb-1.5"
        >
          Email <span className="text-red-500/80">*</span>
        </label>
        <input
          type="email"
          id="contact-email"
          name="email"
          required
          placeholder="your.email@example.com"
          className="w-full px-3.5 py-2.5 rounded-lg bg-surface/50 border border-border/80 text-foreground text-[14px] placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-2 focus:ring-foreground/20 focus:border-border/90 transition-colors"
        />
      </div>

      {/* Topic Select */}
      <div>
        <label
          htmlFor="contact-topic"
          className="block text-[13px] font-medium text-foreground mb-1.5"
        >
          What are you reaching out about?{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <select
          id="contact-topic"
          name="topic"
          defaultValue=""
          className="w-full px-3.5 py-2.5 rounded-lg bg-surface/50 border border-border/80 text-foreground text-[14px] focus:outline-hidden focus:ring-2 focus:ring-foreground/20 focus:border-border/90 transition-colors"
        >
          <option value="" disabled>
            Select a topic...
          </option>
          <option value="Project / Software">Project / Software</option>
          <option value="Agency / Sahaya">Agency / Sahaya</option>
          <option value="Collaboration">Collaboration</option>
          <option value="Startup / Founder">Startup / Founder</option>
          <option value="General">General</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Message Textarea */}
      <div>
        <label
          htmlFor="contact-message"
          className="block text-[13px] font-medium text-foreground mb-1.5"
        >
          Message <span className="text-red-500/80">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="Tell me about your project, idea, or inquiry..."
          className="w-full px-3.5 py-2.5 rounded-lg bg-surface/50 border border-border/80 text-foreground text-[14px] placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-2 focus:ring-foreground/20 focus:border-border/90 transition-colors min-h-[130px] resize-y"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled
          aria-disabled="true"
          className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-surface border border-border/80 text-muted-foreground text-[13.5px] font-medium cursor-not-allowed opacity-75 inline-flex items-center justify-center gap-2"
        >
          <span>Send message</span>
          <svg
            className="w-3.5 h-3.5 stroke-current fill-none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M5 12h14M12 5l7 7-7 7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <p className="mt-2.5 text-[12px] text-muted-foreground/70">
          Form submissions are currently disabled. You can email me directly at{" "}
          <a
            href="mailto:Shreyansh@sahaya.tech"
            className="text-foreground underline hover:text-accent transition-colors font-mono"
          >
            Shreyansh@sahaya.tech
          </a>
          .
        </p>
      </div>
    </form>
  );
}
