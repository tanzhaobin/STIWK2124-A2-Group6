import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs'; 

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const method = req.method;

  if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
    const username = 'admin';
    const password = 'password123';
    const credentials = btoa(`${username}:${password}`);

    const secureReq = req.clone({
      setHeaders: {
        Authorization: `Basic ${credentials}`
      }
    });

    return next(secureReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 0 || error.status >= 500) {
          alert('⚠️ Connection Timeout or Backend Server Down! Please try again later.');
        }
        return throwError(() => error);
      })
    );
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0 || error.status >= 500) {
        alert('⚠️ Connection Timeout or Backend Server Down! Please try again later.');
      }
      return throwError(() => error);
    })
  );
};