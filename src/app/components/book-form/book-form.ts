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
  styleUrls: ['./book-form.css']
})
export class BookForm implements OnInit {
  book: any = {
    title: '',
    author: '',
    category: '',
    shortDescription: ''
  };
  
  isEditMode: boolean = false;
  bookId?: number;
  
  // Track which fields have been touched/visited
  touchedFields = {
    title: false,
    author: false,
    category: false,
    shortDescription: false
  };

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
      this.loadBook();
    }
  }

  loadBook(): void {
    this.bookService.getBookById(this.bookId!).subscribe({
      next: (data) => {
        this.book = {
          title: data.title || '',
          author: data.author || '',
          category: data.category || '',
          shortDescription: data.shortDescription || data.short_description || ''
        };
      },
      error: (err) => {
        console.error(err);
        alert('Failed to load book');
        this.router.navigate(['/books']);
      }
    });
  }

  // Mark field as touched when user interacts
  markTouched(field: string): void {
    this.touchedFields[field as keyof typeof this.touchedFields] = true;
  }

  // Mark all fields as touched when trying to submit
  markAllTouched(): void {
    this.touchedFields = {
      title: true,
      author: true,
      category: true,
      shortDescription: true
    };
  }

  // Validation methods - return true if valid
  isTitleValid(): boolean {
    return this.book.title && this.book.title.trim().length >= 2;
  }

  isAuthorValid(): boolean {
    return this.book.author && this.book.author.trim().length >= 2;
  }

  isCategoryValid(): boolean {
    return this.book.category && this.book.category.trim() !== '';
  }

  isDescriptionValid(): boolean {
    return this.book.shortDescription && this.book.shortDescription.trim().length >= 10;
  }

  isFormValid(): boolean {
    return this.isTitleValid() && 
           this.isAuthorValid() && 
           this.isCategoryValid() && 
           this.isDescriptionValid();
  }

  // Should show error for a field (only if touched)
  showTitleError(): boolean {
    return this.touchedFields.title && !this.isTitleValid();
  }

  showAuthorError(): boolean {
    return this.touchedFields.author && !this.isAuthorValid();
  }

  showCategoryError(): boolean {
    return this.touchedFields.category && !this.isCategoryValid();
  }

  showDescriptionError(): boolean {
    return this.touchedFields.shortDescription && !this.isDescriptionValid();
  }

  saveBook(): void {
    this.markAllTouched(); // Mark all fields as touched on submit
    
    if (!this.isFormValid()) {
      return; // Don't save if invalid
    }

    if (this.isEditMode && this.bookId) {
      this.bookService.updateBook(this.bookId, this.book).subscribe({
        next: () => {
          alert('Book updated successfully!');
          this.router.navigate(['/books']);
        },
        error: () => alert('Update failed')
      });
    } else {
      this.bookService.addBook(this.book).subscribe({
        next: () => {
          alert('Book added successfully!');
          this.router.navigate(['/books']);
        },
        error: () => alert('Add failed')
      });
    }
  }
}