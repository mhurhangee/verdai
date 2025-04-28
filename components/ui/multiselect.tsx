"use client"
import * as React from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MultiselectProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  max?: number
  maxLength?: number
  disabled?: boolean
  className?: string
}

export function Multiselect({
  value,
  onChange,
  placeholder = "Add tag...",
  max = 3,
  maxLength = 16,
  disabled = false,
  className = "",
}: MultiselectProps) {
  const [input, setInput] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  function handleAdd(e?: React.KeyboardEvent | React.FocusEvent) {
    if (e) e.preventDefault()
    const tag = input.trim()
    if (!tag) return
    if (value.includes(tag)) {
      setError("Tag already added")
      return
    }
    if (tag.length > maxLength) {
      setError(`Tag max ${maxLength} chars`)
      return
    }
    if (value.length >= max) {
      setError(`Max ${max} tags allowed`)
      return
    }
    setError(null)
    onChange([...value, tag])
    setInput("")
    inputRef.current?.focus()
  }

  function handleRemove(tag: string) {
    onChange(value.filter(t => t !== tag))
    setError(null)
  }

  return (
    <div className={cn("flex flex-wrap gap-2 items-center border rounded-md px-2 py-1", className, disabled && "opacity-60 pointer-events-none")}
      tabIndex={-1}
      aria-disabled={disabled}
    >
      {value.map(tag => (
        <span key={tag} className="flex items-center bg-muted text-xs rounded px-2 py-0.5 gap-1">
          {tag}
          <button
            type="button"
            className="ml-1 p-0.5 hover:text-destructive"
            aria-label={`Remove tag ${tag}`}
            onClick={() => handleRemove(tag)}
            tabIndex={0}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      {value.length < max && (
        <div className="flex items-center flex-1 min-w-0">
          <Input
            ref={inputRef}
            value={input}
            onChange={e => {
              setInput(e.target.value)
              setError(null)
            }}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault()
                handleAdd(e)
              } else if (e.key === "Backspace" && input === "") {
                // Remove last tag
                if (value.length > 0) handleRemove(value[value.length - 1])
              }
            }}
            maxLength={maxLength}
            placeholder={placeholder}
            className="border-0 shadow-none px-1 py-0 h-6 text-xs w-40 flex-1 min-w-0 focus-visible:ring-0 focus-visible:outline-none bg-transparent"
            disabled={disabled}
            aria-label="Add tag"
            autoComplete="off"
          />
        </div>
      )}
      {error && <span className="text-destructive text-xs ml-2">{error}</span>}
    </div>
  )
}
