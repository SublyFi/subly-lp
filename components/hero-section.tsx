import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full border border-white/20" />
        <div className="absolute top-40 right-32 w-24 h-24 rounded-full border border-white/20" />
        <div className="absolute bottom-32 left-1/4 w-40 h-40 rounded-full border border-white/20" />
        <div className="absolute bottom-20 right-20 w-28 h-28 rounded-full border border-white/20" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="mb-12">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 text-balance tracking-tight">
            Subscribe Now,
          </h1>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-balance tracking-tight text-cyan-200">
            Pay Never
          </h1>
        </div>

        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-balance leading-relaxed">
          A privacy‑first PayFi protocol for subscription apps. Subly turns
          yield into cash and pays it to your PayPal or directly in USDC to
          cover subscriptions.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100 text-lg px-8 py-4">
            Join Waitlist
          </Button> */}
          <div
            id="getWaitlistContainer"
            data-waitlist_id="31247"
            data-widget_type="WIDGET_2"
            className="justify-center"
          ></div>
          <link
            rel="stylesheet"
            type="text/css"
            href="https://prod-waitlist-widget.s3.us-east-2.amazonaws.com/getwaitlist.min.css"
          />
          <script src="https://prod-waitlist-widget.s3.us-east-2.amazonaws.com/getwaitlist.min.js"></script>
        </div>
      </div>
    </section>
  );
}
