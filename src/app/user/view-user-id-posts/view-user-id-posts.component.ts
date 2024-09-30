import { Component, SecurityContext } from '@angular/core';
import { ObservablesService } from '../../observables.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../shared.service';
import { DomSanitizer } from '@angular/platform-browser';

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
  showAllReplies?: boolean; // To control visibility of additional replies
}

interface AllComments {
  Comments: Comment[];
}

@Component({
  selector: 'app-view-user-id-posts',
  templateUrl: './view-user-id-posts.component.html',
  styleUrls: ['./view-user-id-posts.component.scss']
})
export class ViewUserIdPostsComponent {
  commentForm: FormGroup;
  userDetails: UserDetails = {} as UserDetails; // Initialize with a default structure
  allComments: AllComments = { Comments: [] }; // Initialize to prevent undefined issues
  replyForms: { [commentId: string]: FormGroup } = {};

  constructor(
    private observable: ObservablesService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    public sharedService: SharedService
  ) {
    this.commentForm = this.fb.group({
      comment_text: ['', Validators.required],
      user_id: ['', Validators.required],
      parent_id: [null] // Allow null value for parent_id (no parent for top-level comment)
    });
  }

  ngOnInit() {
    this.observable.postDetailsPathIndex$.subscribe((response: any) => {
      this.userDetails = response.post as UserDetails;
      this.getAllComments();
    });
  }

  getAllComments() {
    this.sharedService.getAllComments(this.userDetails.id).subscribe(response => {
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

    this.sharedService.createAComment(this.userDetails.id, formData).subscribe(() => {
      formGroup.reset();
      this.getAllComments(); // Refresh comments after posting
    });
  }

  toggleReplies(comment: Comment) {
    comment.showAllReplies = !comment.showAllReplies; // Toggle visibility
  }

  sanitizeDescription(descr: string, length: number = 100): string {
    const sanitizedDescr = this.sanitizer.bypassSecurityTrustHtml(descr) as string;
    const sanitizedText = typeof sanitizedDescr === 'string' ? sanitizedDescr : '';
    return sanitizedText.length > length ? sanitizedText.slice(0, length) + '...' : sanitizedText;
  }
}
