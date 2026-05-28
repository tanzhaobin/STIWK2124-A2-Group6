import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book'; // Points perfectly to your service file

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-list.html', 
  styleUrls: ['./book-list.css']    
})
export class BookListComponent implements OnInit {
  books: any[] = [];
  searchQuery: string = '';
  
  // Pagination states
  currentPage: number = 0;
  pageSize: number = 6; 
  totalPages: number = 1;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    // Fetch books directly from the real database on load
    this.loadBooks();
  }

  // Pure API call for Paginated Books
  loadBooks(): void {
    this.bookService.getBooks(this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        if (response && response.content) {
          this.books = response.content;
          this.totalPages = response.totalPages;
        } else {
          // Fallback if your backend API returns a direct array instead of a Pageable object
          this.books = response || [];
          this.totalPages = 1;
        }
      },
      error: (err) => {
        console.error('Database connection error:', err);
        // Clear list so it safely shows the "No Books Available" UI if server is down
        this.books = [];
        this.totalPages = 1;
      }
    });
  }

  // Pure API call for Real-time Search
  onSearch(): void {
    if (this.searchQuery.trim() !== '') {
      this.bookService.searchBooks(this.searchQuery).subscribe({
        next: (response: any) => {
          if (response && response.content) {
            this.books = response.content;
          } else {
            this.books = response || [];
          }
        },
        error: (err) => {
          console.error('Search API error:', err);
          this.books = []; // Clear grid on error
        }
      });
    } else {
      // If the search bar is emptied, reload the default database page
      this.loadBooks();
    }
  }

  // Pagination Handlers
  goToPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadBooks();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadBooks();
    }
  }
}