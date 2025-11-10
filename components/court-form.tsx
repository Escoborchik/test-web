"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus } from "lucide-react"

interface CourtFormProps {
  court?: any
  onSave: (data: any) => void
  onCancel: () => void
}

export function CourtForm({ court, onSave, onCancel }: CourtFormProps) {
  const [formData, setFormData] = useState(
    court || {
      name: "",
      surface: "Хард",
      sport: "Теннис",
      type: "Открытый",
      address: "",
      photo: "",
      count: 1,
      pricing: {
        weekday: [{ start: "10:00", end: "18:00", price: 2000 }],
        weekend: [{ start: "10:00", end: "18:00", price: 3000 }],
      },
    },
  )

  const addPriceSlot = (type: "weekday" | "weekend") => {
    setFormData((prev: any) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [type]: [...prev.pricing[type], { start: "10:00", end: "18:00", price: 0 }],
      },
    }))
  }

  const removePriceSlot = (type: "weekday" | "weekend", index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [type]: prev.pricing[type].filter((_: any, i: number) => i !== index),
      },
    }))
  }

  const updatePriceSlot = (type: "weekday" | "weekend", index: number, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [type]: prev.pricing[type].map((slot: any, i: number) => (i === index ? { ...slot, [field]: value } : slot)),
      },
    }))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border-2 border-primary shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="courtName" className="text-sm">
            Название
          </Label>
          <Input
            id="courtName"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Корт №1"
            className="h-9"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="count" className="text-sm">
            Количество кортов
          </Label>
          <Input
            id="count"
            type="number"
            min="1"
            value={formData.count}
            onChange={(e) => setFormData({ ...formData, count: Number.parseInt(e.target.value) || 1 })}
            placeholder="1"
            className="h-9"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="surface" className="text-sm">
            Покрытие
          </Label>
          <Select value={formData.surface} onValueChange={(value) => setFormData({ ...formData, surface: value })}>
            <SelectTrigger id="surface" className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Хард">Хард</SelectItem>
              <SelectItem value="Грунт">Грунт</SelectItem>
              <SelectItem value="Трава">Трава</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sport" className="text-sm">
            Вид спорта
          </Label>
          <Select value={formData.sport} onValueChange={(value) => setFormData({ ...formData, sport: value })}>
            <SelectTrigger id="sport" className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Теннис">Теннис</SelectItem>
              <SelectItem value="Падел">Падел</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type" className="text-sm">
            Тип
          </Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger id="type" className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Открытый">Открытый</SelectItem>
              <SelectItem value="Закрытый">Закрытый</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm">
            Адрес
          </Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="ул. Спортивная, 12"
            className="h-9"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="photo" className="text-sm">
            Фото корта
          </Label>
          <div className="flex gap-2">
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="h-9 cursor-pointer"
            />
            {formData.photo && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormData({ ...formData, photo: "" })}
                className="h-9"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {formData.photo && (
            <div className="mt-2">
              <img
                src={formData.photo || "/placeholder.svg"}
                alt="Preview"
                className="h-20 w-32 object-cover rounded border"
              />
            </div>
          )}
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm">Будни (Пн-Пт)</Label>
            <Button size="sm" variant="outline" onClick={() => addPriceSlot("weekday")} className="h-7 text-xs">
              <Plus className="h-3 w-3 mr-1" />
              Добавить
            </Button>
          </div>
          {formData.pricing.weekday.map((slot: any, index: number) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input
                type="time"
                value={slot.start}
                onChange={(e) => updatePriceSlot("weekday", index, "start", e.target.value)}
                className="h-8"
              />
              <Input
                type="time"
                value={slot.end}
                onChange={(e) => updatePriceSlot("weekday", index, "end", e.target.value)}
                className="h-8"
              />
              <Input
                type="number"
                value={slot.price}
                onChange={(e) => updatePriceSlot("weekday", index, "price", Number.parseInt(e.target.value))}
                placeholder="Цена"
                className="h-8"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removePriceSlot("weekday", index)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm">Выходные (Сб-Вс)</Label>
            <Button size="sm" variant="outline" onClick={() => addPriceSlot("weekend")} className="h-7 text-xs">
              <Plus className="h-3 w-3 mr-1" />
              Добавить
            </Button>
          </div>
          {formData.pricing.weekend.map((slot: any, index: number) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input
                type="time"
                value={slot.start}
                onChange={(e) => updatePriceSlot("weekend", index, "start", e.target.value)}
                className="h-8"
              />
              <Input
                type="time"
                value={slot.end}
                onChange={(e) => updatePriceSlot("weekend", index, "end", e.target.value)}
                className="h-8"
              />
              <Input
                type="number"
                value={slot.price}
                onChange={(e) => updatePriceSlot("weekend", index, "price", Number.parseInt(e.target.value))}
                placeholder="Цена"
                className="h-8"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removePriceSlot("weekend", index)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel} className="h-8 bg-transparent">
          Отмена
        </Button>
        <Button className="bg-[#1E7A4C] hover:bg-[#1E7A4C]/90 text-white h-8" onClick={() => onSave(formData)}>
          {court ? "Сохранить" : "Добавить"}
        </Button>
      </div>
    </div>
  )
}
