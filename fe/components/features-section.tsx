"use client"

import { useEffect, useRef, useState } from "react"
import { Shield, Zap, Code, Database, Lock, Layers, ArrowRight } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Sub-second finality with parallel transaction execution for maximum throughput.",
    gradient: "from-sui-cyan to-sui-blue",
  },
  {
    icon: Shield,
    title: "Battle-Tested Security",
    description: "Built-in security features with Move's resource-oriented programming model.",
    gradient: "from-sui-purple to-pink-500",
  },
  {
    icon: Code,
    title: "Move Smart Contracts",
    description: "Write safe, efficient smart contracts using the Move programming language.",
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    icon: Database,
    title: "Object-Centric Storage",
    description: "Unique object model enabling true digital asset ownership and composability.",
    gradient: "from-green-400 to-emerald-500",
  },
  {
    icon: Lock,
    title: "Secure by Design",
    description: "Eliminate common vulnerabilities with Move's strict type system and ownership model.",
    gradient: "from-blue-400 to-indigo-500",
  },
  {
    icon: Layers,
    title: "Horizontal Scaling",
    description: "Scale seamlessly with Sui's innovative parallel execution architecture.",
    gradient: "from-pink-400 to-rose-500",
  },
]

export function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="features" className="py-16 sm:py-20 md:py-24 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] md:w-[800px] h-[300px] sm:h-[600px] md:h-[800px] rounded-full bg-sui-purple/5 blur-[80px] sm:blur-[150px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className={`text-center mb-12 sm:mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            <span className="text-foreground">Why Choose </span>
            <span className="text-shimmer">SuiVerse</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Experience the next generation of blockchain technology with cutting-edge features designed for developers
            and users alike.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group glass-card rounded-2xl p-5 sm:p-6 md:p-8 transition-all duration-500 hover:border-sui-cyan/30 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              } ${index === 0 || index === 3 ? "md:col-span-2 lg:col-span-1" : ""}`}
              style={{ transitionDelay: `${0.1 + index * 0.1}s` }}
            >
              <div
                className={`inline-flex p-3 sm:p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-background" />
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3">{feature.title}</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">{feature.description}</p>

              <div className="flex items-center gap-2 text-sui-cyan text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
