import { cn } from "@/lib/utils";

interface ContainerProps {
  className?: string;
  children: React.ReactNode;
  as?: "div" | "section" | "main" | "header" | "footer" | "article";
  narrow?: boolean;
}

export function Container({
  className,
  children,
  as: Tag = "div",
  narrow = false,
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-16 md:px-32",
        narrow ? "max-w-[780px]" : "max-w-[1180px]",
        className
      )}
    >
      {children}
    </Tag>
  );
}
