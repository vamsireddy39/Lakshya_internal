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
  showAllReplies?: boolean;
  showFullComment?: boolean; // Add property for toggling full comment view
  showReplyForm?: boolean;    // Add property for displaying reply form
}

interface AllComments {
  Comments: Comment[];
}

@Component({
  selector: 'app-view-id-posts',
  templateUrl: './view-id-posts.component.html',
  styleUrls: ['./view-id-posts.component.scss']
})
export class ViewIdPostsComponent {
  postIdDetails: any;
  commentForm: FormGroup;
  userDetails: UserDetails = {} as UserDetails; // Initialize with default structure
  allComments: AllComments = { Comments: [] }; // Initialize to prevent undefined issues
  replyForms: { [commentId: string]: FormGroup } = {};

  constructor(
    public observable: ObservablesService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    public sharedService: SharedService
  ) {
    this.commentForm = this.fb.group({
      comment_text: ['', Validators.required],
      user_id: ['', Validators.required],
      parent_id: [''] // Allow null value for top-level comments
    });
  }

  ngOnInit() {
    this.observable.postByIdDetailsPathIndex$.subscribe((response) => {
      this.postIdDetails = response;
      this.getAllComments();
    });

    this.observable.loginDetailsPathIndex$.subscribe((response: any) => {
      this.userDetails = response;
    });
  }

  sanitizeDescription(descr: string): string {
    const sanitizedDescr = this.sanitizer.bypassSecurityTrustHtml(descr) as string;
    return sanitizedDescr; // Return the sanitized HTML directly without length restriction
  }
  
  toggleFullComment(comment: Comment) {
    comment.showFullComment = !comment.showFullComment; // Toggle full comment visibility
  }

  getAllComments() {
    this.sharedService.getAllComments(this.postIdDetails.post.id).subscribe(response => {
      this.allComments = response as AllComments;
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
      comment.showReplyForm = false;

      // If the comment has replies, initialize their forms recursively
      if (comment.replies && comment.replies.length > 0) {
        this.initializeReplyFormsRecursively(comment.replies);
      }
    });
  }

  initializeReplyFormsRecursively(replies: Comment[]) {
    replies.forEach((reply: Comment) => {
      this.replyForms[reply.id] = this.fb.group({
        comment_text: ['', Validators.required],
      });
      reply.showReplyForm = false;

      // Recursively initialize for further nested replies
      if (reply.replies && reply.replies.length > 0) {
        this.initializeReplyFormsRecursively(reply.replies);
      }
    });
  }

  showReplyForm(comment: Comment) {
    comment.showReplyForm = !comment.showReplyForm;
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
