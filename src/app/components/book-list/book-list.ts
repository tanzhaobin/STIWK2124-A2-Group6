import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // Import RouterModule to fix HTML routerLink error
import { BookService } from '../../services/book';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Added RouterModule here
  templateUrl: './book-list.html',
  styleUrls: ['./book-list.css']
})
export class BookListComponent implements OnInit {
  books: any[] = [];
  currentPage: number = 0;
  pageSize: number = 6; // Set to 6 to look perfectly balanced in a 3-column grid layout
  searchQuery: string = '';
  totalPages: number = 0;

  constructor(
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  // Fetch data from the backend API
  loadBooks(): void {
    this.bookService.getBooks(this.currentPage, this.pageSize, this.searchQuery).subscribe({
      next: (response) => {
        // Automatically handles fallback mapping depending on how your backend packages page arrays
        this.books = response.books || response.content || response;
        this.totalPages = response.totalPages || 0;
      },
      error: (err) => {
        console.error('Error loading records from database:', err);
      }
    });
  }

  // Triggered when clicking search or hitting Enter key
  onSearch(): void {
    this.currentPage = 0; // Reset to first page for fresh query filter results
    this.loadBooks();
  }

  // Action to trigger database deletion row cleanups
  onDeleteBook(id: number): void {
    if (confirm('Are you sure you want to permanently delete this book from the system?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => {
          console.log('Book deleted successfully');
          this.loadBooks(); // Re-fetch current data page instantly
        },
        error: (err) => {
          console.error('Failed to delete book entry:', err);
        }
      });
    }
  }

  // Pagination Controls
  goToNextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadBooks();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadBooks();
    }
  }
  readAloud(title: string, author: string): void {
    const textToSpeak = `Book Title: ${title}, written by ${author}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    window.speechSynthesis.speak(utterance);
  }
}