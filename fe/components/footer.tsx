"use client"

import { Twitter, MessageCircle, Instagram, Youtube, Github, Heart, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Logo } from "./logo"

const footerLinks = {
  Platform: ["Browse Music", "Pricing", "Artists", "Charts"],
  Artists: ["Submit Music", "Artist Portal", "Royalties", "Promotion"],
  Support: ["Help Center", "Contact", "FAQ", "Community"],
  Legal: ["Privacy", "Terms", "Licenses", "DMCA"],
}

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#030305] pb-24 sm:pb-28 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[300px] bg-[#7B61FF]/5 blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[300px] bg-[#00D9FF]/5 blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-10 sm:mb-12">
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-6 lg:mb-0">
            <Link href="/" className="inline-block mb-4 sm:mb-6">
              <Logo size="md" />
            </Link>
            <p className="text-sm text-white/50 max-w-xs mb-4 sm:mb-6 leading-relaxed">
              The Web3 music platform where artists thrive and fans discover. Powered by Sui blockchain technology.
            </p>
            <div className="flex gap-3 sm:gap-4">
              {[
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Youtube, href: "#", label: "YouTube" },
                { icon: MessageCircle, href: "#", label: "Discord" },
                { icon: Github, href: "https://github.com/KhoaDev0727", label: "GitHub" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={social.label}
                  className="group p-2.5 rounded-xl bg-white/5 text-white/40 hover:text-[#00D9FF] hover:bg-[#00D9FF]/10 transition-all duration-300 hover:scale-110"
                >
                  <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white mb-3 sm:mb-4">{title}</h4>
              <ul className="space-y-2 sm:space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-white/40 hover:text-[#00D9FF] transition-colors duration-300 flex items-center gap-1 group"
                    >
                      {link}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider with gradient */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6 sm:mb-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <p className="text-xs sm:text-sm text-white/40">
              © 2025 KhoaWave. All rights reserved. Built on Sui blockchain.
            </p>
            <p className="text-xs text-white/30 mt-1 flex items-center gap-1 justify-center sm:justify-start">
              Developed with <Heart className="w-3 h-3 text-[#FF006B] inline animate-pulse" /> by{" "}
              <a
                href="https://github.com/KhoaDev0727"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00D9FF] hover:underline font-medium"
              >
                Le Minh Khoa
              </a>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-white/40 bg-white/5 px-3 py-1.5 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              Sui Network Connected
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
