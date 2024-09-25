import { Component, SecurityContext } from '@angular/core';
import { ObservablesService } from '../../observables.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Validators } from 'ngx-editor';
import { SharedService } from '../../shared.service';

interface UserDetails {
  id: number;
  title: string;
  header_img_file_name: string;
  descr: string;
  attached_file_name: string;
  user_id: number;
}

interface Comment {
  id: number;
  user_name: string;
  comment_text: string;
  parent_id: number | null;
  replies: Comment[];
  showAllReplies?: boolean; // Add showAllReplies property
}

interface AllComments {
  Comments: Comment[];
}
@Component({
  selector: 'app-view-id-posts',
  templateUrl: './view-id-posts.component.html',
  styleUrl: './view-id-posts.component.scss'
})
export class ViewIdPostsComponent {
  postIdDetails:any;
    
  commentForm: FormGroup;
  userDetails: UserDetails = {} as UserDetails;  // Initialize it with a default structure
  allComments: AllComments = { Comments: [] };   // Initialize to prevent undefined issues
  replyForms: { [commentId: string]: FormGroup } = {};
  constructor(public observable : ObservablesService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    public sharedService: SharedService){
      this.commentForm = this.fb.group({
        comment_text: ['', Validators.required],
        user_id: ['', Validators.required],
        parent_id: ['']  // Allow null value for parent_id (no parent for top-level comment)
      });
  }
  ngOnInit(){
    this.observable.postByIdDetailsPathIndex$.subscribe((response)=>{
      console.log(response);
      this.postIdDetails = response;
      this.getAllComments();

    })
    this.observable.loginDetailsPathIndex$.subscribe((response: any) => {
      console.log(response);
      this.userDetails = response;
    });
  }
  sanitizeDescription(descr: string, length: number = 100): string {
    const sanitizedDescr = this.sanitizer.sanitize(SecurityContext.HTML, descr) || '';
    return sanitizedDescr.length > length ? sanitizedDescr.slice(0, length) + '...' : sanitizedDescr;
  }


  getAllComments() {
    this.sharedService.getAllComments(this.postIdDetails.post.id).subscribe(response => {
      this.allComments = response as AllComments; // Ensure proper type assertion
      this.initializeReplyForms();
    }, error => {
      this.allComments = { Comments: [] };
    });
  }

  initializeReplyForms() {
    this.allComments.Comments.forEach((comment: Comment) => {
      this.replyForms[comment.id] = this.fb.group({
        comment_text: ['', Validators.required],
      });
      comment.showAllReplies = false; // Initialize showAllReplies
      if (comment.replies) {
        comment.replies.forEach((reply: Comment) => {
          this.replyForms[reply.id] = this.fb.group({
            comment_text: ['', Validators.required],
          });
        });
      }
    });
  }

  postComment(parentId: number | null, formGroup: FormGroup) {
    const formData = {
      comment_text: formGroup.controls['comment_text'].value,
      parent_id: parentId,
      user_id: this.userDetails.user_id
    };

    this.sharedService.createAComment(this.postIdDetails.post.id, formData).subscribe(() => {
      formGroup.reset();
      this.getAllComments();
    });
  }

  toggleReplies(comment: Comment) {
    comment.showAllReplies = !comment.showAllReplies;
  }

}
