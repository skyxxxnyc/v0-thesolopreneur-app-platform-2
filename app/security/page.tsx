
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Shield, Lock, Server, FileKey, Eye, Bug } from "lucide-react"

export default function SecurityPage() {
    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <Navbar />

            <main className="container mx-auto px-4 pt-32 pb-20 max-w-6xl">
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
                    <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-sm text-zinc-400">
                        <Shield className="mr-2 h-4 w-4 text-green-500" />
                        <span>Enterprise-Grade Security</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
                        Security is our foundation.
                    </h1>
                    <p className="text-lg text-zinc-400">
                        We built thesolopreneur.app with a security-first mindset. From encryption to access controls, we protect your data at every layer.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <SecurityCard
                        icon={<Lock className="h-6 w-6 text-blue-400" />}
                        title="Encryption Everywhere"
                        description="All data is encrypted in transit using TLS 1.3 and at rest using AES-256. Your sensitive information is never exposed."
                    />
                    <SecurityCard
                        icon={<Server className="h-6 w-6 text-purple-400" />}
                        title="Secure Infrastructure"
                        description="Hosted on world-class infrastructure providers with SOC 2 Type II compliance. We utilize isolated environments for maximum safety."
                    />
                    <SecurityCard
                        icon={<FileKey className="h-6 w-6 text-yellow-400" />}
                        title="Access Control"
                        description="Strict role-based access control (RBAC) ensures that only authorized personnel have access to critical systems."
                    />
                    <SecurityCard
                        icon={<Eye className="h-6 w-6 text-green-400" />}
                        title="Continuous Monitoring"
                        description="24/7 automated threat detection and monitoring helps us identify and respond to potential security incidents instantly."
                    />
                    <SecurityCard
                        icon={<Bug className="h-6 w-6 text-red-400" />}
                        title="Vulnerability Testing"
                        description="We perform regular penetration testing and code audits to identify and patch vulnerabilities before they can be exploited."
                    />
                    <div className="p-6 rounded-2xl bg-zinc-900/20 border border-zinc-800 flex flex-col justify-center items-center text-center space-y-4">
                        <h3 className="text-xl font-semibold">Report a Vulnerability</h3>
                        <p className="text-zinc-400 text-sm">Found a security issue? Please let our security team know.</p>
                        <a href="mailto:security@thesolopreneur.app" className="text-sm font-medium text-white border-b border-white hover:opacity-80 pb-0.5">Contact Security Team &rarr;</a>
                    </div>
                </div>

                <div className="mt-24 border-t border-zinc-800 pt-16">
                    <h2 className="text-3xl font-bold mb-8 text-center">Compliance & Standards</h2>

                    <div className="flex flex-wrap justify-center gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Mock Certification Logos - In a real app these would be SVGs */}
                        <div className="h-16 w-32 bg-zinc-800/50 rounded flex items-center justify-center text-xs font-mono text-zinc-500">SOC 2 (Ready)</div>
                        <div className="h-16 w-32 bg-zinc-800/50 rounded flex items-center justify-center text-xs font-mono text-zinc-500">GDPR</div>
                        <div className="h-16 w-32 bg-zinc-800/50 rounded flex items-center justify-center text-xs font-mono text-zinc-500">CCPA</div>
                        <div className="h-16 w-32 bg-zinc-800/50 rounded flex items-center justify-center text-xs font-mono text-zinc-500">HIPAA</div>
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    )
}

function SecurityCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-colors group">
            <div className="h-12 w-12 rounded-lg bg-zinc-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-2 text-zinc-100">{title}</h3>
            <p className="text-zinc-400 leading-relaxed text-sm">
                {description}
            </p>
        </div>
    )
}
