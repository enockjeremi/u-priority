
export interface IWorkspaces {
    id: number;
    name: string;
    tasks: ITask[];
  }
  
  export interface ITask {
    id?: number;
    name?: string;
    description?: string;
    status: IStatus;
    priority: IPriority;
  }
  
  export interface IPriority {
    id?: number;
    priority?: string;
  }
  
  export interface IStatus {
    id?: number;
    status?: string;
  }