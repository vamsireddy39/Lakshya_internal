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
    return this.http.put(`http://www.crocusglobal.com/forum/api/users/deact/${userId}`,null)
  }
  activateUser(userId:number){
    return this.http.put(`http://www.crocusglobal.com/forum/api/users/act/${userId}`,null)
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

  updatePost(formdata:any){
    return this.http.put(`http://www.crocusglobal.com/forum/api/posts`,formdata)
  }
  //group
  createGroup(formdata:any){
    return this.http.post(`http://www.crocusglobal.com/forum/api/groups`,formdata)
  }

  getAllParentGroups(){
    return this.http.get(`http://www.crocusglobal.com/forum/api/groups/parent`)
  }

  createSubGroup(formdata:any){
    return this.http.post(`http://www.crocusglobal.com/forum/api/create_sub_group`,formdata)
  }

  getAllSubGroups(userId: number){
    return this.http.get(`http://www.crocusglobal.com/forum/api/get_all_sub_groups_by_parent_id/${userId}`)
  }

  deActivateGroup(postId: number) {
    return this.http.put(`http://www.crocusglobal.com/forum/api/groups/${postId}/deactivate`, {});
  }
 
  getAllSubGroupsByParentId(groupId : number){
    return this.http.get(`http://www.crocusglobal.com/forum/api/get_all_sub_groups_by_parent_id/${groupId}`)
  }
  getallgroupsbyuserid(userId: number) {
    return this.http.get(`http://www.crocusglobal.com/forum/api/get_all_groups_by_user_id/${userId}`)
  }
  

  //get posts
  getForumPosts(postId:number){
    return this.http.get(`http://www.crocusglobal.com/forum/api/posts/group_id/${postId}`)
  }

  getForumPostsByUserId(groupId:number,userId:number){
    return this.http.get(`http://www.crocusglobal.com/forum/api/posts/group_id/${groupId}/user_id/${userId}`)
  }




  //comments

  createAComment(postId:number,formdata:any){
    return this.http.post(`http://www.crocusglobal.com/forum/api/posts/${postId}/comments`,formdata)
  }

  getAllComments(postId:number){
    return this.http.get(`http://www.crocusglobal.com/forum/api/posts/${postId}/comments_all`)
  }

  //getallgroupmembers
  getAllgroupMembers(groupId:number){
    return this.http.get(`http://www.crocusglobal.com/forum/api/group_members/${groupId}`)
  }

  addGroupMembers(formdata:any){
    return this.http.post(`http://www.crocusglobal.com/forum/api/group_members`,formdata)
  }
  addSubGroupMembers(payload: any) {
    return this.http.post('http://www.crocusglobal.com/forum/api/add_sub_group_members', payload);
  }
  deactivate(memberId: any) {
    return this.http.put(
      `http://www.crocusglobal.com/forum/api/group_members/${memberId}/deactivate`, 
      null // Passing null as the body
    );
  }
  //delete posts1
  deletePost(postId:any){
    return this.http.put(` http://www.crocusglobal.com/forum/api/posts/deact/${postId}`,null)
  } 
   activatePost(postId:any){
    return this.http.put(` http://www.crocusglobal.com/forum/api/posts/${postId}`,null)
  }
  
  getPostByUserId(userId:any){
    return this.http.get(`http://www.crocusglobal.com/forum/api/posts/user_id/${userId}`)
  }
  getAllGroups(){
    return this.http.get(`http://www.crocusglobal.com/forum/api/groups`)
  }
  deleteGroup(groupId:any){
    return this.http.put(`http://www.crocusglobal.com/forum/api/groups/${groupId}/deactivate`,null)
  }
  activateGroup(groupId:any){
    return this.http.put(`http://www.crocusglobal.com/forum/api/groups/${groupId}/activate`,null)
  }
  getGroupById(groupId:any){
    return this.http.get(`http://www.crocusglobal.com/forum/api/groups/${groupId}`)
  }
  updateGroup(groupId: any, formData:any){
    return this.http.put(`http://www.crocusglobal.com/forum/api/groups/${groupId}`,formData)
  }
}


