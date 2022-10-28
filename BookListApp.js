//Book Class: Represents a Book (making a book object)
class Book {
    constructor(title, author, isbn) {
        this.title=title;
        this.author=author;
        this.isbn=isbn;
    }
}

//UI Class: Handle UI Tasks (show it coming up)
class UI {
    static displayBooks() {
    //     const StoredBooks = [
    //     {
    //         title: 'Book One',
    //         author: 'John Doe',
    //         isbn: '3434434',
    //     },
    //     {
    //         title: 'Book Two',
    //         author: 'Jane Doe',
    //         isbn: '45545'
    //     } 
    //   ];
        //He got rid of the dummy data, I kept it so I can still have it for previous work
      //const books = StoredBooks;

      const books = Store.getBooks();


      //looping through an array to get the books 

      books.forEach((book) => UI.addBookToList(book));

    }
    static addBookToList(book) {
        //making the row to add the tbody in
        const list = document.querySelector('#book-list');

        //making a tr element
        const row = document.createElement('tr');

        row.innerHTML = `
        <td> ${book.title}</td>
        <td> ${book.author}</td>
        <td> ${book.isbn}</td>
        <td> <a href= "#" class= "btn btn-danger btn-sm delete">X</a></td>`;
        list.appendChild(row);
        
    }
    //creating a property to clear the lines when new entry added
    static deleteBook(el) {
        if(el.classList.contains('delete')){ //parent element twice because of innerHTML above
            el.parentElement.parentElement.remove();
        }
    }
    //fancier alert, built from scratch

    //<div class="alert alert-success"> Type something yo. </div> This would be in HTML
    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        //Parent element, container, use insert before for the div before the form in HTML
        //Vanish in 3 seconds. Causes the alert to vanish in three seconds instead of adding it over and over again
        setTimeout(() => document.querySelector('.alert').remove(),3000); // milliseconds which is 3 seconds otherwise
    }
    static clearFields() {
        document.querySelector('#title').value='';
        document.querySelector('#author').value='';
        document.querySelector('#isbn').value='';
    }

}

//calling a method on the book

//adding a few methods, display book, add book to list, etc. don't want to instantiate, so making methods static


//Store Class: Handles storage (local storage within browser)
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books')=== null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books)); //JSON is preventing them from being strings apparently?
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index)=> {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}
//make sure these are static to not have to instantiate the Store class

//Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
//Prevent actual submit
    e.preventDefault();

    //Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //Validate
    if(title === '' || author === '' || isbn === ''){
        UI.showAlert('Wow, I need some fields here dude', 'info');
    
    //started as alert, but added the fancier alert in code above, so now calling it
    //'danger' makes it red, 'success' makes it green, 'info' makes it blue
    } else {
          //will cause an alert for you to fill in the fields

    //Instantiate a book from the book class
    const book = new Book(title, author, isbn);
    
    //Add book to UI
    UI.addBookToList(book); 


    //Add book to store
    Store.addBook(book);

    //Show success message
    UI.showAlert('Book Added', 'success');

    //Clear fields
    UI.clearFields();
    }
})
//Event: Remove a Book 
document.querySelector('#book-list').addEventListener('click', (e) => {
    //Remove book from UI
    UI.deleteBook(e.target); //targeting a certain element. ON each click, appears in console
    //changing it to a method to delete the book

    //Remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent); //traversing back to table

  //Show message when book is deleted
  UI.showAlert('You took away my book you monster!', 'danger');
});

//event propogation, target whatever is clicked inside of it 

//All events are in the UI and storage
