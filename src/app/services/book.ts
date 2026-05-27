import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:8080/api/books'; 

  constructor(private http: HttpClient) {}

  // 1. Fetch Paginated Books (GET)
  getBooks(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }

  // 2. Search Books (GET)
  searchBooks(query: string): Observable<any> {
    const params = new HttpParams().set('query', query);
    return this.http.get<any>(`${this.apiUrl}/search`, { params });
  }

  // 3. Add Book (POST)
  addBook(bookData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, bookData);
  }

  // 4. Update Book (PUT)
  updateBook(id: number, bookData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, bookData);
  }

  // 5. Delete Book (DELETE)
  deleteBook(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}