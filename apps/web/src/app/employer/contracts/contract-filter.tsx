"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { DatePicker } from "@/components/ui/datepicker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@elearning/ui"
import { Button } from "@elearning/ui"
import { format, subDays } from "date-fns"

export function ContractsFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams)
    if (status === "all") {
    params.delete("status");
  } else {
    params.set("status", status);
  }
    router.replace(`${pathname}?${params.toString()}`)
  }

  const handleDateChange = (date: Date | undefined, type: 'start' | 'end') => {
    const params = new URLSearchParams(searchParams)
    
    if (date) {
      params.set(type, date.toISOString())
    } else {
      params.delete(type)
    }
    
    router.replace(`${pathname}?${params.toString()}`)
  }

  const handlePresetChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    const now = new Date()

    switch(value) {
      case "7":
        params.set('start', subDays(now, 7).toISOString())
        break
      case "30":
        params.set('start', subDays(now, 30).toISOString())
        break
      case "90":
        params.set('start', subDays(now, 90).toISOString())
        break
      default:
        params.delete('start')
        params.delete('end')
    }

    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="w-full sm:w-[200px]">
            <Select 
              onValueChange={handleStatusChange}
              value={searchParams.get("status") || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-[200px]">
            <Select onValueChange={handlePresetChange}>
              <SelectTrigger>
                <SelectValue placeholder="Date Presets" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>        
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <h4 className="text-sm font-medium mb-2">From</h4>
          <DatePicker
            value={searchParams.get('start') ? new Date(searchParams.get('start')!) : undefined}
            onChange={(date) => handleDateChange(date, 'start')}
            placeholder="Select start date"
          />
        </div>
        
        <div className="flex-1">
          <h4 className="text-sm font-medium mb-2">To</h4>
          <DatePicker
            value={searchParams.get('end') ? new Date(searchParams.get('end')!) : undefined}
            onChange={(date) => handleDateChange(date, 'end')}
            placeholder="Select end date"
            fromDate={searchParams.get('start') ? new Date(searchParams.get('start')!) : undefined}
          />
        </div>
      </div>

      {(searchParams.get('start') || searchParams.get('end') || searchParams.get('status')) && (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              const params = new URLSearchParams()
              router.replace(`${pathname}?${params.toString()}`)
            }}
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  )
}