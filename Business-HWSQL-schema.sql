DROP DATABASE IF EXISTS BusinessDB;
CREATE database BusinessDB;

USE BusinessDB;

CREATE TABLE department (
  id INT auto_increment NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id  INT auto_increment NOT NULL,
  title VARCHAR(30),
  salary DECIMAL(10,2),
  department_id  INT references department(id),
  primary key (id)
);

CREATE TABLE employee (
id INT auto_increment NOT NULL,
first_name  VARCHAR(30),
last_name  VARCHAR(30),
role_id  INT references role(id),
manager_id INT references employee(id),
PRIMARY KEY (id)
);

insert INTO department (name) values ("MARKETING"), ("ACCOUNTING"), ("MANUFACTURING");
insert INTO role (title, salary, department_id) values ("manager", 65000.00, 1), ("assistant manager", 50000.00,1), ("field operative", 45000.00,1), ("manager", 80000.00,2), ("accountant", 60000.00,2);
insert INTO role (title, salary, department_id) values ("manager", 60000.00,3), ("production", 40000.00,3);
insert INTO employee (first_name,last_name, role_id) values ("Andre", "Barreto", 1);
insert INTO employee (first_name,last_name, role_id, manager_id) values ("Huguette", "Charles", 2, 1);
insert INTO employee (first_name, last_name, role_id) values ("Shannon","Erni", 4,);
insert INTO employee (first_name, last_name, role_id, manager_id) values ("Scott", "Begg", 7, 4);






