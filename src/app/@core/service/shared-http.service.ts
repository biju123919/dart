import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { BrowserStorageService } from './browser-storage.service';

@Injectable({
  providedIn: 'root'
})
export class SharedHttpService {
  constructor(private http: HttpClient, private router: Router, private browserStorageService: BrowserStorageService) { }

  // Existing methods with global error handling
  get<T>(url: string, headerParams?: any) {
    return this.http
      .get<T>(url, { headers: headerParams }).pipe(
        catchError((err) => {
          return this.handleError(err)
        })
      );
  }

  getBlob(url: string, headerParams?: any): Observable<HttpResponse<Blob>> {
    return this.http.get<Blob>(url, {
      headers: headerParams,
      responseType: 'blob' as 'json',
      observe: 'response'
    }).pipe(
      catchError((err) => {
        return this.handleError(err);
      })
    );
  }

  post(url: any, payLoad: any, headerParams?: any) {
    return this.http.post(url, payLoad, { headers: headerParams }).pipe(
      catchError((err) => {
        return this.handleError(err)
      })
    );
  }

  put(url: any, payload: any, headerParams?: any,) {
    return this.http.put(url, payload, { headers: headerParams }).pipe(
      catchError((err) => {
        return this.handleError(err)
      })
    );
  }

  delete(url: any, headerParams?: any) {
    return this.http.delete(url, { headers: headerParams }).pipe(
      catchError((err) => {
        return this.handleError(err)
      })
    );
  }

  // New methods that return raw errors without global handling
  getRaw<T>(url: string, headerParams?: any): Observable<T> {
    return this.http.get<T>(url, { headers: headerParams });
  }

  getBlobRaw(url: string, headerParams?: any): Observable<HttpResponse<Blob>> {
    return this.http.get<Blob>(url, {
      headers: headerParams,
      responseType: 'blob' as 'json',
      observe: 'response'
    });
  }

  postRaw<T>(url: string, payLoad: any, headerParams?: any): Observable<T> {
    return this.http.post<T>(url, payLoad, { headers: headerParams });
  }

  putRaw<T>(url: string, payload: any, headerParams?: any): Observable<T> {
    return this.http.put<T>(url, payload, { headers: headerParams });
  }

  deleteRaw<T>(url: string, headerParams?: any): Observable<T> {
    return this.http.delete<T>(url, { headers: headerParams });
  }

  // Generic method with configurable error handling
  request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    options: {
      payload?: any;
      headers?: any;
      skipGlobalErrorHandling?: boolean;
    } = {}
  ): Observable<T> {
    const { payload, headers, skipGlobalErrorHandling = false } = options;

    let request$: Observable<T>;

    switch (method) {
      case 'GET':
        request$ = this.http.get<T>(url, { headers });
        break;
      case 'POST':
        request$ = this.http.post<T>(url, payload, { headers });
        break;
      case 'PUT':
        request$ = this.http.put<T>(url, payload, { headers });
        break;
      case 'DELETE':
        request$ = this.http.delete<T>(url, { headers });
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    if (skipGlobalErrorHandling) {
      return request$;
    }

    return request$.pipe(
      catchError((err) => this.handleError(err))
    );
  }

  // Generic raw method without any error handling
  requestRaw<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    options: {
      payload?: any;
      headers?: any;
    } = {}
  ): Observable<T> {
    const { payload, headers } = options;

    switch (method) {
      case 'GET':
        return this.http.get<T>(url, { headers });
      case 'POST':
        return this.http.post<T>(url, payload, { headers });
      case 'PUT':
        return this.http.put<T>(url, payload, { headers });
      case 'DELETE':
        return this.http.delete<T>(url, { headers });
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error?.status == 0) {
      // A client-side or network error occurred. Handle it accordingly.
    } else if (error?.status == 401) {
      this.browserStorageService?.LS_clear()
      this.router.navigate([''])
    }
    else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(`Backend returned code ${error?.status}, body was: `, error?.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
