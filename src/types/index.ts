import { IEmployee } from "../interfaces";

export type TEmployeeRelation = {
  employee: IEmployee;
  supervisor: IEmployee | null;
};

export type TMoveHistory = {
  movedEmployee: IEmployee;
  oldSupervisor: IEmployee;
  newSupervisor: IEmployee;
  oldSubordinates: IEmployee[];
}
