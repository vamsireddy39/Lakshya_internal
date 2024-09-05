import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private headers: HttpHeaders;
  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders();
    this.headers.append('Content-Type', 'application/json');
  }

  //Login
  Login(formData: FormData) {
    return this.http.post(`http://www.crocusglobal.com/forum/login`, formData, { headers: this.headers })
  }
}
