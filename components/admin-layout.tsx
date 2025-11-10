"use client"

import type React from "react"

import { useState } from "react"
import { Bell, Calendar, BarChart3, Building2, User, LogOut, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { NotificationsPanel } from "./notifications-panel"
import { Badge } from "@/components/ui/badge"

const navigation = [
  { name: "Бронирования", href: "/bookings", icon: Calendar },
  { name: "Расписание", href: "/schedule", icon: Calendar },
  { name: "Аналитика", href: "/analytics", icon: BarChart3 },
  { name: "Организация", href: "/organization", icon: Building2 },
  { name: "Профиль", href: "/profile", icon: User },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [showNotifications, setShowNotifications] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Mock notification count
  const notificationCount = 3

  const handleLogout = () => {
    console.log("Logging out...")
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Desktop - Made sticky with fixed positioning */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-60 lg:flex-col bg-primary z-30">
        <div className="flex grow flex-col gap-y-3 overflow-y-auto px-4 py-6">
          {/* Logo */}
          <div className="flex items-center text-white px-2">
            <h1 className="text-xl font-bold">Book&Play</h1>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col gap-y-1">
            <ul role="list" className="flex flex-1 flex-col gap-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex gap-x-3 rounded-lg p-2.5 text-sm font-medium leading-6 transition-colors",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/20",
                      )}
                    >
                      {isActive && <div className="absolute left-0 w-1 h-10 bg-accent rounded-r-full" />}
                      <item.icon className="h-5 w-5 shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
              <li className="mt-auto">
                <button
                  onClick={handleLogout}
                  className="group flex w-full gap-x-3 rounded-lg p-2.5 text-sm font-medium leading-6 text-sidebar-foreground hover:bg-sidebar-accent/20 transition-colors"
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                  Выход
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-60">
        {/* Top bar */}
        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-x-4 border-b border-border bg-card px-4 sm:px-6 lg:px-8">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden -m-2.5 p-2.5 text-foreground"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Открыть меню</span>
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <span className="text-lg font-semibold text-primary lg:hidden">Book&Play</span>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Notifications */}
              <button
                type="button"
                className="relative -m-2.5 p-2.5 text-foreground hover:text-accent transition-colors"
                onClick={() => setShowNotifications(true)}
              >
                <span className="sr-only">Просмотр уведомлений</span>
                <Bell className="h-6 w-6" />
                {notificationCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-[#D93A2B]"
                  >
                    {notificationCount}
                  </Badge>
                )}
              </button>

              {/* User info */}
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" />
              <div className="hidden lg:flex lg:items-center lg:gap-x-2">
                <span className="text-sm font-medium text-foreground">И.О. Администратора</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content - Reduced padding */}
        <main className="py-4 px-4 sm:px-6 lg:px-8">{children}</main>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="relative z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-primary p-6">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-xl font-bold text-white">Book&Play</h1>
              <button onClick={() => setMobileMenuOpen(false)} className="text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex gap-x-3 rounded-lg p-3 text-sm font-medium",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/20",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
              <button
                onClick={handleLogout}
                className="flex w-full gap-x-3 rounded-lg p-3 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/20 mt-auto"
              >
                <LogOut className="h-5 w-5" />
                Выход
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Notifications Panel - Overlay style like in the reference image */}
      <NotificationsPanel open={showNotifications} onClose={() => setShowNotifications(false)} />
    </div>
  )
}
