"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  title: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  variant?: "default" | "highlight" | "accent";
}

export function ResultCard({
  title,
  value,
  description,
  icon,
  className,
  variant = "default",
}: ResultCardProps) {
  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-md",
        variant === "highlight" && "border-primary bg-primary/5",
        variant === "accent" && "border-accent bg-accent/10",
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {icon && (
            <div className={cn(
              "p-2 rounded-lg",
              variant === "default" && "bg-secondary text-foreground",
              variant === "highlight" && "bg-primary text-primary-foreground",
              variant === "accent" && "bg-accent text-accent-foreground"
            )}>
              {icon}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className={cn(
          "text-2xl font-bold tracking-tight",
          variant === "highlight" && "text-primary",
          variant === "accent" && "text-accent"
        )}>
          {value}
        </p>
        {description && (
          <CardDescription className="mt-1 text-xs">
            {description}
          </CardDescription>
        )}
      </CardContent>
    </Card>
  );
}
