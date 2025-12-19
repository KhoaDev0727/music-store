"use client"

import { useState } from "react"
import { ParticleBackground } from "@/components/particle-background"
import { AdminNavbar } from "@/components/admin/admin-navbar"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { AddMusicForm } from "@/components/admin/add-music-form"
import { MusicManagement } from "@/components/admin/music-management"
import { WalletProvider } from "@/contexts/wallet-context"
import { MusicProvider } from "@/contexts/music-context"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "add" | "manage">("dashboard")

  return (
    <WalletProvider>
      <MusicProvider>
        <main className="min-h-screen bg-background overflow-x-hidden">
          <ParticleBackground />
          <AdminNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="pt-24 pb-12 px-4">
            {activeTab === "dashboard" && <AdminDashboard />}
            {activeTab === "add" && <AddMusicForm />}
            {activeTab === "manage" && <MusicManagement />}
          </div>
        </main>
      </MusicProvider>
    </WalletProvider>
  )
}
