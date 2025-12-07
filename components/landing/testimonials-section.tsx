import { Quote } from "lucide-react"

const testimonials = [
  {
    quote: "Switched from GoHighLevel and never looked back. The AI agents alone are worth 10x the price.",
    author: "Sarah Chen",
    role: "Founder, GrowthLab",
    color: "#BFFF00",
  },
  {
    quote: "Finally, a CRM that doesn't feel like enterprise bloatware. My team was onboarded in 20 minutes.",
    author: "Marcus Webb",
    role: "Agency Owner",
    color: "#00FFFF",
  },
  {
    quote: "The SDR agent found us 200 qualified leads in the first week. Insane ROI.",
    author: "Priya Patel",
    role: "Solo Consultant",
    color: "#FF6B6B",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-32 px-6 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <span className="text-xs font-mono text-[#FF6B6B] tracking-wider uppercase">Testimonials</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 tracking-tight">Real people. Real results.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({
  quote,
  author,
  role,
  color,
}: {
  quote: string
  author: string
  role: string
  color: string
}) {
  return (
    <div className="border border-neutral-800 bg-neutral-900/30 p-8 hover:border-neutral-700 transition-all duration-300 group">
      {/* Quote icon */}
      <div className="mb-4">
        <Quote className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" style={{ color }} />
      </div>

      {/* Quote */}
      <p className="text-base leading-relaxed mb-8 text-neutral-300">{quote}</p>

      {/* Author */}
      <div className="pt-4 border-t border-neutral-800">
        <div className="font-medium text-sm">{author}</div>
        <div className="text-xs text-neutral-500">{role}</div>
      </div>
    </div>
  )
}
