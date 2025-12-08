
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30">
            <Navbar />

            <main className="container mx-auto px-4 pt-32 pb-20 max-w-4xl">
                <div className="space-y-4 mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Terms of Service</h1>
                    <p className="text-zinc-500">Last updated: December 7, 2025</p>
                </div>

                <div className="prose prose-invert prose-zinc max-w-none prose-headings:font-semibold prose-a:text-white prose-a:no-underline hover:prose-a:underline">
                    <p className="text-lg text-zinc-300 leading-relaxed">
                        Welcome to thesolopreneur.app. By using our website and services, you agree to these Terms of Service. Please read them carefully.
                    </p>

                    <hr className="border-zinc-800 my-12" />

                    <h3>1. Acceptance of Terms</h3>
                    <p>
                        By accessing or using our services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, do not use our services.
                    </p>

                    <h3>2. Description of Service</h3>
                    <p>
                        thesolopreneur.app provides a CRM and automation platform for solopreneurs. We grant you a limited, non-exclusive, non-transferable, and revocable license to use our services subject to these Terms.
                    </p>

                    <h3>3. User Accounts</h3>
                    <p>
                        You are responsible for maintaining the security of your account and password. You agree to notify us immediately of any unauthorized use of your account. We reserve the right to close accounts that violate these Terms.
                    </p>

                    <h3>4. Acceptable Use</h3>
                    <p>
                        You agree not to misuse our services. This includes not using our platform for illegal activities, spamming, distributing malware, or attempting to compromise our security.
                    </p>

                    <h3>5. Subscription and Payment</h3>
                    <p>
                        Some parts of our services are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis. You may cancel your subscription at any time, but refunds are provided at our sole discretion.
                    </p>

                    <h3>6. Intellectual Property</h3>
                    <p>
                        The service and its original content, features, and functionality are and will remain the exclusive property of thesolopreneur.app and its licensors.
                    </p>

                    <h3>7. Limitation of Liability</h3>
                    <p>
                        In no event shall thesolopreneur.app, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                    </p>

                    <h3>8. Governing Law</h3>
                    <p>
                        These Terms shall be governed and construed in accordance with the laws of Delaware, United States, without regard to its conflict of law provisions.
                    </p>

                    <h3>9. Changes to Terms</h3>
                    <p>
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    )
}
