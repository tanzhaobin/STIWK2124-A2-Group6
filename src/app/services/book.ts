import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:8080/api/books';

  constructor(private http: HttpClient) {}

  getBooks(page: number, size: number, searchQuery?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (searchQuery && searchQuery.trim() !== '') {
      params = params.set('q', searchQuery);
    }
    
    console.log('Calling API:', this.apiUrl, 'with params:', params.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }

  getBookById(id: number): Observable<any> {
    console.log('Fetching book by ID:', id);
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  addBook(bookData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, bookData);
  }

  updateBook(id: number, bookData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, bookData);
  }

  deleteBook(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}