
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Search, Filter, ArrowRight, Layout, Workflow, Mail, Globe, Download, Star } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Mock Data for Templates
const categories = ["All", "Funnels", "Automations", "Email Campaigns", "Websites"]

const templates = [
    {
        id: 1,
        title: "SaaS Launch Funnel",
        category: "Funnels",
        description: "High-conversion funnel optimized for SaaS product launches. Includes waitlist, VSL, and checkout steps.",
        downloads: "2.4k",
        rating: 4.9,
        image: "/placeholder?height=400&width=600",
        isNew: true,
    },
    {
        id: 2,
        title: "Lead Magnet Funnel",
        category: "Funnels",
        description: "Generate qualified leads with a compelling opt-in, thank you page, and automated email sequence.",
        downloads: "3.8k",
        rating: 4.8,
        image: "/placeholder?height=400&width=600",
        isNew: false,
    },
    {
        id: 3,
        title: "Product Launch Funnel",
        category: "Funnels",
        description: "Multi-step launch sequence with pre-launch buzz, cart open, and scarcity-driven close pages.",
        downloads: "2.1k",
        rating: 4.7,
        image: "/placeholder?height=400&width=600",
        isNew: true,
    },
    {
        id: 4,
        title: "Webinar Registration Funnel",
        category: "Funnels",
        description: "Complete webinar funnel with registration page, email reminders, and replay page templates.",
        downloads: "1.5k",
        rating: 4.6,
        image: "/placeholder?height=400&width=600",
        isNew: false,
    },
    {
        id: 5,
        title: "Free Trial Signup Funnel",
        category: "Funnels",
        description: "Convert visitors into trial users with optimized signup flow, onboarding emails, and upgrade prompts.",
        downloads: "2.9k",
        rating: 4.9,
        image: "/placeholder?height=400&width=600",
        isNew: true,
    },
    {
        id: 6,
        title: "Consultation Booking Funnel",
        category: "Funnels",
        description: "Pre-qualify prospects and book high-value consultations with application form and calendar integration.",
        downloads: "2.2k",
        rating: 4.8,
        image: "/placeholder?height=400&width=600",
        isNew: false,
    },
    {
        id: 7,
        title: "Course Sales Funnel",
        category: "Funnels",
        description: "Sell online courses with video sales letter, curriculum preview, testimonials, and payment pages.",
        downloads: "1.9k",
        rating: 4.7,
        image: "/placeholder?height=400&width=600",
        isNew: false,
    },
    {
        id: 8,
        title: "Tripwire Funnel",
        category: "Funnels",
        description: "Convert cold traffic with irresistible low-ticket offer, then upsell to core products.",
        downloads: "1.6k",
        rating: 4.6,
        image: "/placeholder?height=400&width=600",
        isNew: false,
    },
    {
        id: 9,
        title: "Application Funnel",
        category: "Funnels",
        description: "High-ticket sales funnel with detailed application form, automated screening, and booking system.",
        downloads: "1.4k",
        rating: 4.9,
        image: "/placeholder?height=400&width=600",
        isNew: true,
    },
    {
        id: 10,
        title: "Summit Registration Funnel",
        category: "Funnels",
        description: "Multi-day event funnel with speaker lineup, session schedule, and all-access pass upsell.",
        downloads: "980",
        rating: 4.5,
        image: "/placeholder?height=400&width=600",
        isNew: false,
    },
    {
        id: 11,
        title: "Membership Signup Funnel",
        category: "Funnels",
        description: "Recurring revenue funnel with membership tiers, preview content, and payment plan options.",
        downloads: "2.3k",
        rating: 4.8,
        image: "/placeholder?height=400&width=600",
        isNew: false,
    },
    {
        id: 12,
        title: "Quiz Funnel",
        category: "Funnels",
        description: "Interactive quiz that segments leads, delivers personalized results, and recommends products.",
        downloads: "3.1k",
        rating: 4.9,
        image: "/placeholder?height=400&width=600",
        isNew: true,
    },
    {
        id: 13,
        title: "Challenge Funnel",
        category: "Funnels",
        description: "5-7 day challenge funnel with daily lessons, community access, and paid upgrade offer.",
        downloads: "1.7k",
        rating: 4.7,
        image: "/placeholder?height=400&width=600",
        isNew: false,
    },
    {
        id: 14,
        title: "Workshop Registration Funnel",
        category: "Funnels",
        description: "Live workshop funnel with early bird pricing, workshop materials, and post-event offer.",
        downloads: "1.3k",
        rating: 4.6,
        image: "/placeholder?height=400&width=600",
        isNew: false,
    },
    {
        id: 15,
        title: "E-commerce Product Funnel",
        category: "Funnels",
        description: "Physical product sales funnel with product showcase, reviews, cart abandonment recovery.",
        downloads: "2.6k",
        rating: 4.8,
        image: "/placeholder?height=400&width=600",
        isNew: false,
    },
    {
        id: 16,
        title: "Book Launch Funnel",
        category: "Funnels",
        description: "Author funnel with book preview, reader testimonials, bonus packages, and multiple formats.",
        downloads: "1.2k",
        rating: 4.5,
        image: "/placeholder?height=400&width=600",
        isNew: false,
    },
    {
        id: 17,
        title: "Affiliate Partner Funnel",
        category: "Funnels",
        description: "Recruit and onboard affiliates with application, training materials, and commission dashboard.",
        downloads: "890",
        rating: 4.7,
        image: "/placeholder?height=400&width=600",
        isNew: true,
    },
    {
        id: 18,
        title: "Local Service Funnel",
        category: "Funnels",
        description: "Service-based business funnel with instant quote calculator, service areas map, and booking.",
        downloads: "2.8k",
        rating: 4.9,
        image: "/placeholder?height=400&width=600",
        isNew: false,
    },
    {
        id: 19,
        title: "Downsell Funnel",
        category: "Funnels",
        description: "Recover cart abandonment with strategic downsell offer at lower price point or payment plan.",
        downloads: "1.5k",
        rating: 4.6,
        image: "/placeholder?height=400&width=600",
        isNew: false,
    },
    {
        id: 20,
        title: "Event Ticket Funnel",
        category: "Funnels",
        description: "In-person event funnel with venue info, speaker bios, VIP ticket tiers, and hotel recommendations.",
        downloads: "1.1k",
        rating: 4.8,
        image: "/placeholder?height=400&width=600",
        isNew: true,
    },
    {
        id: 21,
        title: "Agency Client Onboarding",
        category: "Automations",
        description: "Automate your entire client onboarding process from contract signing to project kick-off.",
        downloads: "1.8k",
        rating: 4.8,
        image: "/placeholder?height=400&width=600",
        isNew: false,
    },
    {
        id: 22,
        title: "Cold Outreach Sequence",
        category: "Email Campaigns",
        description: "Battle-tested 5-step email sequence for B2B lead generation. Perfect for agencies and consultants.",
        downloads: "3.2k",
        rating: 4.7,
        image: "/placeholder?height=400&width=600",
        isNew: false,
    },
    {
        id: 23,
        title: "Consultant Portfolio",
        category: "Websites",
        description: "Minimalist, high-impact portfolio template designed to showcase case studies and book calls.",
        downloads: "950",
        rating: 4.9,
        image: "/placeholder?height=400&width=600",
        isNew: false,
    },
    {
        id: 24,
        title: "Review Generation Workflow",
        category: "Automations",
        description: "Automatically request and filter reviews from happy clients to boost your Google My Business ranking.",
        downloads: "1.1k",
        rating: 4.8,
        image: "/placeholder?height=400&width=600",
        isNew: false,
    },
]

export default function TemplatesPage() {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4">
                <div className="container mx-auto max-w-7xl text-center space-y-6">
                    <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-sm text-zinc-400 mb-4">
                        <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                        Library Updated Weekly
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-white via-white to-zinc-500 bg-clip-text text-transparent">
                        Jumpstart your success.
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                        Don't start from scratch. Use our battle-tested templates for funnels, automations, and websites to launch faster.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mt-10 relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl transition-opacity opacity-50 group-hover:opacity-100"></div>
                        <div className="relative flex items-center bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-full px-6 py-4 shadow-2xl transition-all focus-within:border-zinc-700 focus-within:ring-1 focus-within:ring-zinc-700">
                            <Search className="h-5 w-5 text-zinc-500 mr-4" />
                            <input
                                type="text"
                                placeholder="Search for 'webinar funnel', 'onboarding'..."
                                className="w-full bg-transparent border-none focus:outline-none text-white placeholder-zinc-500 text-lg"
                            />
                            <div className="hidden md:flex text-xs text-zinc-500 border border-zinc-800 rounded px-2 py-1">⌘K</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="container mx-auto px-4 pb-24 max-w-7xl">

                {/* Categories */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {categories.map((cat, i) => (
                            <button
                                key={cat}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${i === 0
                                        ? "bg-white text-black hover:bg-zinc-200"
                                        : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <button className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                        <Filter className="h-4 w-4" /> Filter Results
                    </button>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {templates.map((template) => (
                        <div key={template.id} className="group relative bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all hover:shadow-2xl hover:shadow-purple-500/5 flex flex-col h-full">
                            {/* Image Placeholder */}
                            <div className="aspect-video bg-zinc-800 relative overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center text-zinc-700 font-mono text-xs uppercase tracking-widest bg-zinc-900">
                                    {template.category} Preview
                                </div>
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-[2px]">
                                    <Button variant="secondary" size="sm" className="font-semibold">Preview</Button>
                                    <Button size="sm">use this template</Button>
                                </div>
                                {template.isNew && (
                                    <Badge variant="default" className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-700 text-white border-none">NEW</Badge>
                                )}
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">{template.title}</h3>
                                        <p className="text-sm text-zinc-500">{template.category}</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs font-medium text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">
                                        <Star className="h-3 w-3 fill-current" /> {template.rating}
                                    </div>
                                </div>

                                <p className="text-sm text-zinc-400 leading-relaxed mb-6 flex-grow">
                                    {template.description}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                                    <div className="flex items-center text-xs text-zinc-500">
                                        <Download className="h-3 w-3 mr-1.5" /> {template.downloads} installs
                                    </div>
                                    <Link href="#" className="text-sm font-medium text-white flex items-center hover:opacity-70 transition-opacity">
                                        Details <ArrowRight className="ml-1 h-3 w-3" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="mt-24 rounded-3xl bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 bg-purple-500/10 blur-3xl rounded-full pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>

                    <h2 className="text-3xl font-bold mb-4 relative z-10">Can't find what you need?</h2>
                    <p className="text-zinc-400 max-w-lg mx-auto mb-8 relative z-10">
                        Our team of expert designers and automators can build custom templates for your specific use case.
                    </p>
                    <Button variant="outline" className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800 hover:text-white relative z-10">
                        Request a Template
                    </Button>
                </div>

            </main>
            <Footer />
        </div>
    )
}
