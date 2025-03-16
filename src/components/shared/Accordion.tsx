import React from 'react';
import {
  Accordion as ShadcnAccordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '../ui/accordion';

interface IAccordionProps {
  children: React.ReactNode;
  triggerText: string;
  className?: string;
}

export function Accordion({
  triggerText,
  className,
  children
}: IAccordionProps) {
  return (
    <ShadcnAccordion
      className="rounded-sm bg-gray-50 px-2"
      type="single"
      collapsible
    >
      <AccordionItem value="invite">
        <AccordionTrigger className={`${className} text-sm text-gray-700`}>
          {triggerText}
        </AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </ShadcnAccordion>
  );
}
