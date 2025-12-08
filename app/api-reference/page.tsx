
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { ArrowRight, Lock, Terminal, Zap, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function ApiReferencePage() {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30">
            <Navbar />

            <main className="container mx-auto px-4 pt-32 pb-20 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Sidebar Navigation */}
                    <aside className="lg:col-span-1 hidden lg:block sticky top-32 h-[calc(100vh-8rem)] overflow-y-auto pr-6">
                        <nav className="space-y-8">
                            <div>
                                <h5 className="font-mono text-xs uppercase tracking-wider text-zinc-500 mb-4 font-semibold">Getting Started</h5>
                                <ul className="space-y-2 border-l border-zinc-800 ml-1">
                                    <li><Link href="#introduction" className="block pl-4 py-1 text-sm text-zinc-300 hover:text-white hover:border-l hover:border-white -ml-px transition-colors border-l border-transparent">Introduction</Link></li>
                                    <li><Link href="#authentication" className="block pl-4 py-1 text-sm text-zinc-400 hover:text-white hover:border-l hover:border-white -ml-px transition-colors border-l border-transparent">Authentication</Link></li>
                                    <li><Link href="#errors" className="block pl-4 py-1 text-sm text-zinc-400 hover:text-white hover:border-l hover:border-white -ml-px transition-colors border-l border-transparent">Errors</Link></li>
                                </ul>
                            </div>

                            <div>
                                <h5 className="font-mono text-xs uppercase tracking-wider text-zinc-500 mb-4 font-semibold">Resources</h5>
                                <ul className="space-y-2 border-l border-zinc-800 ml-1">
                                    <li><Link href="#contacts" className="block pl-4 py-1 text-sm text-zinc-400 hover:text-white hover:border-l hover:border-white -ml-px transition-colors border-l border-transparent">Contacts</Link></li>
                                    <li><Link href="#deals" className="block pl-4 py-1 text-sm text-zinc-400 hover:text-white hover:border-l hover:border-white -ml-px transition-colors border-l border-transparent">Deals</Link></li>
                                    <li><Link href="#tasks" className="block pl-4 py-1 text-sm text-zinc-400 hover:text-white hover:border-l hover:border-white -ml-px transition-colors border-l border-transparent">Tasks</Link></li>
                                    <li><Link href="#webhooks" className="block pl-4 py-1 text-sm text-zinc-400 hover:text-white hover:border-l hover:border-white -ml-px transition-colors border-l border-transparent">Webhooks</Link></li>
                                </ul>
                            </div>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-16">

                        {/* Header */}
                        <div className="space-y-6 border-b border-zinc-800 pb-12">
                            <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950/50 px-3 py-1 text-sm text-zinc-400">
                                <Terminal className="mr-2 h-4 w-4" />
                                <span>v1.0.2</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
                                API Reference
                            </h1>
                            <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed">
                                Build powerful integrations with thesolopreneur.app. Our REST API is designed to be predictable, resource-oriented, and easy to use.
                            </p>
                            <div className="flex gap-4 pt-4">
                                <button className="bg-white text-black px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-zinc-200 transition-colors flex items-center">
                                    Get API Key <ArrowRight className="ml-2 h-4 w-4" />
                                </button>
                                <button className="bg-zinc-900 border border-zinc-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors">
                                    View Postman Collection
                                </button>
                            </div>
                        </div>

                        {/* Introduction */}
                        <section id="introduction" className="scroll-mt-32 space-y-6">
                            <h2 className="text-2xl font-semibold">Introduction</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                The API uses standard HTTP verbs and returns JSON encoded responses. Standard HTTP response codes are used to indicate errors.
                            </p>
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                                <h4 className="text-sm font-medium text-zinc-200 mb-2">Base URL</h4>
                                <div className="flex items-center justify-between bg-black rounded-lg p-3 font-mono text-sm text-zinc-400 border border-zinc-800">
                                    <span>https://api.thesolopreneur.app/v1</span>
                                    <button className="text-xs text-zinc-500 hover:text-white transition-colors">COPY</button>
                                </div>
                            </div>
                        </section>

                        {/* Authentication */}
                        <section id="authentication" className="scroll-mt-32 space-y-6">
                            <h2 className="text-2xl font-semibold flex items-center gap-2">
                                <Lock className="h-5 w-5 text-zinc-500" /> Authentication
                            </h2>
                            <p className="text-zinc-400 leading-relaxed">
                                Authenticate your API requests by including your API key in the <code className="text-xs bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-300 font-mono">Authorization</code> header.
                            </p>

                            <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
                                <div className="bg-zinc-900/50 px-4 py-2 border-b border-zinc-800 flex items-center gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                                    </div>
                                    <span className="text-xs text-zinc-500 font-mono ml-2">bash</span>
                                </div>
                                <div className="p-4 overflow-x-auto text-sm font-mono leading-relaxed">
                                    <span className="text-purple-400">curl</span> <span className="text-zinc-300">https://api.thesolopreneur.app/v1/user \</span><br />
                                    <span className="text-zinc-500 ml-4">-H</span> <span className="text-green-400">"Authorization: Bearer YOUR_API_KEY"</span>
                                </div>
                            </div>

                            <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-4 flex gap-3 text-sm text-blue-200/80">
                                <CheckCircle2 className="h-5 w-5 text-blue-400 shrink-0" />
                                <p>Your API keys carry many privileges, so be sure to keep them secure! Do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, and so forth.</p>
                            </div>
                        </section>

                        {/* Rate Limits */}
                        <section id="limits" className="scroll-mt-32 space-y-6">
                            <h2 className="text-2xl font-semibold flex items-center gap-2">
                                <Zap className="h-5 w-5 text-zinc-500" /> Rate Limits
                            </h2>
                            <p className="text-zinc-400 leading-relaxed">
                                To ensure the reliability of the platform, we limit the number of API calls you can make in a given period of time.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-zinc-900/30 border border-zinc-800 p-4 rounded-lg">
                                    <div className="text-sm text-zinc-500 mb-1">Standard</div>
                                    <div className="text-2xl font-mono text-white">100 <span className="text-sm text-zinc-600 font-sans">req/min</span></div>
                                </div>
                                <div className="bg-zinc-900/30 border border-zinc-800 p-4 rounded-lg">
                                    <div className="text-sm text-zinc-500 mb-1">Enterprise</div>
                                    <div className="text-2xl font-mono text-white">1,000 <span className="text-sm text-zinc-600 font-sans">req/min</span></div>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
