"use client";

import * as React from "react";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/src/shared/components/ui/tabs";
import { cn } from "@/src/lib/utils";
import { ChronoBadge } from "@chrono/chrono-badge.component";

/* ---------------------------------- Root ---------------------------------- */
interface ChronoTabsProps extends React.ComponentProps<typeof Tabs> {
    children: React.ReactNode;
}

function ChronoTabs({ className, children, ...props }: ChronoTabsProps) {
    return (
        <Tabs className={cn("", className)} {...props}>
            {children}
        </Tabs>
    );
}

/* ---------------------------------- List ---------------------------------- */
interface ChronoTabsListProps extends React.ComponentProps<typeof TabsList> {
    children: React.ReactNode;
}

function ChronoTabsList({ className, children, ...props }: ChronoTabsListProps) {
    return (
        <TabsList className={cn("w-fit", className)} {...props}>
            {children}
        </TabsList>
    );
}

/* -------------------------------- Trigger --------------------------------- */
interface ChronoTabsTriggerProps extends React.ComponentProps<typeof TabsTrigger> {
    children: React.ReactNode;
    badge?: number | string;
    badgeVariant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";
}

function ChronoTabsTrigger({
    className,
    children,
    badge,
    badgeVariant = "secondary",
    ...props
}: ChronoTabsTriggerProps) {
    return (
        <TabsTrigger 
            className={cn(
                "gap-2 flex-none data-[state=active]:bg-primary! data-[state=active]:text-primary-foreground!",
                className
            )} 
            {...props}
        >
            {children}
            {badge !== undefined && (
                <ChronoBadge variant={badgeVariant} className="h-5 min-w-5 px-1.5 text-[10px]">
                    {badge}
                </ChronoBadge>
            )}
        </TabsTrigger>
    );
}

/* -------------------------------- Content --------------------------------- */
interface ChronoTabsContentProps extends React.ComponentProps<typeof TabsContent> {
    children: React.ReactNode;
}

function ChronoTabsContent({ className, children, ...props }: ChronoTabsContentProps) {
    return (
        <TabsContent className={cn("mt-2", className)} {...props}>
            {children}
        </TabsContent>
    );
}

export { ChronoTabs, ChronoTabsList, ChronoTabsTrigger, ChronoTabsContent };
