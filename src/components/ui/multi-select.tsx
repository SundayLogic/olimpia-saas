"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
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
  const [inputValue, setInputValue] = React.useState("")

  // Initialize with memoized safe values
  const safeOptions = React.useMemo(() => {
    return Array.isArray(options) 
      ? options.filter((option): option is Option => 
          option !== null && 
          typeof option === 'object' && 
          'id' in option && 
          'name' in option
        )
      : []
  }, [options])

  const safeSelected = React.useMemo(() => {
    return Array.isArray(selected) 
      ? selected.filter((id): id is string => typeof id === 'string')
      : []
  }, [selected])

  // Filter options based on input
  const filteredOptions = React.useMemo(() => {
    const searchValue = inputValue.toLowerCase().trim()
    return searchValue === "" 
      ? safeOptions 
      : safeOptions.filter((option) => 
          option.name.toLowerCase().includes(searchValue)
        )
  }, [safeOptions, inputValue])

  // Handle selection changes
  const handleSelect = React.useCallback((optionId: string) => {
    const isSelected = safeSelected.includes(optionId)
    const newSelected = isSelected
      ? safeSelected.filter((id) => id !== optionId)
      : [...safeSelected, optionId]
    onChange(newSelected)
  }, [safeSelected, onChange])

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
            type="button"
          >
            <span className="truncate">
              {safeSelected.length === 0
                ? placeholder
                : `${safeSelected.length} selected`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search..."
              value={inputValue}
              onValueChange={setInputValue}
              className="h-9"
            />
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup className="max-h-[200px] overflow-auto">
              {filteredOptions.map((option) => {
                const isSelected = safeSelected.includes(option.id)
                return (
                  <CommandItem
                    key={option.id}
                    value={option.id}
                    onSelect={() => handleSelect(option.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.name}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      
      {safeSelected.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {safeSelected.map((selectedId) => {
            const selectedOption = safeOptions.find((opt) => opt.id === selectedId)
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
                    handleSelect(selectedId)
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