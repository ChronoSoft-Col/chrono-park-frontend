export interface IRoleEntity {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
    createdAt: Date;
}

export interface IRoleDetailEntity extends IRoleEntity {
    roleActions: IRoleActionJunction[];
}

export interface IRoleActionJunction {
    id: string;
    actionId: string;
    action: IRoleActionEntity;
}

export interface IRoleActionEntity {
    id: string;
    name: string;
    resourceId?: string;
    dependsOnId?: string | null;
    resource?: {
        id: string;
        name: string;
        icon: string;
        application: {
            id: string;
            name: string;
        };
    };
}

export interface IActionGroupEntity {
    resourceId: string;
    resourceName: string;
    actions: IActionItemEntity[];
}

export interface IActionItemEntity {
    id: string;
    name: string;
    dependsOnId: string | null;
}
