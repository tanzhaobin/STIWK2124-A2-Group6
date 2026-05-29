import { Routes } from '@angular/router';
import { BookListComponent } from './components/book-list/book-list';
import { BookForm } from './components/book-form/book-form';

export const routes: Routes = [
  { path: '', redirectTo: 'books', pathMatch: 'full' }, // Fix: Removed leading slash
  { path: 'books', component: BookListComponent },
  { path: 'books/add', component: BookForm },
  { path: 'books/edit/:id', component: BookForm },
  { path: '**', redirectTo: 'books' } // Fix: Removed leading slash
];