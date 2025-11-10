"use client"

import type React from "react"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Check, X, ChevronLeft, ChevronRight } from "lucide-react"
import { BookingDetailsDrawer } from "@/components/booking-details-drawer"

// Mock data
const pendingBookings = [
  {
    id: 1,
    firstName: "Иван",
    lastName: "Иванов",
    phone: "+7 (999) 123-45-67",
    email: "ivanov@mail.ru",
    court: "Корт №1",
    date: "2025-01-15",
    time: "10:00 - 11:00",
    price: 2000,
    status: "pending",
    isRecurring: false,
  },
  {
    id: 2,
    firstName: "Петр",
    lastName: "Петров",
    phone: "+7 (999) 234-56-78",
    email: "petrov@mail.ru",
    court: "Корт №2",
    date: "2025-01-16",
    time: "14:00 - 15:00",
    price: 2500,
    status: "pending",
    isRecurring: true,
    recurringDetails: {
      startDate: "2025-01-16",
      endDate: "2025-03-16",
      weeks: 8,
      days: ["Пн", "Ср", "Пт"],
    },
  },
  {
    id: 3,
    firstName: "Сидор",
    lastName: "Сидоров",
    phone: "+7 (999) 345-67-89",
    email: "sidorov@mail.ru",
    court: "Корт №1",
    date: "2025-01-17",
    time: "18:00 - 19:00",
    price: 3000,
    status: "pending",
    isRecurring: false,
  },
]

const confirmedBookings = [
  {
    id: 4,
    firstName: "Анна",
    lastName: "Смирнова",
    phone: "+7 (999) 456-78-90",
    email: "smirnova@mail.ru",
    court: "Корт №3",
    date: "2025-01-14",
    time: "16:00 - 17:00",
    price: 2500,
    status: "confirmed",
    isRecurring: false,
  },
]

export default function BookingsPage() {
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("pending")
  const [currentPage, setCurrentPage] = useState(1)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [actionBooking, setActionBooking] = useState<any>(null)
  const itemsPerPage = 10

  const handleBookingClick = (booking: any) => {
    setSelectedBooking(booking)
    setDrawerOpen(true)
  }

  const handleConfirmClick = (booking: any, e: React.MouseEvent) => {
    e.stopPropagation()
    setActionBooking(booking)
    setConfirmModalOpen(true)
  }

  const handleRejectClick = (booking: any, e: React.MouseEvent) => {
    e.stopPropagation()
    setActionBooking(booking)
    setRejectModalOpen(true)
  }

  const confirmBooking = () => {
    console.log("Confirming booking:", actionBooking)
    setConfirmModalOpen(false)
    setActionBooking(null)
  }

  const rejectBooking = () => {
    console.log("Rejecting booking:", actionBooking)
    setRejectModalOpen(false)
    setActionBooking(null)
  }

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div>
          <p className="text-xl font-bold text-primary mt-1">Управление заявками на бронирование кортов</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="pending" className="data-[state=active]:border-b-2 data-[state=active]:border-accent">
              Ожидающие
              <Badge variant="secondary" className="ml-2 bg-[#E6B800]/10 text-[#E6B800] border-[#E6B800]/20">
                {pendingBookings.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="confirmed" className="data-[state=active]:border-b-2 data-[state=active]:border-accent">
              Подтверждённые
            </TabsTrigger>
          </TabsList>

          <Card className="mt-4 p-3 w-fit">
            <div className="flex flex-col sm:flex-row gap-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Дата</label>
                {/* <DatePicker /> */}
                <Input type="date" className="w-fit h-9" />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Корт</label>
                <Select>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Все корты" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все корты</SelectItem>
                    <SelectItem value="court1">Корт №1</SelectItem>
                    <SelectItem value="court2">Корт №2</SelectItem>
                    <SelectItem value="court3">Корт №3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Тип брони</label>
                <Select defaultValue="one-time">
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-time">Разовое</SelectItem>
                    <SelectItem value="repeat">Повторяющееся</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <TabsContent value="pending" className="mt-4 space-y-4">
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary">
                      <th className="text-left p-3 text-sm font-semibold text-primary">ФИО</th>
                      <th className="text-left p-3 text-sm font-semibold text-primary">Телефон</th>
                      <th className="text-left p-3 text-sm font-semibold text-primary">Email</th>
                      <th className="text-left p-3 text-sm font-semibold text-primary">Корт</th>
                      <th className="text-left p-3 text-sm font-semibold text-primary">Дата</th>
                      <th className="text-left p-3 text-sm font-semibold text-primary">Время</th>
                      <th className="text-left p-3 text-sm font-semibold text-primary">Цена</th>
                      <th className="text-left p-3 text-sm font-semibold text-primary">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="border-b border-border hover:bg-secondary/50 cursor-pointer transition-colors"
                        onClick={() => handleBookingClick(booking)}
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {booking.firstName} {booking.lastName}
                              </p>
                              {booking.isRecurring && (
                                <Badge className="mt-1 text-xs bg-accent text-accent-foreground font-semibold">
                                  Повторяющееся
                                </Badge>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-sm text-foreground">{booking.phone}</td>
                        <td className="p-3 text-sm text-foreground">{booking.email}</td>
                        <td className="p-3 text-sm text-foreground">{booking.court}</td>
                        <td className="p-3 text-sm text-foreground">
                          {new Date(booking.date).toLocaleDateString("ru-RU")}
                        </td>
                        <td className="p-3 text-sm text-foreground">{booking.time}</td>
                        <td className="p-3 text-sm font-medium text-foreground">{booking.price} ₽</td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-[#1E7A4C] hover:bg-[#1E7A4C]/90 text-white h-8"
                              onClick={(e) => handleConfirmClick(booking, e)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-8"
                              onClick={(e) => handleRejectClick(booking, e)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between p-3 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Показано 1-
                  {Math.min(itemsPerPage, pendingBookings.length)} из {pendingBookings.length}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={currentPage === 1}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    1
                  </Button>
                  <Button variant="outline" size="sm" disabled={currentPage * itemsPerPage >= pendingBookings.length}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="confirmed" className="mt-4 space-y-4">
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary">
                      <th className="text-left p-4 text-sm font-semibold text-primary">ФИО</th>
                      <th className="text-left p-4 text-sm font-semibold text-primary">Телефон</th>
                      <th className="text-left p-4 text-sm font-semibold text-primary">Email</th>
                      <th className="text-left p-4 text-sm font-semibold text-primary">Корт</th>
                      <th className="text-left p-4 text-sm font-semibold text-primary">Дата</th>
                      <th className="text-left p-4 text-sm font-semibold text-primary">Время</th>
                      <th className="text-left p-4 text-sm font-semibold text-primary">Цена</th>
                      <th className="text-left p-4 text-sm font-semibold text-primary">Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {confirmedBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="border-b border-border hover:bg-secondary/50 cursor-pointer transition-colors"
                        onClick={() => handleBookingClick(booking)}
                      >
                        <td className="p-4">
                          <p className="text-sm font-medium text-foreground">
                            {booking.firstName} {booking.lastName}
                          </p>
                        </td>
                        <td className="p-4 text-sm text-foreground">{booking.phone}</td>
                        <td className="p-4 text-sm text-foreground">{booking.email}</td>
                        <td className="p-4 text-sm text-foreground">{booking.court}</td>
                        <td className="p-4 text-sm text-foreground">
                          {new Date(booking.date).toLocaleDateString("ru-RU")}
                        </td>
                        <td className="p-4 text-sm text-foreground">{booking.time}</td>
                        <td className="p-4 text-sm font-medium text-foreground">{booking.price} ₽</td>
                        <td className="p-4">
                          <Badge className="bg-[#1E7A4C] text-white hover:bg-[#1E7A4C]/90">Подтверждено</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between p-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Показано 1-{confirmedBookings.length} из {confirmedBookings.length}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    1
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BookingDetailsDrawer booking={selectedBooking} open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <Dialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтвердить бронирование?</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите подтвердить бронирование для {actionBooking?.firstName} {actionBooking?.lastName}?
              Клиент получит уведомление.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-4">
            <Button variant="outline" onClick={() => setConfirmModalOpen(false)}>
              Отмена
            </Button>
            <Button className="bg-[#1E7A4C] hover:bg-[#1E7A4C]/90 text-white" onClick={confirmBooking}>
              Подтвердить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Отклонить бронирование?</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите отклонить бронирование для {actionBooking?.firstName} {actionBooking?.lastName}?
              Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-4">
            <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={rejectBooking}>
              Отклонить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
