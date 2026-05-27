import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const method = req.method;

  // Intercept write operations: POST, PUT, DELETE
  if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
    const username = 'admin';
    const password = 'password123';
    const credentials = btoa(`${username}:${password}`);

    const secureReq = req.clone({
      setHeaders: {
        Authorization: `Basic ${credentials}`
      }
    });
    return next(secureReq);
  }

  // Let public GET requests pass through directly
  return next(req);
};