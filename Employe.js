// app.js

// 1. Import the built-in 'readline' module to handle command-line input
const readline = require('readline');

// 2. Configure the readline interface to read from standard input and write to standard output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 3. Initialize an in-memory array to store employee data
let employees = [];

/**
 * Displays the main menu and prompts the user for an action.
 */
function showMenu() {
  console.log('\n--- 🏢 Employee Management System ---');
  console.log('1. Add a new employee');
  console.log('2. List all employees');
  console.log('3. Remove an employee');
  console.log('4. Exit');
  console.log('------------------------------------');

  rl.question('Choose an option (1-4): ', (option) => {
    // Route to the correct function based on user input
    switch (option) {
      case '1':
        addEmployee();
        break;
      case '2':
        listEmployees();
        break;
      case '3':
        removeEmployee();
        break;
      case '4':
        console.log('Goodbye! 👋');
        rl.close(); // Close the readline interface and exit the program
        break;
      default:
        console.log('❌ Invalid option. Please enter a number between 1 and 4.');
        showMenu(); // Show the menu again
        break;
    }
  });
}

/**
 * Prompts for new employee details (ID and name) and adds them to the array.
 */
function addEmployee() {
  rl.question('Enter employee ID: ', (id) => {
    rl.question('Enter employee name: ', (name) => {
      // Create an employee object and add it to the array
      employees.push({ id, name });
      console.log(`✅ Employee "${name}" added successfully!`);
      showMenu(); // Return to the main menu
    });
  });
}

/**
 * Displays all employees currently stored in the array.
 */
function listEmployees() {
  if (employees.length === 0) {
    console.log('ℹ️ No employees found. The list is empty.');
  } else {
    console.log('\n--- 📜 Employee List ---');
    // Loop through the array and print each employee's details
    employees.forEach(emp => {
      console.log(`ID: ${emp.id}, Name: ${emp.name}`);
    });
  }
  showMenu(); // Return to the main menu
}

/**
 * Prompts for an employee ID and removes the corresponding employee from the array.
 */
function removeEmployee() {
  rl.question('Enter the ID of the employee to remove: ', (id) => {
    // Find the index of the employee with the given ID
    const index = employees.findIndex(emp => emp.id === id);

    if (index !== -1) {
      // Use splice() to remove the employee from the array
      const removedEmployee = employees.splice(index, 1);
      console.log(`🗑️ Employee "${removedEmployee[0].name}" removed successfully!`);
    } else {
      console.log('❌ Employee with that ID was not found.');
    }
    showMenu(); // Return to the main menu
  });
}

// Initial call to start the application
console.log('Welcome to the Employee Management CLI!');
showMenu();
