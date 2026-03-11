"use client";

import * as React from "react";
import { Check, ChevronRight, Minus } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { cn } from "@/src/lib/utils";

/* ──────────────── Types ──────────────── */

export interface ChronoTreeItem {
  id: string;
  label: string;
  hint?: string;
}

export interface ChronoTreeGroup {
  id: string;
  label: string;
  items: ChronoTreeItem[];
}

export interface ChronoTreeProps {
  /** Array of groups, each containing leaf items */
  groups: ChronoTreeGroup[];
  /** Set of currently selected item IDs */
  selectedIds: Set<string>;
  /** Callback when a single item is toggled */
  onToggleItem: (itemId: string, checked: boolean) => void;
  /** Callback when an entire group is toggled */
  onToggleGroup: (itemIds: string[], checked: boolean) => void;
  /** Callback when "select all" is toggled. If omitted the header row is hidden */
  onToggleAll?: (checked: boolean) => void;
  /** Label for the "select all" row */
  selectAllLabel?: string;
  /** Suffix shown after the counter, e.g. "permisos" → "12/20 permisos" */
  countLabel?: string;
  /** Shown when groups is empty */
  emptyMessage?: string;
  /** Whether groups start expanded (default: false) */
  defaultExpanded?: boolean;
  className?: string;
}

/* ──────── Internal: TreeCheckbox ──────── */

type CheckState = boolean | "indeterminate";

function TreeCheckbox({
  checked,
  onCheckedChange,
  className,
}: {
  checked: CheckState;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}) {
  const isActive = checked === true || checked === "indeterminate";

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked === "indeterminate" ? "mixed" : checked}
      onClick={(e) => {
        e.stopPropagation();
        onCheckedChange(checked !== true);
      }}
      className={cn(
        "flex size-4 shrink-0 items-center justify-center rounded-sm border outline-none transition-shadow",
        "focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        isActive && "bg-primary border-primary text-primary-foreground",
        !isActive && "border-input",
        className,
      )}
    >
      {checked === true && <Check className="size-3" strokeWidth={3} />}
      {checked === "indeterminate" && (
        <Minus className="size-3" strokeWidth={3} />
      )}
    </button>
  );
}

/* ──────── Internal: TreeItem ──────── */

function TreeItem({
  item,
  checked,
  onToggle,
}: {
  item: ChronoTreeItem;
  checked: boolean;
  onToggle: (itemId: string, checked: boolean) => void;
}) {
  const toggle = () => onToggle(item.id, !checked);

  return (
    <div
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          toggle();
        }
      }}
      className="flex items-center gap-2.5 rounded-md px-2 py-1.5 cursor-pointer hover:bg-muted/50 transition-colors group/item select-none"
    >
      <TreeCheckbox
        checked={checked}
        onCheckedChange={(val) => onToggle(item.id, val)}
      />
      <span className="text-sm">{item.label}</span>
      {item.hint && (
        <span className="text-[10px] text-muted-foreground opacity-0 group-hover/item:opacity-100 transition-opacity">
          {item.hint}
        </span>
      )}
    </div>
  );
}

/* ──────── Internal: TreeGroupNode ──────── */

function TreeGroupNode({
  group,
  selectedIds,
  onToggleItem,
  onToggleGroup,
  defaultExpanded = false,
}: {
  group: ChronoTreeGroup;
  selectedIds: Set<string>;
  onToggleItem: (itemId: string, checked: boolean) => void;
  onToggleGroup: (itemIds: string[], checked: boolean) => void;
  defaultExpanded?: boolean;
}) {
  const checkedCount = group.items.filter((i) => selectedIds.has(i.id)).length;
  const allChecked =
    group.items.length > 0 && checkedCount === group.items.length;
  const someChecked = checkedCount > 0;
  const checkState: CheckState =
    someChecked && !allChecked ? "indeterminate" : allChecked;

  return (
    <Collapsible
      defaultOpen={defaultExpanded}
      className="rounded-lg border border-border bg-card/60 overflow-hidden"
    >
      <div className="flex items-center px-3 py-2.5 hover:bg-muted/30 transition-colors">
        <TreeCheckbox
          className="mr-2"
          checked={checkState}
          onCheckedChange={(val) => {
            const ids = group.items.map((i) => i.id);
            onToggleGroup(ids, val);
          }}
        />

        <CollapsibleTrigger className="group/trigger flex flex-1 items-center gap-2 text-left cursor-pointer select-none outline-none rounded-sm focus-visible:ring-1 focus-visible:ring-ring/50">
          <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]/trigger:rotate-90" />
          <span className="text-sm font-medium">{group.label}</span>
          <span className="text-xs text-muted-foreground ml-auto tabular-nums">
            {checkedCount}/{group.items.length}
          </span>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent>
        <div className="border-t border-border/50 py-1 pl-9 pr-2">
          {group.items.map((item) => (
            <TreeItem
              key={item.id}
              item={item}
              checked={selectedIds.has(item.id)}
              onToggle={onToggleItem}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

/* ──────── Main: ChronoTree ──────── */

function ChronoTree({
  groups,
  selectedIds,
  onToggleItem,
  onToggleGroup,
  onToggleAll,
  selectAllLabel = "Seleccionar todo",
  countLabel,
  emptyMessage = "Sin elementos disponibles",
  defaultExpanded = false,
  className,
}: ChronoTreeProps) {
  const allItemIds = React.useMemo(
    () => groups.flatMap((g) => g.items.map((i) => i.id)),
    [groups],
  );

  const selectedCount = allItemIds.filter((id) => selectedIds.has(id)).length;
  const allChecked =
    allItemIds.length > 0 && selectedCount === allItemIds.length;
  const someChecked = selectedCount > 0;
  const selectAllState: CheckState =
    someChecked && !allChecked ? "indeterminate" : allChecked;

  if (!groups.length) {
    return (
      <div className="text-sm text-muted-foreground py-4 text-center">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {onToggleAll && (
        <div
          role="checkbox"
          aria-checked={
            selectAllState === "indeterminate"
              ? "mixed"
              : selectAllState === true
          }
          tabIndex={0}
          onClick={() => onToggleAll(!allChecked)}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              onToggleAll(!allChecked);
            }
          }}
          className="flex items-center gap-2.5 px-1 py-1 cursor-pointer select-none rounded-md hover:bg-muted/50 transition-colors"
        >
          <TreeCheckbox
            checked={selectAllState}
            onCheckedChange={(val) => onToggleAll(val)}
          />
          <span className="text-sm font-semibold">{selectAllLabel}</span>
          <span className="text-xs text-muted-foreground ml-auto tabular-nums">
            {selectedCount}/{allItemIds.length}
            {countLabel ? ` ${countLabel}` : ""}
          </span>
        </div>
      )}

      <div className="space-y-2">
        {groups.map((group) => (
          <TreeGroupNode
            key={group.id}
            group={group}
            selectedIds={selectedIds}
            onToggleItem={onToggleItem}
            onToggleGroup={onToggleGroup}
            defaultExpanded={defaultExpanded}
          />
        ))}
      </div>
    </div>
  );
}

export { ChronoTree };
