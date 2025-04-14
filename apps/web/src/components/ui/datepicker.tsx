"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@elearning/lib/utils"
import { Button } from "../../../../../packages/ui/src/ui/button"
import { Calendar } from "../../../../../packages/ui/src/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../../packages/ui/src/ui/popover"

export interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  fromDate?: Date
  toDate?: Date
}

const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  ({
    value,
    onChange,
    placeholder = "Select date",
    disabled = false,
    className,
    fromDate,
    toDate,
  }, ref) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            initialFocus
            fromDate={fromDate}
            toDate={toDate}
          />
        </PopoverContent>
      </Popover>
    )
  }
)

DatePicker.displayName = "DatePicker"
export {DatePicker}