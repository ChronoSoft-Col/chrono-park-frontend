"use client";

import * as React from "react";
import type { IActionGroupEntity } from "@/server/domain";
import {
  ChronoTree,
  type ChronoTreeGroup,
} from "@chrono/chrono-tree.component";
import {
  buildActionMap,
  addWithDependencies,
  removeWithDependents,
  formatActionName,
} from "./actions-tree.utils";

interface Props {
  actionGroups: IActionGroupEntity[];
  selectedActionIds: string[];
  onChange: (actionIds: string[]) => void;
}

export function ActionsTree({ actionGroups, selectedActionIds, onChange }: Props) {
  const selectedSet = React.useMemo(
    () => new Set(selectedActionIds),
    [selectedActionIds],
  );

  const actionMap = React.useMemo(
    () => buildActionMap(actionGroups),
    [actionGroups],
  );

  const treeGroups: ChronoTreeGroup[] = React.useMemo(
    () =>
      (actionGroups ?? []).map((group) => ({
        id: group.resourceId,
        label: group.resourceName,
        items: (group.actions ?? []).map((action) => {
          const dep = action.dependsOnId
            ? actionMap.get(action.dependsOnId)
            : undefined;
          return {
            id: action.id,
            label: formatActionName(action.name),
            hint: dep ? `requiere ${formatActionName(dep.name)}` : undefined,
          };
        }),
      })),
    [actionGroups, actionMap],
  );

  const handleToggleItem = React.useCallback(
    (itemId: string, checked: boolean) => {
      const newSelected = checked
        ? addWithDependencies(itemId, selectedSet, actionMap)
        : removeWithDependents(itemId, selectedSet, actionGroups);
      onChange(Array.from(newSelected));
    },
    [selectedSet, actionMap, actionGroups, onChange],
  );

  const handleToggleGroup = React.useCallback(
    (itemIds: string[], checked: boolean) => {
      let newSelected = new Set(selectedSet);
      for (const id of itemIds) {
        newSelected = checked
          ? addWithDependencies(id, newSelected, actionMap)
          : removeWithDependents(id, newSelected, actionGroups);
      }
      onChange(Array.from(newSelected));
    },
    [selectedSet, actionMap, actionGroups, onChange],
  );

  const handleToggleAll = React.useCallback(
    (checked: boolean) => {
      if (checked) {
        const allIds = (actionGroups ?? []).flatMap((g) =>
          (g.actions ?? []).map((a) => a.id),
        );
        onChange(allIds);
      } else {
        onChange([]);
      }
    },
    [actionGroups, onChange],
  );

  return (
    <ChronoTree
      groups={treeGroups}
      selectedIds={selectedSet}
      onToggleItem={handleToggleItem}
      onToggleGroup={handleToggleGroup}
      onToggleAll={handleToggleAll}
      countLabel="permisos"
      emptyMessage="No hay acciones disponibles"
    />
  );
}
