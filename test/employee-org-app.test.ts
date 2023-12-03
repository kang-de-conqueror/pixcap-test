import { ceo } from "../src/constants";
import EmployeeOrgApp from "../src/employee-org-app";
import { IEmployee } from "../src/interfaces";

describe("EmployeeOrgApp", () => {
  let orgApp: EmployeeOrgApp;
  let root: IEmployee;

  beforeEach(() => {
    root = JSON.parse(JSON.stringify(ceo));
    orgApp = new EmployeeOrgApp(root);
  });

  test("should move employee correctly", () => {
    orgApp.move(5, 11);
    expect(orgApp["employeesRelation"][5].supervisor!.uniqueId).toBe(11);
    expect(orgApp["employeesRelation"][6].supervisor!.uniqueId).toBe(3);
  });

  test("should undo and redo correctly", () => {
    orgApp.move(5, 11);
    expect(orgApp["employeesRelation"][6].supervisor!.uniqueId).toBe(3);

    orgApp.undo();
    expect(orgApp["employeesRelation"][5].supervisor!.uniqueId).toBe(3);

    orgApp.redo();
    expect(orgApp["employeesRelation"][5].supervisor!.uniqueId).toBe(11);
  });

  test("should undo and redo more precise and complex", () => {
    orgApp.move(14, 10);
    expect(orgApp["employeesRelation"][15].supervisor!.uniqueId).toBe(1);

    orgApp.move(9, 11);
    expect(orgApp["employeesRelation"][10].supervisor!.uniqueId).toBe(8);

    orgApp.move(5, 2);
    expect(orgApp["employeesRelation"][6].supervisor!.uniqueId).toBe(3);

    orgApp.undo();
    orgApp.undo();

    orgApp.move(5, 11);

    const originalConsoleError = console.error;
    const errorMock = jest.fn();
    console.error = errorMock;
    orgApp.redo();
    console.error = originalConsoleError;
    expect(errorMock).toHaveBeenCalledWith('Nothing to redo!');
    expect(orgApp["employeesRelation"][9].supervisor!.uniqueId).toBe(8);
  });
});
