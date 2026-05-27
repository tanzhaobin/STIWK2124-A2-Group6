import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './book-form.html',
  styleUrl: './book-form.css'
})
export class BookForm implements OnInit {
  // 1. The 'book' object property must exist here
  book: any = {
    title: '',
    author: '',
    price: null,
    isbn: ''
  };

  // 2. The 'isEditMode' property must exist here
  isEditMode: boolean = false;
  bookId?: number;

  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.bookId = +idParam;
      this.fetchTargetBook(this.bookId);
    }
  }

  fetchTargetBook(id: number): void {
    this.bookService.getBooks(0, 100).subscribe({
      next: (response) => {
        const list: any[] = response.content || response;
        const found = list.find(b => b.id === id);
        if (found) {
          this.book = { ...found };
        }
      },
      error: (err) => console.error('Failed to parse catalog object:', err)
    });
  }

  // 3. The 'saveBook()' function must exist here
  saveBook(): void {
    if (this.isEditMode && this.bookId) {
      this.bookService.updateBook(this.bookId, this.book).subscribe({
        next: () => {
          alert('Book metadata updated successfully!');
          this.router.navigate(['/books']);
        },
        error: (err) => alert('Save intercepted or access unauthorized.')
      });
    } else {
      this.bookService.addBook(this.book).subscribe({
        next: () => {
          alert('New book registered into server catalog!');
          this.router.navigate(['/books']);
        },
        error: (err) => alert('Action blocked. Check Authorization header validation.')
      });
    }
  }
}