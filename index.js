const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "lunaisadog1223",
  database: "employee_db",
});

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
      break;

    case "View all employees":
      break;

    case "Add a department":
      break;

    case "Add a role":
      break;

    case "Add an employee":
      break;

    case "Update an employee role":
      break;

    case "Exit":
      break;

    default:
      break;
  }
}

async function viewAllDepartments() {
  let query = "SELECT * FROM department;";
  let [departments] = await db.promise().query(query);
  return departments;
}

async function init() {
  //   inquirer.prompt(questions).then((answers) => {
  //     answers.license = licenses[answers.license];
  //     writeToFile("output/README.md", answers);
  //     return menu();
  //   });
  await menu();
}
// Function call to initialize app
init();
