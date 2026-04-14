import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isAuthRequest = req.url.includes('/login') || req.url.includes('/register');
  
  if (isAuthRequest) {
    return next(req);
  }
  
  const token = localStorage.getItem('letterboxd_token');
  
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(req);
};