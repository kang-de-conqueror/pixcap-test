# Pixcap Test

This is an assignment from PixCap using Typescript

## Requirements

Giving the following interface:

```js
interface Employee {
  uniqueId: number;
  name: string;
  subordinates: Employee[];
}

const ceo: Employee = {
  uniqueId: 1
  name: Mark Zuckerberg,
  subordinates: [Employee, Employee,...]
}

```

Write a TypeScript program to fulfill the following requirements:

- Develop a specific class named EmployeeOrgApp that adheres to the IEmployeeOrgApp interface. This class should be able to be instantiated with the CEO as a constructor parameter.
- This class should include three functions:
  - Move employee A to become the subordinate of employee B.
  - Undo the move action.
  - Redo the move action.

## Assumptions

- When an employee (e.g. Bob Saget) is moved to a new supervisor (e.g. Georgina), Bob's existing subordinates (Tina Teff) will become the subordinate of Cassandra, Bob's old supervisor.
- Employees without any subordinates have an empty list for their subordinates property
- Do not clone the state/tree during each action (move/undo/redo).

## Usage
1. Clone this project
2. Run command `npm install` for installing dependencies
3. Run command `npm test` for testing
