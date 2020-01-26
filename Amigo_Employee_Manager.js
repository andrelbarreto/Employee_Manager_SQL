// This is a very old school, all in one file code approach despite being fully aware of recomendations to use the same folder
// file parsing system from previous homework. Consider this a test of this approach vs the one currently presented.
// I appreciate the extra work in checking this code and the understanding for what went kaput

var mysql = require("mysql");
var inquirer = require("inquirer");
const password = require("./private");
var table = require("console.table");
var figlet = require('figlet');


// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // username to use
  user: "root",

  //  password and database to use
  password: password,
  database: "BusinessDB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  //old school style ASCII intro to app
   figlet('Business Manager', function(err, data) {
     if (err) {
         console.log('Something went wrong...');
        console.dir(err);
     return;
     }
     console.log(data)
   });
  // run the start function after the connection is made to prompt the user
  start();
});

 


// function which prompts the user for what action they should take - VIEW, ADD or CHANGE
function start() {
  inquirer
    .prompt({
      name: "viewOrAdd",
      type: "list",
      message: "Would you like to [VIEW] information, [ADD] information or [CHANGE] information from business databases?",
      choices: ["VIEW", "ADD", "CHANGE", "EXIT", " "]
    })
    .then(function(answer) {
      // based on their answer,  call the right functions
      if (answer.viewOrAdd === "VIEW") {
        ViewInformation();
      }
      else if(answer.viewOrAdd === "ADD") {
        AddInformation();
      } 
      else if(answer.viewOrAdd === "CHANGE") {
        ChangeInformation();
      }
      else{
        connection.end();
      }
    });
}


// prompts user to chose what specific information they would like to view
function ViewInformation() {
    inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "View all employees",
        "View all departments",
        "View all roles",
        "View employees by manager",
        "View employees by department"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "View all employees":
        employeeSearch();
        break;

      case "View all employees by manager":
        employeeByManagerSearch();
        break;

      case "View all departments":
        departmentSearch();
        break;

      case "View all roles":
        rolesSearch();
        break;

        case "View employees by department":
          employeeByDepartmentSearch();
          break;
      }
    });
}


// prompts user to chose what they would like to add : an employee, a department or role informatiom
function AddInformation() {
    inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to Add?",
      choices: [
        "Add an employee",
        "Add a department",
        "Add a role",
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "Add a department":
            departmentAdd();
            break;
    
          case "Add a role":
            roleAdd();
            break;
    
          case "Add an employee":
            employeeAdd();
            break;
      }
    });
}

// Function that shows all the roles
function rolesSearch() {
    var query = "SELECT * FROM businessdb.role LEFT JOIN businessdb.department ON role.department_id = department.id "
   // var query = "SELECT * FROM businessdb.role";
    connection.query(query, function(err, res) {
      console.table(res);
      start();
    });
  }


  // beginning stages of employee search decided by managers, using classes
  async function employeeByManagerSearch(){
    //let managers;
    //let managerList;
    console.log(" Coming up soon on version 2.0 of this app ");
    console.log("We appreciate your business.");
    // await business_db.getManagerNames()
    // .then(res=>{
    //     managers = res; 
    //     managerList = managers.map(e => e.name);                    
    //     managerList.push("Cancel");                        
    // });           
                 
    // await inquirer.prompt({
    //     message:"Choose a manager:",
    //     type: "list",
    //     choices: managerList,
    //     name: "choice"
    // }).then(async function(answer){
    //     switch (answer.choice){
    //     case "Cancel":
    //        // should return to previous choices
    //         break;
    //     default:
    //         //looks up right manager from list created by getManagerNames
    //         manager = managers.find(e => e.name === answer.choice);
    //         await business_db.getEmployeesByManager(manager).then(res=>{
    //             dispayResults(res);
    //         });
    //         break;
    //     }
        
    // });
    start();
}



  //upcoming function to search employees by department
  function employeeByDepartmentSearch() {
    console.log("Coming soon on version 2.0 of this app !!");
    start();
  }

// Function that shows all departments
function departmentSearch() {
    var query = "SELECT * FROM businessdb.department";
    connection.query(query, function(err, res) {
   
      console.table(res);
      start();
      })
 //   });
  }

  function employeeSearch() {
    var query = "SELECT * FROM businessdb.employee LEFT JOIN businessdb.role ON employee.role_id = role.id "
    query += "LEFT JOIN businessdb.department ON role.department_id = department.id "
    query += "LEFT JOIN businessdb.employee manager ON employee.manager_id = manager.id";
    connection.query(query, function(err, res) {
      console.table(res); // shows all values on joined tables
      start(); // re-prompts user to main inquirer  choices
    })
  }
  

  // function to let user chose what information they would like to view
function departmentAdd() {
  // prompt for info about the employee. first name, last name, their job id and if they have a manager that employee's ID
  inquirer
    .prompt([
      {
        name: "deptName",
        type: "input",
        message: "What is the name of the department to add ?"
      },
    ])
    .then(function(answer) {
      // when finished prompting, insert a new department with that info, ID should be created automatically
        "INSERT INTO department SET ?",
        {
          name: answer.deptName,
        },
        function(err) {
          if (err) throw err;
          console.log("Your department was added successfully!");
          // re-prompt the user for what they would like to do next in the database
          start();
        }
      
    });
    // if anything does go wrong, re-prompts the user with main inquirer
   // start();
}

  

// function to let user add an employee
function employeeAdd() {
  // prompt for info about the employee. first name, last name, their job id and if they have a manager that employee's ID
  inquirer
    .prompt([
      {
        name: "First_Name",
        type: "input",
        message: "What is the first name of the employee to add ?"
      },
      {
        name: "Last_Name",
        type: "input",
        message: "What is the last name of the employee to add ?"
      },
      {
        name: "RoleId",
        type: "input",
        message: "What is the id for their job title?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
        {
          name: "ManagerId",
          type: "input",
          message: "If this employee has a manager please enter their ID Number, if not press ENTER: ",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
      }
    ])
    .then(function(answer) {
      // when finished prompting, insert a new employee with that info
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.First_Name,
          last_name: answer.Last_Name,
          role_id: answer.RoleId || 1,
          manager_id: answer.ManagerId || null
        },
        function(err) {
          if (err) throw err;
          console.log("Your employee was added successfully!");
          // re-prompt the user for what they would like to do next in the database
          start();
        }
      );
    });
    // if anything does go wrong, re-prompts the user with main inquirer
    start();
}


// function to let user add a new job/role
function roleAdd() {
  // prompt for info about job/role to add. first name, last name, their job id and if they have a manager that employee's ID
  inquirer
    .prompt([
      {
        name: "jobTitle",
        type: "input",
        message: "What is the title name for this job ?"
      },
      {
        name: "salaryValue",
        type: "input",
        message: "What is the annual salary for this position in the Business ?"
      },
      {
        name: "deptId",
        type: "input",
        message: "What is the id of the department this position belongs to ?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }  
      
    ])
    .then(function(answer) {
      // when finished prompting, insert a new role/job title with that info in the corresponding database
      connection.query(
        "INSERT INTO role SET ?",
        {
          title: answer.jobTitle,
          salary: answer.salaryValue,
          department_id: answer.deptId || 1,
        },
        function(err) {
          if (err) throw err;
          console.log("Your new department was added successfully!");
          // re-prompt the user for what they would like to do next in the database
          start();
        }
      );
    });
}


// Yes, I am aware this last function is not working yet, so beware... until version 2.0

function ChangeInformation() {

  // let's start off by making this function a litte fun shall we ? De mada!
  // a little ASCII message
  figlet('Presto', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
       console.dir(err);
    return;
    }
    console.log(data)
  });
  // and a little magic clothes change...
  console.log(" Pronto! Your employee changed clothes!! Now, let's presto change their info ?"); 
  // before the serious inquiry about which employee to chage information
  inquirer
  .prompt([
  {
    name: "Employee_firstname",
    type: "input",
    message: "What is the First name of the employee you would like to change the information ?",
    
  },  
  {
    name: "Employee_lasttname",
    type: "input",
    message: "What is the last name of the employee you would like to change the information ?",
    
    } 
  ])
    .then(function(answer) {
      var fullname = res.Employee_firstname + " " + res.Employee_lastname;
      // when finished prompting, concatenate fields on database and inputs into fullnames
      connection.query(
        "SELECT CONCAT(FirstName, ' ', LastName) As FullName FROM Employee",
        function checkemployee() {
          if ( fullname == employeeAdd.Fullname) {
            console.log(" Employee exists and already changed clothes! presto!");

          } else {
            console.log("booo... we couldn't find that employee");
          }
        },
        function(err) {
          if (err) throw err;
          console.log("Your employee looks good!");
          // re-prompt the user for what they would like to do next in the database
          start();
        }
        );
    });
   }
    
   // if (concatenate(res.Employee_firstname, res.Employee_lastname) == concatenate(employee.first_name, employee.lastname), {
     
     




