"use client"

import * as React from "react"
import { ChevronsUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface Option {
  id: string
  name: string
}

interface MultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (selectedIds: string[]) => void
  placeholder?: string
  disabled?: boolean
}

export function MultiSelect({
  options = [],
  selected = [],
  onChange,
  placeholder = "Select items...",
  disabled = false
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    return options.filter(option =>
      option.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [options, searchQuery])

  // Handle option selection
  const toggleOption = (optionId: string) => {
    const isSelected = selected.includes(optionId)
    const newSelected = isSelected
      ? selected.filter(id => id !== optionId)
      : [...selected, optionId]
    onChange(newSelected)
  }

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            <span className="truncate">
              {selected.length === 0
                ? placeholder
                : `${selected.length} selected`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <div className="p-2">
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8"
            />
          </div>
          <div className="max-h-[200px] overflow-auto p-2">
            {filteredOptions.length === 0 ? (
              <p className="text-sm text-muted-foreground p-2">No options found</p>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = selected.includes(option.id)
                return (
                  <div
                    key={option.id}
                    className={cn(
                      "flex items-center gap-2 p-2 cursor-pointer rounded-sm hover:bg-accent",
                      isSelected && "bg-accent"
                    )}
                    onClick={() => toggleOption(option.id)}
                  >
                    <div className={cn(
                      "w-4 h-4 border rounded-sm flex items-center justify-center",
                      isSelected && "bg-primary border-primary"
                    )}>
                      {isSelected && (
                        <svg
                          className="w-3 h-3 text-primary-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    {option.name}
                  </div>
                )
              })
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Selected Items */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selected.map((selectedId) => {
            const selectedOption = options.find((opt) => opt.id === selectedId)
            if (!selectedOption) return null
            return (
              <Badge
                key={selectedId}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {selectedOption.name}
                <button
                  type="button"
                  className="ml-1 rounded-full outline-none hover:bg-secondary"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toggleOption(selectedId)
                  }}
                  disabled={disabled}
                >
                  ×
                </button>
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}