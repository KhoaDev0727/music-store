"use client"

import { useState, useEffect, useRef } from "react"
import { Github, Code, Sparkles, Heart, Zap, Shield, Music } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AboutSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

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

  const techStack = [
    { name: "Sui Move", icon: Zap, color: "from-sui-cyan to-blue-500" },
    { name: "Next.js", icon: Code, color: "from-white to-gray-400" },
    { name: "React", icon: Sparkles, color: "from-blue-400 to-cyan-400" },
    { name: "TypeScript", icon: Shield, color: "from-blue-500 to-blue-700" },
  ]

  return (
    <section ref={sectionRef} id="about" className="py-20 sm:py-32 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-sui-cyan/50 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-sui-purple/50 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div
          className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-sui-cyan/20 to-sui-purple/20 border border-sui-cyan/30 mb-6">
            <Heart className="w-4 h-4 text-pink-500" />
            <span className="text-sm font-medium">Made with passion</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-shimmer">SuiBeats</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A Web3 music streaming platform built on Sui blockchain, revolutionizing how artists and fans connect.
          </p>
        </div>

        <div
          className={`glass-card rounded-3xl p-8 sm:p-12 mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          style={{ transitionDelay: "0.1s" }}
        >
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="relative flex-shrink-0">

              <div className="w-full h-full rounded-3xl bg-gradient-to-br from-sui-cyan to-sui-purple p-1">
                <div className="w-full h-full rounded-3xl bg-card p-2
                  shadow-xl shadow-sui-purple/20
                  flex items-center justify-center overflow-hidden">
                  <img
                    src="/imgsinhvien2.jpg"
                    alt="Le Minh Khoa"
                    className="w-full h-full object-contain rounded-2xl
                 shadow-lg shadow-sui-cyan/30"
                  />
                </div>
              </div>


              <div className="absolute -inset-4 bg-gradient-to-br from-sui-cyan/20 to-sui-purple/20 rounded-3xl blur-2xl -z-10" />
            </div>

            <div className="flex-grow text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold mb-2">Le Minh Khoa</h3>
              <p className="text-sui-cyan font-medium mb-4">Blockchain Developer</p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Passionate blockchain developer with expertise in Sui Move smart contracts. Building the future of
                decentralized music streaming with cutting-edge Web3 technologies. Dedicated to creating seamless user
                experiences that bridge traditional music consumption with blockchain innovation.
              </p>

              <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-6">
                {techStack.map((tech, index) => (
                  <div
                    key={tech.name}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <tech.icon className="w-4 h-4 text-sui-cyan" />
                    <span className="text-sm font-medium">{tech.name}</span>
                  </div>
                ))}
              </div>

              <a href="https://github.com/KhoaDev0727" target="_blank" rel="noopener noreferrer">
                <Button className="bg-gradient-to-r from-sui-cyan to-sui-purple text-background hover:opacity-90">
                  <Github className="w-5 h-5 mr-2" />
                  github.com/KhoaDev0727
                </Button>
              </a>
            </div>
          </div>
        </div>

        <div
          className={`grid grid-cols-1 sm:grid-cols-3 gap-6 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          style={{ transitionDelay: "0.2s" }}
        >
          {[
            {
              icon: Music,
              title: "Web3 Music",
              description: "Decentralized music streaming powered by blockchain technology",
            },
            {
              icon: Shield,
              title: "Secure & Fast",
              description: "Built on Sui for instant transactions and maximum security",
            },
            {
              icon: Heart,
              title: "Artist Focused",
              description: "Fair revenue distribution directly to artists via smart contracts",
            },
          ].map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sui-cyan/20 to-sui-purple/20 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-7 h-7 text-sui-cyan" />
              </div>
              <h4 className="font-bold mb-2">{feature.title}</h4>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
