USE employee_db;

SELECT
    *
FROM
    department;

SELECT
    roles.id,
    roles.title,
    roles.salary,
    department.department_name AS department
FROM
    roles
LEFT JOIN department
ON roles.department_id = department.id;

SELECT 
employee.id, employee.first_name, employee.last_name, roles.title, department.department_name AS department, 
roles.salary, CONCAT(manager_employee.first_name, ' ', manager_employee.last_name) AS manager
FROM employee 
INNER JOIN roles 
ON employee.role_id = roles.id
INNER JOIN department 
ON roles.department_id = department.id
LEFT JOIN employee manager_employee
ON manager_employee.id = employee.manager_id;

insert into deparment (department_name) values "apple";


