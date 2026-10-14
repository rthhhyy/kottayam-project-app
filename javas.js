// State variables
let books = JSON.parse(localStorage.getItem('bookTrackerData')) || [];

// DOM Elements
const form = document.getElementById('book-form');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const statusInput = document.getElementById('status');
const searchInput = document.getElementById('search');
const bookList = document.getElementById('book-list');

// Error messages
const titleError = document.getElementById('title-error');
const authorError = document.getElementById('author-error');

// Stats elements
const toReadCount = document.getElementById('to-read-count');
const readingCount = document.getElementById('reading-count');
const finishedCount = document.getElementById('finished-count');

// Initialize app
function init() {
    renderBooks(books);
    updateStats();
}

// Save to localStorage
function saveBooks() {
    localStorage.setItem('bookTrackerData', JSON.stringify(books));
    updateStats();
}

// Update counts
function updateStats() {
    const toRead = books.filter(b => b.status === 'To read').length;
    const reading = books.filter(b => b.status === 'Reading').length;
    const finished = books.filter(b => b.status === 'Finished').length;

    toReadCount.textContent = `${toRead} To read`;
    readingCount.textContent = `${reading} Reading`;
    finishedCount.textContent = `${finished} Finished`;
}

// Handle Form Submission
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const status = statusInput.value;
    
    let isValid = true;

    // Validation
    if (!title) {
        titleError.style.display = 'block';
        isValid = false;
    } else {
        titleError.style.display = 'none';
    }

    if (!author) {
        authorError.style.display = 'block';
        isValid = false;
    } else {
        authorError.style.display = 'none';
    }

    if (!isValid) return;

    // Create new book object
    const newBook = {
        id: Date.now().toString(),
        title: title,
        author: author,
        status: status
    };

    // Add to array (newest first)
    books.unshift(newBook);
    saveBooks();
    
    // Clear inputs & re-render
    titleInput.value = '';
    authorInput.value = '';
    statusInput.value = 'To read';
    titleError.style.display = 'none';
    authorError.style.display = 'none';
    
    // Maintain active search filter if typing
    handleSearch();
});

// Render books to screen
function renderBooks(booksToRender) {
    bookList.innerHTML = '';

    if (booksToRender.length === 0) {
        bookList.innerHTML = '<p style="text-align:center; color:#6b7280;">No books found.</p>';
        return;
    }

    booksToRender.forEach(book => {
        const div = document.createElement('div');
        div.className = 'book-item';
        
        div.innerHTML = `
            <div class="book-header">
                <div>
                    <div class="book-title">${book.title}</div>
                    <div class="book-author">by ${book.author}</div>
                </div>
            </div>
            <div class="book-actions">
                <select class="status-select" onchange="updateStatus('${book.id}', this.value)">
                    <option value="To read" ${book.status === 'To read' ? 'selected' : ''}>To read</option>
                    <option value="Reading" ${book.status === 'Reading' ? 'selected' : ''}>Reading</option>
                    <option value="Finished" ${book.status === 'Finished' ? 'selected' : ''}>Finished</option>
                </select>
                <button class="delete-btn" onclick="deleteBook('${book.id}')">Delete</button>
            </div>
        `;
        bookList.appendChild(div);
    });
}

// Update Status
window.updateStatus = function(id, newStatus) {
    books = books.map(book => {
        if (book.id === id) {
            return { ...book, status: newStatus };
        }
        return book;
    });
    saveBooks();
    handleSearch(); // Re-render maintaining search query
}

// Delete Book
window.deleteBook = function(id) {
    books = books.filter(book => book.id !== id);
    saveBooks();
    handleSearch();
}

// Search Functionality
function handleSearch() {
    const query = searchInput.value.toLowerCase();
    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(query) || 
        book.author.toLowerCase().includes(query)
    );
    renderBooks(filteredBooks);
}

searchInput.addEventListener('input', handleSearch);

// Boot up
init();