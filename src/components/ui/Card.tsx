import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  as?: "div" | "article" | "li";
}

export function Card({ className, children, as: Tag = "div" }: CardProps) {
  return (
    <Tag
      className={cn(
        "bg-bg-primary border border-[0.5px] border-border-default rounded-card",
        className
      )}
    >
      {children}
    </Tag>
  );
}

interface CardBodyProps {
  className?: string;
  children: React.ReactNode;
}

export function CardBody({ className, children }: CardBodyProps) {
  return <div className={cn("p-24", className)}>{children}</div>;
}
