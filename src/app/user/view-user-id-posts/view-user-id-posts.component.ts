
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ObservablesService } from '../../observables.service';
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
  showReplyForm?: boolean;
}

interface AllComments {
  Comments: Comment[];
}

@Component({
  selector: 'app-view-user-id-posts',
  templateUrl: './view-user-id-posts.component.html',
  styleUrls: ['./view-user-id-posts.component.scss']
})
export class ViewUserIdPostsComponent implements OnInit {
  commentForm: FormGroup;
  userDetails: UserDetails = {} as UserDetails;
  allComments: AllComments = { Comments: [] };
  replyForms: { [commentId: string]: FormGroup } = {};
  roleID: any;

  constructor(
    private observable: ObservablesService,
    private fb: FormBuilder,
    private sharedService: SharedService,
     private sanitizer: DomSanitizer,

  ) {
    this.commentForm = this.fb.group({
      comment_text: ['', Validators.required],
      user_id: ['', Validators.required],
      parent_id: [null]
    });
  }

  ngOnInit() {
    this.observable.postDetailsPathIndex$.subscribe((response: any) => {
      this.userDetails = response.post as UserDetails;
      this.getAllComments();
    });
    this.observable.loginDetailsPathIndex$.subscribe((response) => {
      this.roleID = response.user_id;
    });
  }

  getAllComments() {
    this.sharedService.getAllComments(this.userDetails.id).subscribe(response => {
      this.allComments = response as AllComments;
      this.initializeReplyForms(this.allComments.Comments);
    }, error => {
      this.allComments = { Comments: [] };
    });
  }

  initializeReplyForms(comments: Comment[]) {
    comments.forEach((comment: Comment) => {
      this.replyForms[comment.id] = this.fb.group({
        comment_text: ['', Validators.required],
      });
      comment.showReplyForm = false;

      // If the comment has replies, initialize their forms recursively
      if (comment.replies && comment.replies.length > 0) {
        this.initializeReplyForms(comment.replies);
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
      user_id: this.roleID
    };

    this.sharedService.createAComment(this.userDetails.id, formData).subscribe(() => {
      formGroup.reset();
      this.getAllComments(); // Refresh comments after posting
    });
  }

  sanitizeDescription(descr: string, length: number = 100): string {
    const sanitizedDescr = this.sanitizer.bypassSecurityTrustHtml(descr) as string;
    const sanitizedText = typeof sanitizedDescr === 'string' ? sanitizedDescr : '';
    return sanitizedText.length > length ? sanitizedText.slice(0, length) + '...' : sanitizedText;
  }
}
