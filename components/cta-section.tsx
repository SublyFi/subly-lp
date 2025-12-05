import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#8c52ff] via-[#6d2be3] to-[#2c1b69] text-white">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto p-12 bg-white/10 backdrop-blur border-white/20 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance text-white">
            Ready to Never Pay for Subscriptions Again?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto text-balance leading-relaxed">
            Join the future of subscription payments. Deposit once, earn yield,
            and let Subly handle the rest.
          </p>

          <div className="flex justify-center">
            {/* <Button size="lg" className="bg-white text-[#8c52ff] hover:bg-gray-100 text-lg px-8 py-4">
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
          <div className="flex flex-col items-center gap-6">
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 text-white border-white/30 hover:bg-white/20 text-lg px-8 py-4"
              asChild
            >
              <a
                href="https://demo.sublyfi.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Try Demo Site →
              </a>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
