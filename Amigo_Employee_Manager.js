var mysql = require("mysql");
var inquirer = require("inquirer");
const password = require("./private");
var table = require("console.table");

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
      choices: ["VIEW", "ADD", "CHANGE", "EXIT"]
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
        "View employees by department",
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "View all employees":
        employeeSearch();
        break;

      case "View all employees by department":
        employeeByDepartmentSearch();
        break;

      case "View all departments":
        departmentSearch();
        break;

      case "View all roles":
        rolesSearch();
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

// Function that shows all departments
function departmentSearch() {
    var query = "SELECT * FROM businessdb.department";
    connection.query(query, function(err, res) {
   
      console.table(res);
      })
      start();
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

  

// function to let user chose what information they would like to view
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

function bidAuction() {
  // query the database for all items being auctioned
  connection.query("SELECT * FROM auctions", function(err, results) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].item_name);
            }
            return choiceArray;
          },
          message: "What auction would you like to place a bid in?"
        },
        {
          name: "bid",
          type: "input",
          message: "How much would you like to bid?"
        }
      ])
      .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].item_name === answer.choice) {
            chosenItem = results[i];
          }
        }

        // determine if bid was high enough
        if (chosenItem.highest_bid < parseInt(answer.bid)) {
          // bid was high enough, so update db, let the user know, and start over
          connection.query(
            "UPDATE auctions SET ? WHERE ?",
            [
              {
                highest_bid: answer.bid
              },
              {
                id: chosenItem.id
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("Bid placed successfully!");
              start();
            }
          );
        }
        else {
          // bid wasn't high enough, so apologize and start over
          console.log("Your bid was too low. Try again...");
          start();
        }
      });
  });
}
