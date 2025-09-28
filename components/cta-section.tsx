import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-teal-500 to-teal-600 text-white">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto p-12 bg-white/10 backdrop-blur border-white/20 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance text-white">
            Ready to Never Pay for Subscriptions Again?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto text-balance leading-relaxed">
            Join the future of subscription payments. Deposit once, earn yield,
            and let Subly handle the rest.
          </p>

          <div className="flex justify-center mb-8">
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
        </Card>
      </div>
    </section>
  );
}
