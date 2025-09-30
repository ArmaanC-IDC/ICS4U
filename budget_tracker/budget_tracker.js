const prompt = require("prompt-sync")();

let expenses = [];
let budget = 0;

const addExpenses = (amount, category) => {
    expenses.push({amount, category});
}

const calculateTotal = () => {
    return expenses.reduce((prevValue, value) => prevValue + value.amount, 0);
}

const checkBudget = () => {
    return calculateTotal() > budget;
}

const removeExpense = (category) => {
    let index = expenses.findIndex((element) => element.category==category);
    console.log(index);
    expenses.splice(index, 1);
}

const getNumberInput = (inputString, minVal = Number.MIN_SAFE_INTEGER, maxVal = Number.MAX_SAFE_INTEGER) => {
    let input = Number(prompt(inputString));
    while (isNaN(input) || input>maxVal | input<minVal) {
        console.log("Invalid number. Please enter again");
        input = Number(prompt(inputString));
    }
    return input;
}

budget = getNumberInput("What is the budget? ");

while (true) {
    console.log("Expenses: ", JSON.stringify(expenses));
    console.log();
    console.log("-----------------------------------------------");
    console.log("Please pick an action: ");
    console.log(" - 1: Add an expense");
    console.log(" - 2: View total expenses");
    console.log(" - 3: Check budget");
    console.log(" - 4: Remove an expense");
    console.log(" - 5: Exit the program")

    let input = getNumberInput("Pick an option:", 0, 5);

    if (input==1) {
        console.log("-----------------------------------------------")
        let amount = getNumberInput("How much does this expense cost? ");
        let category = prompt("What is the category? ");
        addExpenses(amount, category)
    }else if (input==2){
        console.log("-----------------------------------------------");
        console.log("Expenses: ")
        expenses.forEach((value) => {
            console.log(` - ${value.category}, $${value.amount}`);
        })
    } else if (input==3){
        console.log("-----------------------------------------------");
        let isBudgetOver = checkBudget();
        if (isBudgetOver){
            console.log("You are over budget.");
        }else{
            console.log("You are not over budget");
        }
    }else if (input==4){
        console.log("-----------------------------------------------");
        let category = prompt("What category of expense would you like to remove? ");
        removeExpense(category);
    }
    else if (input==5){
        break ;
    }
}