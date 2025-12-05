export function PrivacySection() {
  return (
    <section className="py-20 bg-[#f1eaff]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#1d0f3b] text-balance">
            Privacy-First by Design
          </h2>
          <p className="text-xl text-[#564779] max-w-3xl mx-auto text-balance leading-relaxed mb-12">
            Your on-chain data and subscription computations run inside Arcium
            Cerberus MPC, ensuring sensitive logic remains private and isolated.
          </p>
          <div className="flex justify-center">
            <img src="/arcium-logo.svg" alt="Arcium" className="h-12 md:h-16" />
          </div>
        </div>
      </div>
    </section>
  );
}
