"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  dark?: boolean;
  className?: string;
}

export function Accordion({ items, dark = false, className }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <div className={cn("flex flex-col", className)} role="list">
      {items.map((item) => {
        const isOpen = openId === item.id;
        const panelId = `accordion-panel-${item.id}`;
        const headerId = `accordion-header-${item.id}`;

        return (
          <div
            key={item.id}
            role="listitem"
            className={cn(
              "border-b border-[0.5px]",
              dark ? "border-white/10" : "border-border-default"
            )}
          >
            <button
              id={headerId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(item.id)}
              className={cn(
                "flex w-full items-center justify-between gap-16 px-16 md:px-24 py-16 md:py-24 text-left",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-border focus-visible:outline-offset-2 rounded-sm",
                dark ? "text-white" : "text-on-surface hover:text-primary transition-colors"
              )}
            >
              <span className="text-[15px] md:text-[16px] font-medium leading-snug pr-16">
                {item.question}
              </span>
              <span
                className={cn(
                  "shrink-0 transition-colors",
                  dark ? "text-[#AAAAAA]" : "text-muted-text"
                )}
                aria-hidden
              >
                {isOpen ? <Minus size={16} strokeWidth={1.5} /> : <Plus size={16} strokeWidth={1.5} />}
              </span>
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              hidden={!isOpen}
              className={cn(
                "px-16 md:px-24 pb-16 md:pb-24 text-[14px] md:text-[15px] leading-relaxed",
                dark ? "text-[#AAAAAA]" : "text-muted-text"
              )}
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
