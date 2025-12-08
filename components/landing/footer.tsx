import Link from "next/link"
import Image from "next/image"
import { Twitter, Linkedin, Github } from "lucide-react"

const footerLinks = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "AI Agents", href: "/#ai-agents" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Templates", href: "/templates" },
    { label: "Integrations", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "/api-reference" },
    { label: "Community", href: "#" },
    { label: "Support", href: "#" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Security", href: "/security" },
  ],
}

export function Footer() {
  return (
    <footer className="py-16 px-6 bg-[#0a0a0a] border-t border-neutral-800">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-16">
          {/* Logo column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <Image
                src="/SOLO-logo.png"
                alt="thesolopreneur.app"
                width={28}
                height={28}
                className="transition-transform group-hover:scale-105"
              />
              <span className="text-sm font-medium tracking-tight">
                thesolopreneur<span className="text-[#BFFF00]">.app</span>
              </span>
            </Link>
            <p className="text-sm text-neutral-500 max-w-xs leading-relaxed mb-6">
              The CRM platform built for solopreneurs, freelancers, and micro agencies.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="text-neutral-500 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="text-neutral-500 hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="text-neutral-500 hover:text-white transition-colors">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-medium mb-4 text-neutral-400 uppercase tracking-wider">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-neutral-500 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-neutral-600">© 2025 thesolopreneur.app. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-neutral-700 font-mono">Made for rebels. Built with obsession.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
