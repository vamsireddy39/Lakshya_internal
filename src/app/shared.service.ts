import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private headers: HttpHeaders;
  private sessionKey: string | null = null;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders();
  }

  // Store the session key
  setSessionKey(key: string) {
    this.sessionKey = key;
  }

  // Retrieve the session key
  getSessionKey() {
    return this.sessionKey;
  }

  // Login
  Login(formData: any) {
    return this.http.post(`http://www.crocusglobal.com/forum/api/login`, formData);
  }

//user
  getUserData() {
    return this.http.get(`http://www.crocusglobal.com/forum/api/users`,)
  }
}
