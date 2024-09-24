import { Component, SecurityContext } from '@angular/core';
import { ObservablesService } from '../../observables.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../shared.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-view-user-id-posts',
  templateUrl: './view-user-id-posts.component.html',
  styleUrls: ['./view-user-id-posts.component.scss']
})
export class ViewUserIdPostsComponent {
  newComment: any;
  commentForm: FormGroup;
  userDetails: any = {};
  allComments: any = { Comments: [] };  // Initialize to prevent undefined issues

  replyForms: { [commentId: string]: FormGroup } = {}; // Store FormGroups for replies

  constructor(
    private observable: ObservablesService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    public sharedService: SharedService
  ) {
    // Initialize form for top-level comments
    this.commentForm = this.fb.group({
      comment_text: ['', Validators.required],
      user_id: ['', Validators.required],
      parent_id: ['']  // Allow null value for parent_id (no parent for top-level comment)
    });
  }

  ngOnInit() {
    // Fetch post details when the component initializes
    this.observable.postDetailsPathIndex$.subscribe(response => {
      console.log(response);
      this.userDetails = response.post;
      this.getAllComments();
    });
  }

  // Fetch all comments for the current post
  getAllComments() {
    this.sharedService.getAllComments(this.userDetails.id).subscribe(response => {
      console.log(response);
      this.allComments = response;  // Expecting response to contain a "Comments" array
      this.initializeReplyForms();  // Initialize forms for replies
    }, error => {
      console.error('Error fetching comments', error);
      this.allComments = { Comments: [] };  // Handle errors gracefully
    });
  }

  // Initialize reply forms for each comment
  initializeReplyForms() {
    this.allComments.Comments.forEach((comment: any) => {
      this.replyForms[comment.id] = this.fb.group({
        comment_text: ['', Validators.required],
      });

      if (comment.replies) {
        comment.replies.forEach((reply: any) => {
          this.replyForms[reply.id] = this.fb.group({
            comment_text: ['', Validators.required],
          });

          if (reply.replies) {
            reply.replies.forEach((subReply: any) => {
              this.replyForms[subReply.id] = this.fb.group({
                comment_text: ['', Validators.required],
              });
            });
          }
        });
      }
    });
  }

  // Post a comment (top-level or reply)
  postComment(parentId: number | null, formGroup: FormGroup) {
    const formData = {
      comment_text: formGroup.controls['comment_text'].value,
      parent_id: parentId,  // Use parentId for replies
      user_id: this.userDetails.user_id
    };

    this.sharedService.createAComment(this.userDetails.id, formData).subscribe(response => {
      console.log(response);
      formGroup.reset();
      this.getAllComments();  // Refresh the comment list after posting
    }, error => {
      console.error('Error posting comment', error);
    });
  }

  // Sanitize and truncate description
  sanitizeDescription(descr: string, length: number = 100): string {
    const sanitizedDescr = this.sanitizer.sanitize(SecurityContext.HTML, descr) || '';
    return sanitizedDescr.length > length ? sanitizedDescr.slice(0, length) + '...' : sanitizedDescr;
  }
}
