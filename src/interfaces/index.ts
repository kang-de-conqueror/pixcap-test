export interface IEmployee {
  uniqueId: number;
  name: string;
  subordinates: IEmployee[];
}

export interface IEmployeeOrgApp {
  move(employeeId: number, supervisorId: number): void;
  undo(): void;
  redo(): void;
}
