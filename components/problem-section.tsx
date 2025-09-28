import { Card } from "@/components/ui/card"

export function ProblemSection() {
  const subscriptionServices = [
    { name: "Video", icon: "🎬", color: "bg-red-500" },
    { name: "Music", icon: "🎵", color: "bg-orange-500" },
    { name: "Fitness", icon: "💪", color: "bg-green-600" },
    { name: "Cloud Storage", icon: "☁️", color: "bg-blue-600" },
    { name: "News", icon: "📰", color: "bg-gray-700" },
    { name: "Design Tools", icon: "🎨", color: "bg-purple-500" },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 text-balance">Subscription Problem</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-balance leading-relaxed">
            Many companies are adopting the subscription business model. However subscribing to many different services
            can become costly for users.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-gradient-to-br from-orange-50 to-red-50 border-0 shadow-lg">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">😰</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Subscription Fatigue</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {subscriptionServices.map((service, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                  <div
                    className={`w-10 h-10 rounded-full ${service.color} flex items-center justify-center text-white text-sm`}
                  >
                    {service.icon}
                  </div>
                  <span className="font-medium text-gray-700">{service.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
