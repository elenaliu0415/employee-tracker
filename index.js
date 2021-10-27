const inquirer = require("inquirer");
const mysql = require("mysql2");
const table = require("console.table");
const art = require("ascii-art");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "lunaisadog1223",
  database: "employee_db",
});

init();

async function menu() {
  const answer = await inquirer.prompt({
    type: "list",
    message: "What would you like to do?",
    name: "menu",
    choices: [
      "View all departments",
      "View all roles",
      "View all employees",
      "Add a department",
      "Add a role",
      "Add an employee",
      "Update an employee role",
      "Exit",
    ],
  });
  console.log(answer);
  switch (answer.menu) {
    case "View all departments":
      let departments = await viewAllDepartments();
      console.table(departments);
      return menu();

    case "View all roles":
      let roles = await viewAllRoles();
      console.table(roles);
      return menu();

    case "View all employees":
      let employee = await viewAllEmployee();
      console.table(employee);
      return menu();

    case "Add a department":
        await addDepartment();
    return menu();

    case "Add a role":
        await addRole();
    return menu();

    case "Add an employee":
        await addEmployee();
    return menu();

    case "Update an employee role":
        await updateEmployee();
    return menu();

    case "Exit":
      db.end();

    default:
      break;
  }
}

async function viewAllDepartments() {
  const query = "SELECT * FROM department;";
  const [departments] = await db.promise().query(query);
  return departments;
}

async function viewAllRoles() {
  const query = `SELECT
    roles.id,
    roles.title,
    roles.salary,
    department.department_name AS department
    FROM
    roles
    LEFT JOIN department
    ON roles.department_id = department.id
    ORDER BY roles.id;`;
  const [roles] = await db.promise().query(query);
  return roles;
}

async function viewAllEmployee() {
  const query = `SELECT 
  employee.id, employee.first_name, employee.last_name, roles.title, department.department_name AS department, 
  roles.salary, CONCAT(manager_employee.first_name, ' ', manager_employee.last_name) AS manager
  FROM employee 
  INNER JOIN roles 
  ON employee.role_id = roles.id
  INNER JOIN department 
  ON roles.department_id = department.id
  LEFT JOIN employee manager_employee
  ON manager_employee.id = employee.manager_id
  ORDER BY employee.id;`;
  const [employee] = await db.promise().query(query);
  return employee;
}

async function addDepartment () {
    const answer = await inquirer.prompt({
        type: "input",
        message: "Please enter a new department name: ",
        name: "depName",
    });
    const query = `INSERT INTO department (department_name)
    VALUES ?;`;
    await db.promise().query(query, [[answer.depName]]);
}

// async function addRole () {
//     const answer = await inquirer.prompt({
//         type: "input",
//         message: "Please enter a new department name: ",
//         name: "depName",
//     });
//     const query = `INSERT INTO department (department_name)
//     VALUES ?;`;
//     await db.promise().query(query, [[answer.depName]]);
// }

async function getEmployees() {
    const query = `SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS name
    FROM employee ORDER BY employee.id;`;
    const [employees] = await db.promise().query(query);
    return employees;
}

async function addEmployee() {
    const roles = await viewAllRoles();
    const employees = await getEmployees();
    const questions = [
    {
        type: "input",
        message: "Please enter your first name: ",
        name: "firstName",
    },
    {
        type: "input",
        message: "Please enter your last name: ",
        name: "lastName",
    },
    {
        type: "list",
        message: "What is your role? ",
        name: "role",
        choices: roles.map(role => {return {name: role.title, value: role.id}})
    },
    {
        type: "list",
        message: "Who is your manager? ",
        name: "manager",
        choices: [{name: 'None', value: 'null'}, ...employees.map(employee => {return {name: employee.name, value: employee.id}})]
    },
    ];
    const answers = await inquirer.prompt(questions);
    const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES (?);`;
    db.promise().query(query, [[answers.firstName, answers.lastName, answers.role, answers.manager]]);
}

async function updateEmployee() {
    const roles = await viewAllRoles();
    const employees = await getEmployees();
    const questions = [
        {
            type: "list",
            message: "Which employee do you want to update? ",
            name: "employee",
            choices: [{name: 'None', value: 'null'}, ...employees.map(employee => {return {name: employee.name, value: employee.id}})]
        },
        {
            type: "list",
            message: "What is this employee's new role?",
            name: "role",
            choices: roles.map(role => {return {name: role.title, value: role.id}})
        }
    ];
    const answers = await inquirer.prompt(questions);
    const query = `UPDATE employee SET ? WHERE ?;`;
    db.promise().query(query, [{role_id: answers.role}, {id: answers.employee}]);
}


async function init() {
  try {
    const rendered = await art.font("Employee Tracker", "doom").completed();
    console.log(rendered);
    return menu();
  } catch (err) {
    console.log(err);
  }
  //   await menu();
}
