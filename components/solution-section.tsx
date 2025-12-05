import { Card } from "@/components/ui/card"

export function SolutionSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#8c52ff] via-[#6d2be3] to-[#2c1b69] text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Subly Solution</h2>
          <p className="text-xl max-w-3xl mx-auto text-balance leading-relaxed opacity-90">
            Turn DeFi yield into monthly cash payouts. You deposit once, and Subly earns yield for you.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-12 items-stretch">
            <Card className="p-6 bg-white/10 backdrop-blur border-white/20 text-center flex flex-col">
              <div className="mb-4 flex justify-center h-20 items-center">
                <img
                  src="/deposit-icon.png"
                  alt="Deposit icon showing hand with dollar sign and upload arrow"
                  className="w-20 h-20"
                />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Deposit Once</h3>
              <p className="text-white/80 leading-relaxed flex-grow">
                Make a single deposit in USDC and let Subly handle the rest
              </p>
            </Card>

            <Card className="p-6 bg-white/10 backdrop-blur border-white/20 text-center flex flex-col">
              <div className="mb-4 flex justify-center h-20 items-center">
                <img
                  src="/earn-yield-icon.png"
                  alt="Earn yield icon showing bar chart with upward arrow and dollar sign"
                  className="w-20 h-20"
                />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Earn Yield</h3>
              <p className="text-white/80 leading-relaxed flex-grow">
                Your funds automatically earn yield through secure DeFi protocols
              </p>
            </Card>

            <Card className="p-6 bg-white/10 backdrop-blur border-white/20 text-center flex flex-col">
              <div className="mb-4 flex justify-center items-center gap-4 h-20">
                <img src="/paypal-symbol.svg" alt="PayPal symbol" className="w-16 h-16 object-contain" />
                <img src="/usdc-logo.svg" alt="USDC logo" className="w-16 h-16 object-contain" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Auto-Pay</h3>
              <p className="text-white/80 leading-relaxed flex-grow">
                Yield goes to your PayPal or paid directly in USDC to cover your subscriptions
              </p>
            </Card>
          </div>

          <Card className="p-8 bg-white/10 backdrop-blur border-white/20">
            <div className="flex justify-center mb-8">
              <img
                src="/apy-diagram.png"
                alt="APY 10% diagram showing Aug to Sep timeline with subscription service icons"
                className="max-w-full h-auto"
              />
            </div>

            <div className="text-center">
              <p className="text-lg text-white/80">Your yield covers your subscriptions, so you don't have to pay</p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
