import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { SharedService } from '../../shared.service';
import { Editor } from 'ngx-editor';
@Component({
  selector: 'app-create-posts',
  templateUrl: './create-posts.component.html',
  styleUrl: './create-posts.component.scss'
})
export class CreatePostsComponent {


  editorIntro: Editor;
  editorDescr: Editor;
  editor: Editor ;
  html = '';

  // postForm: FormGroup | undefined;
  postForm: FormGroup;
  post_ID: any;
editpost = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.editor = new Editor();
    this.editorIntro = new Editor();
    this.editorDescr = new Editor();
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(500)]],
      descr: ['', [Validators.required, Validators.maxLength(4500)]],
      intro: ['', [Validators.required, Validators.maxLength(4500)]],
      takeaways: ['', [Validators.required, Validators.maxLength(4500)]],
      post_ID:[''],
    });

  }
//   ngOnInit(): void {
//     this.sharedService.editpostPathIndexSubject$.subscribe((response) => {
//       // console.log(response);
//       this.post_ID = response
//       this.getpostDetailsById(this.post_ID);
//     })

//   }

//   getpostDetailsById(post_ID: string): void {
//     this.sharedService.getpostDetailsById(post_ID).subscribe(
//       (response: any) => {
//         // console.log(response);
//         this.postForm.patchValue({
//           title: response.title,
//           descr: response.description,
//           intro: response.introduction,
//           takeaways: response.takeaways
//         });
//         this.editor.setContent(response.description);
//         this.editorIntro.setContent(response.introduction);
//         this.editpost= true;

//       },
//       error => {
//         console.log(error);
//       }
//     );
//   }

//   createpost() {
//     let formData: FormData = new FormData();
//     formData.append('title', this.postForm.controls['title'].value);
//     formData.append('descr', this.postForm.controls['descr'].value);
//     formData.append('intro', this.postForm.controls['intro'].value);
//     formData.append('takeaways', this.postForm.controls['takeaways'].value);



//     if (this.editpost == true){
//       formData.append('post_ID', this.post_ID);      
//       this.sharedService.editpost(formData).subscribe((response: any) => {
//         // console.log(response)
  
//         // this.sharedService.postDetailsPathIndexSubject$.next(response)
  
//         Swal.fire({
  
//           text: "edited The post Successfully!",
//           icon: "success"
//         })
//         this.postForm.reset()
//       }
//         , error => {
//           Swal.fire({
//             icon: "error",
//             title: error,
//             text: "Something went wrong!",
  
//           });
//         });
  
//     }else{
//     this.sharedService.createpost(formData).subscribe((response: any) => {
//       // console.log(response)

//       this.sharedService.postDetailsPathIndexSubject$.next(response)

//       Swal.fire({

//         text: "Created The post Successfully!",
//         icon: "success"
//       })
//       this.postForm.reset()

//     }
//       , error => {
//         Swal.fire({
//           icon: "error",
//           title: error,
//           text: "Something went wrong!",

//         });
//       });


//   }
// }
ngOnDestroy(): void {
  this.editor.destroy();
  this.editorIntro.destroy();
  this.editorDescr.destroy();
}

}

