import type { IActionGroupEntity, IActionItemEntity } from "@/server/domain";

/** Build a flat map of actionId → IActionItemEntity for quick lookup */
export function buildActionMap(
  groups: IActionGroupEntity[],
): Map<string, IActionItemEntity> {
  const map = new Map<string, IActionItemEntity>();
  if (!Array.isArray(groups)) return map;
  for (const group of groups) {
    for (const action of group.actions ?? []) {
      map.set(action.id, action);
    }
  }
  return map;
}

/** Get all action IDs that directly or transitively depend on the given action */
export function getDependents(
  actionId: string,
  groups: IActionGroupEntity[],
): string[] {
  const dependents: string[] = [];
  if (!Array.isArray(groups)) return dependents;
  for (const group of groups) {
    for (const action of group.actions ?? []) {
      if (action.dependsOnId === actionId) {
        dependents.push(action.id);
        dependents.push(...getDependents(action.id, groups));
      }
    }
  }
  return dependents;
}

/** Add an action and auto-select its dependencies (recursive) */
export function addWithDependencies(
  actionId: string,
  selected: Set<string>,
  actionMap: Map<string, IActionItemEntity>,
): Set<string> {
  const newSelected = new Set(selected);
  newSelected.add(actionId);

  const action = actionMap.get(actionId);
  if (action?.dependsOnId && !newSelected.has(action.dependsOnId)) {
    return addWithDependencies(action.dependsOnId, newSelected, actionMap);
  }

  return newSelected;
}

/** Remove an action and auto-unselect all actions that depend on it */
export function removeWithDependents(
  actionId: string,
  selected: Set<string>,
  groups: IActionGroupEntity[],
): Set<string> {
  const newSelected = new Set(selected);
  newSelected.delete(actionId);

  const dependents = getDependents(actionId, groups);
  for (const dep of dependents) {
    newSelected.delete(dep);
  }

  return newSelected;
}

/** Format action name for display: VER_USUARIOS → Ver usuarios */
export function formatActionName(name: string): string {
  return name
    .split("_")
    .map((word, index) =>
      index === 0
        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        : word.toLowerCase(),
    )
    .join(" ");
}
