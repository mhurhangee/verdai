'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export type FAQItem = {
  question: string
  answer: string
}

type FAQProps = {
  items: FAQItem[]
  className?: string
}

export function FAQ({ items, className }: FAQProps) {
  return (
    <Accordion type="multiple" className={className}>
      {items.map((item, i) => (
        <AccordionItem value={item.question} key={i} className="border-b-0">
          <AccordionTrigger className="py-2 text-base font-medium">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pb-2 text-sm">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
