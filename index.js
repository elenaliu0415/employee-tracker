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

async function getDepartments() {
    
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
    ON roles.department_id = department.id;`;
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
  ON manager_employee.id = employee.manager_id;`;
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

    // const updateTripsSql = `UPDATE trips SET ? WHERE ?;`;
    // await db
    //   .promise()
    //   .query(updateTripsSql, [
    //     { trip_date: date, destination },
    //     { id: trip.id },
    //   ]);
    // console.log("Update success.");
}

async function addRole () {
    const answer = await inquirer.prompt({
        type: "input",
        message: "Please enter a new department name: ",
        name: "depName",
    });
    const query = `INSERT INTO department (department_name)
    VALUES ?;`;
    await db.promise().query(query, [[answer.depName]]);
}

async function addEmployee() {
    const questions = [
    {
        type: "input",
        message: "Please enter a new department name: ",
        name: "depName",
    }
    ];
    const answer = await inquirer.prompt(questions);
    const query = `INSERT INTO department (first_name, last_name, role_id, )
    VALUES ?;`;
    await db.promise().query(query, [[answer.depName]]);
}

async function updateEmployee() {

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
