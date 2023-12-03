import { IEmployee, IEmployeeOrgApp } from "./interfaces";
import { TEmployeeRelation, TMoveHistory } from "./types";

class EmployeeOrgApp implements IEmployeeOrgApp {
  employeesRelation: {
    [key: number]: TEmployeeRelation;
  } = {};
  movedHistory: TMoveHistory[] = [];
  historyIndex = 1;

  constructor(ceo: IEmployee) {
    this.movedHistory.push({
      movedEmployee: ceo,
      oldSupervisor: ceo,
      newSupervisor: ceo,
      oldSubordinates: [],
    });
    this.employeesRelation[ceo.uniqueId] = {
      employee: ceo,
      supervisor: null,
    };

    const q: IEmployee[] = [ceo];
    while (q.length > 0) {
      const employee = q.shift();

      for (const sub of employee?.subordinates!) {
        this.employeesRelation[sub.uniqueId] = {
          employee: sub,
          supervisor: employee!,
        };
      }

      q.push(...employee?.subordinates!);
    }
  }

  move(employeeId: number, supervisorId: number): void {
    const { employee, supervisor } = this.employeesRelation[employeeId];
    const newSupervisor = this.employeesRelation[supervisorId].employee;

    const move: TMoveHistory = {
      movedEmployee: employee,
      oldSupervisor: supervisor!,
      newSupervisor: newSupervisor,
      oldSubordinates: employee.subordinates,
    };

    this.moveEmployee(employee, newSupervisor);

    if (this.historyIndex > 1) {
      this.movedHistory.splice((this.historyIndex - 1) * -1);
      this.historyIndex = 1;
    }

    this.movedHistory.push(move);
  }

  private moveEmployee(employee: IEmployee, newSupervisor: IEmployee) {
    const employeeRelation = this.employeesRelation[employee.uniqueId];
    const currentSupervisor = employeeRelation.supervisor;

    if (currentSupervisor === null) {
      console.error("Cannot move root employee");
      return;
    }

    for (const sub of employee.subordinates) {
      const subRelation = this.employeesRelation[sub.uniqueId];
      subRelation.supervisor = currentSupervisor;
      currentSupervisor.subordinates.push(sub);
    }

    employee.subordinates = [];

    this.addEmployee(employee, newSupervisor);
  }

  private addEmployee(employee: IEmployee, supervisor: IEmployee) {
    const employeeRelation = this.employeesRelation[employee.uniqueId];

    this.removeEmployee(employee, employeeRelation.supervisor!);

    employeeRelation.supervisor = supervisor;
    supervisor.subordinates.push(employee);
  }

  private removeEmployee(employee: IEmployee, supervisor: IEmployee) {
    const subIdx = supervisor.subordinates.indexOf(employee);
    supervisor.subordinates.splice(subIdx, 1);
  }

  undo(): void {
    if (this.movedHistory.length <= this.historyIndex) {
      console.error("Nothing to undo!");
      return;
    }

    const { movedEmployee, oldSupervisor, oldSubordinates } =
      this.movedHistory[this.historyIndex * -1 + this.movedHistory.length];

    this.moveEmployee(movedEmployee, oldSupervisor);

    for (const oldSub of oldSubordinates) {
      this.addEmployee(oldSub, movedEmployee);
    }

    this.historyIndex++;
  }

  redo(): void {
    if (this.historyIndex === 1) {
      console.error("Nothing to redo!");
      return;
    }

    const { movedEmployee, newSupervisor } =
      this.movedHistory[
        (this.historyIndex - 1) * -1 + this.movedHistory.length
      ];

    this.moveEmployee(movedEmployee, newSupervisor);

    this.historyIndex--;
  }
}

export default EmployeeOrgApp;
