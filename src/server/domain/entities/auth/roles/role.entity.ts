export interface IRoleEntity {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
    createdAt: Date;
}

export interface IRoleDetailEntity extends IRoleEntity {
    actions: IRoleActionEntity[];
}

export interface IRoleActionEntity {
    id: string;
    name: string;
    resource: {
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
