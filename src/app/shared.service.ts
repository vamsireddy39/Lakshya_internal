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
  // setSessionKey(key: string) {
  //   this.sessionKey = key;
  // }

  // // Retrieve the session key
  // getSessionKey() {
  //   return this.sessionKey;
  // }

  // Login
  Login(formData: any) {
    return this.http.post(`http://www.crocusglobal.com/forum/api/login`, formData);
  }
  //LogOut
  Logout(formData: any) {
    return this.http.post(`http://www.crocusglobal.com/forum/api/logout`, formData)
  }
  //user
  Register(formData: any) {
    return this.http.post(`http://www.crocusglobal.com/forum/api/register`, formData);
  }

  LoginRegister(formData: any) {
    return this.http.post(`http://www.crocusglobal.com/forum/api/login_register`, formData)
  }

  UpdateRegister(userId: number, formData: any) {
    return this.http.put(`http://www.crocusglobal.com/forum/api/users/${userId}`,formData)
  }
  
  getUserData() {
    return this.http.get(`http://www.crocusglobal.com/forum/api/users`,)
  }
  
  getUserDataById(userId: number) {
    return this.http.get(`http://www.crocusglobal.com/forum/api/users/${userId}`)
  }

  deleteUser(userId:number){
    return this.http.delete(`http://www.crocusglobal.com/forum/api/users/${userId}`)
  }
  //get all posts
  getPosts() {
    return this.http.get(`http://www.crocusglobal.com/forum/api/posts`)
  }
  //post blog
  postBlog(formData: any) {
    return this.http.post(`http://www.crocusglobal.com/forum/api/posts`, formData)
  }

  getPostsById(userId: number) {
    return this.http.get(`http://www.crocusglobal.com/forum/api/posts/${userId}`)
  }
  getallgroupsbyuserid(userId: number) {
    return this.http.get(`http://www.crocusglobal.com/forum/api/get_all_groups_by_user_id/${userId}`)
  }

}


