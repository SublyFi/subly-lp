import { Card } from "@/components/ui/card"

export function ProblemSection() {
  const subscriptionServices = [
    { name: "Video", icon: "🎬", color: "bg-[#8c52ff]" },
    { name: "Music", icon: "🎵", color: "bg-[#6d2be3]" },
    { name: "Fitness", icon: "💪", color: "bg-[#b38aff]" },
    { name: "Cloud Storage", icon: "☁️", color: "bg-[#5f8cff]" },
    { name: "News", icon: "📰", color: "bg-[#2f1f50]" },
    { name: "Design Tools", icon: "🎨", color: "bg-[#9d6bff]" },
  ];

  return (
    <section className="py-20 bg-[#f7f3ff]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#1d0f3b] text-balance">Subscription Problem</h2>
          <p className="text-xl text-[#564779] max-w-3xl mx-auto text-balance leading-relaxed">
            Many companies are adopting the subscription business model. However subscribing to many different services
            can become costly for users.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-gradient-to-br from-[#efe6ff] via-[#f7f3ff] to-white border-0 shadow-lg">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">😰</div>
              <h3 className="text-2xl font-semibold text-[#2c1b69] mb-4">Subscription Fatigue</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {subscriptionServices.map((service, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                  <div
                    className={`w-10 h-10 rounded-full ${service.color} flex items-center justify-center text-white text-sm`}
                  >
                    {service.icon}
                  </div>
                  <span className="font-medium text-[#2c1b69]">{service.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
