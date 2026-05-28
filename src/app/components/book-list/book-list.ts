import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BookService } from '../../services/book';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './book-list.html',
  styleUrls: ['./book-list.css']
})
export class BookListComponent implements OnInit {
  books: any[] = [];
  searchQuery: string = '';
  currentPage: number = 0;
  pageSize: number = 6;
  totalPages: number = 1;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getBooks(this.currentPage, this.pageSize, this.searchQuery).subscribe({
      next: (response: any) => {
        if (response && response.content) {
          this.books = response.content;
          this.totalPages = response.totalPages;
        } else {
          this.books = [];
          this.totalPages = 1;
        }
      },
      error: (err) => {
        console.error('Error:', err);
        this.books = [];
        this.totalPages = 1;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadBooks();
  }

  deleteBook(id: number): void {
    if (confirm('Delete this book?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => {
          alert('Book deleted!');
          this.loadBooks();
        },
        error: (err) => {
          alert('Delete failed');
        }
      });
    }
  }

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