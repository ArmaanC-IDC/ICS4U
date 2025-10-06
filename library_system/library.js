import books from "./books.js";
import promptSync from "prompt-sync";

const prompt = promptSync();

function addBook(title, author, year) {
    books.push({title, author, year, isAvailable: true});
}

function listAvailableBooks() {
    console.log("Available Books: ");
    for (let i = 0; i<books.length; i++) {
        let book = books[i];
        if (book.isAvailable){
            console.log(` - ${book.title}`);
        }
    }
}

function borrowBook(title) {
    let found = false;
    for (let i = 0; i<books.length; i++) {
        let book = books[i];
        if (book.title===title) {
            if (book.isAvailable){
                book.isAvailable = false;
            }else{
                console.log("That book is not available");
            }
            found = true;
        }
    };

    if (!found) {
        console.log("Book not found");
    }
}

function returnBook(title){
    for (let i = 0; i<books.length; i++) {
        let book = books[i];
        if (book.title===title) {
            book.isAvailable = true;
        }
    }
}

function listBooksByAuthor(author){
    console.log(`Books by ${author}: `)
    for (let i = 0; i<books.length; i++) {
        let book = books[i];
        if (book.author===author){
            console.log(` - ${book.title}`);
        }
    }
}

function listBooksBeforeYear(year){
    console.log(`Books before ${year}: `);
    for (let i = 0; i<books.length; i++) {
        let book = books[i];
        if (book.year<year){
            console.log(` - ${title}`);
        }
    }
}

function removeBook(title){
    let index = -1;
    for (let i = 0; i<books.length; i++) {
        let book = books[i];
        if (book.title===title){
            index = i;
        }
    }

    books.splice(index, 1);
}

function getNumberInput (inputString, minVal = Number.MIN_SAFE_INTEGER, maxVal = Number.MAX_SAFE_INTEGER) {
    let input = Number(prompt(inputString));
    while (isNaN(input) || input>maxVal | input<minVal) {
        console.log("Invalid number. Please enter again");
        input = Number(prompt(inputString));
    }
    return input;
}

while (true) {
    console.log();
    console.log("-----------------------------------------------");
    console.log("Please pick an action: ");
    console.log(" - 1: Add a new book");
    console.log(" - 2: List available books");
    console.log(" - 3: Borrow a book");
    console.log(" - 4: Return a book");
    console.log(" - 5: List books by author");
    console.log(" - 6: List books before year");
    console.log(" - 7: Remove a book");
    console.log(" - 8: Exit program")

    let input = getNumberInput("Pick an option: ", 1, 8);

    if (input===1) {
        console.log("-----------------------------------------------")
        let title = prompt("What is the title? ");
        let author = prompt("Who is the author? ");
        let year = getNumberInput("When was it published? ", 0, 2025);
        addBook(title, author, year);
    } else if (input===2) {
        listAvailableBooks();
    } else if (input===3){
        let title = prompt("What book would you like to borrow? ");
        borrowBook(title);
    } else if (input===4) {
        let title = prompt("What book would you like to return? ");
        returnBook(title);
    } else if (input===5) {
        let author = prompt("What author's books would you like listed? ");
        listBooksByAuthor(author);
    } else if (input===6) {
        let year = getNumberInput("What year would you like to get books before? ", 0, 2025);
        listBooksBeforeYear(year);
    } else if (input===7) {
        let title = prompt("What book would you like to remove? ");
        removeBook(title);
    }
    else if (input===8){
        break ;
    }
}