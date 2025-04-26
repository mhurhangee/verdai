'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

type ComparisonTableProps = {
  headers: string[]
  rows: (string | ReactNode)[][]
  highlightCol?: number
  className?: string
}

export function ComparisonTable({ headers, rows, highlightCol, className }: ComparisonTableProps) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr>
            {headers.map((header, i) => (
              <th
                key={i}
                className="bg-muted-foreground/10 border-b px-4 py-2 text-left font-semibold"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rIdx) => (
            <tr
              key={rIdx}
              className={highlightCol !== undefined && highlightCol === rIdx ? 'bg-primary/10' : ''}
            >
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="border-b px-4 py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
