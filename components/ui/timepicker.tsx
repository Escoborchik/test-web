"use client"

import { Select, SelectGroup, SelectPortal, SelectValue } from "@radix-ui/react-select"
import { useCallback, useEffect, useRef, useState } from "react"
import { SelectTrigger } from "./selecttrigger"
import { SelectContent } from "./selectcontent"
import { SelectViewport } from "./selectviewport"
import { SelectItem } from "./selectitem"
import { SelectItemText } from "./selectitemtext"

interface TimePickerProps {
  value?: string
  onChange?: (value: string) => void
}

export const TimePicker = ({ value = "08:00", onChange }: TimePickerProps) => {
  const [selectedHour, setSelectedHour] = useState("08")
  const [selectedMinute, setSelectedMinute] = useState("00")

  const hourOptions = Array.from({ length: 24 }, (_, i) => ({
    value: i.toString().padStart(2, "0"),
    label: i.toString().padStart(2, "0"),
  }))

  const minuteOptions = [
    { value: "00", label: "00" },
    { value: "30", label: "30" },
  ]

  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const selectedHourRef = useRef(selectedHour)
  const selectedMinuteRef = useRef(selectedMinute)

  useEffect(() => {
    selectedHourRef.current = selectedHour
  }, [selectedHour])

  useEffect(() => {
    selectedMinuteRef.current = selectedMinute
  }, [selectedMinute])

  useEffect(() => {
    if (value) {
      const [hour, minute] = value.split(":")
      const newTime = `${hour || "08"}:${minute || "00"}`
      const currentTime = `${selectedHourRef.current}:${selectedMinuteRef.current}`

      if (newTime !== currentTime) {
        setSelectedHour(hour || "08")
        setSelectedMinute(minute || "00")
      }
    }
  }, [value])

  const handleHourChange = useCallback(
    (hour: string) => {
      setSelectedHour(hour)
      const newTime = `${hour}:${selectedMinuteRef.current}`
      if (newTime !== value) {
        onChangeRef.current?.(newTime)
      }
    },
    [value],
  )

  const handleMinuteChange = useCallback(
    (minute: string) => {
      setSelectedMinute(minute)
      const newTime = `${selectedHourRef.current}:${minute}`
      if (newTime !== value) {
        onChangeRef.current?.(newTime)
      }
    },
    [value],
  )

  return (
    <div className="flex gap-2">
      {/* Выбор часов */}
      <Select value={selectedHour} onValueChange={handleHourChange}>
        <SelectTrigger className="w-16">
          <SelectValue placeholder="ЧЧ" />
        </SelectTrigger>
        <SelectPortal>
          <SelectContent className="min-w-[4rem]" position="popper" sideOffset={4}>
            <SelectViewport className="max-h-48 overflow-y-auto">
              <SelectGroup>
                {hourOptions.map(({ value: optionValue, label }) => (
                  <SelectItem key={optionValue} value={optionValue}>
                    <SelectItemText>{label}</SelectItemText>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectViewport>
          </SelectContent>
        </SelectPortal>
      </Select>

      <div className="flex h-10 items-center text-lg font-semibold text-muted-foreground">:</div>

      {/* Выбор минут */}
      <Select value={selectedMinute} onValueChange={handleMinuteChange}>
        <SelectTrigger className="w-16">
          <SelectValue placeholder="ММ" />
        </SelectTrigger>
        <SelectPortal>
          <SelectContent className="min-w-[4rem]" position="popper" sideOffset={4}>
            <SelectViewport>
              <SelectGroup>
                {minuteOptions.map(({ value: optionValue, label }) => (
                  <SelectItem key={optionValue} value={optionValue}>
                    <SelectItemText>{label}</SelectItemText>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectViewport>
          </SelectContent>
        </SelectPortal>
      </Select>
    </div>
  )
}
