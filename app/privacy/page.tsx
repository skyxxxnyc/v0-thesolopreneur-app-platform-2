
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30">
            <Navbar />

            <main className="container mx-auto px-4 pt-32 pb-20 max-w-4xl">
                <div className="space-y-4 mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Privacy Policy</h1>
                    <p className="text-zinc-500">Last updated: December 7, 2025</p>
                </div>

                <div className="prose prose-invert prose-zinc max-w-none prose-headings:font-semibold prose-a:text-white prose-a:no-underline hover:prose-a:underline">
                    <p className="text-lg text-zinc-300 leading-relaxed">
                        At thesolopreneur.app, we take your privacy seriously. We believe your business data belongs to you. This policy outlines how we collect, use, and protect your personal and business information.
                    </p>

                    <hr className="border-zinc-800 my-12" />

                    <h3>1. Information We Collect</h3>
                    <p>
                        We collect information you provide directly to us, such as when you create an account, update your profile, or use our services. This may include:
                    </p>
                    <ul>
                        <li><strong>Account Information:</strong> Name, email, password, and payment details.</li>
                        <li><strong>Business Data:</strong> Information about your leads, deals, contacts, and automations stored within our platform.</li>
                        <li><strong>Usage Data:</strong> How you interact with our services, including features used and time spent.</li>
                    </ul>

                    <h3>2. How We Use Your Information</h3>
                    <p>
                        We use the information we collect to:
                    </p>
                    <ul>
                        <li>Provide, maintain, and improve our services.</li>
                        <li>Process transactions and send related information.</li>
                        <li>Send you technical notices, updates, security alerts, and support messages.</li>
                        <li>Respond to your comments, questions, and requests.</li>
                    </ul>

                    <h3>3. Data Ownership & AI</h3>
                    <p>
                        Your data is yours. We do not use your private business data (leads, deal specifics, proprietary workflows) to train our public AI models without your explicit consent. Our AI features process your data to provide you with insights and automation, but this processing is contained and secure.
                    </p>

                    <h3>4. Data Security</h3>
                    <p>
                        We use industry-standard security measures to protect your information. This includes encryption in transit and at rest, access controls, and regular security audits. However, no method of transmission over the internet or method of electronic storage is 100% secure.
                    </p>

                    <h3>5. Third-Party Services</h3>
                    <p>
                        We may share information with third-party vendors, consultants, and other service providers who need access to such information to carry out work on our behalf. These third parties are bound by confidentiality agreements and are prohibited from using your personal information for any other purpose.
                    </p>

                    <h3>6. Your Rights</h3>
                    <p>
                        Depending on your location, you may have rights regarding your personal information, such as the right to access, correct, or delete your data. Contact us at <a href="mailto:privacy@thesolopreneur.app">privacy@thesolopreneur.app</a> to exercise these rights.
                    </p>

                    <h3>7. Changes to this Policy</h3>
                    <p>
                        We may change this privacy policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy and, in some cases, providing you with additional notice.
                    </p>

                </div>
            </main>
            <Footer />
        </div>
    )
}
