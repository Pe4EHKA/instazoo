import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Post} from '../../models/Post';
import {PostService} from '../../service/post.service';
import {ImageUploadService} from '../../service/image-upload.service';
import {NotificationService} from '../../service/notification.service';
import {Router} from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';


@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('500ms ease-out', style({ opacity: 0 })),
      ]),
    ]),
  ]
})
export class AddPostComponent implements OnInit {

  // @ts-ignore
  postForm: FormGroup;
  // @ts-ignore
  selectedFile: File;
  isPostCreated = false;
  // @ts-ignore
  createdPost: Post;
  previewImgURL: any;

  constructor(private postService: PostService,
              private imageUploadService: ImageUploadService,
              private notificationService: NotificationService,
              private router: Router,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.postForm = this.createPostForm();
  }

  createPostForm(): FormGroup {
    return this.fb.group({
      title: ['', Validators.compose([Validators.required])],
      caption: ['', Validators.compose([Validators.required])],
      location: ['', Validators.compose([Validators.required])],
    });
  }

  submit(): void {

    this.postService.createPost({
      title: this.postForm.value.title,
      caption: this.postForm.value.caption,
      location: this.postForm.value.location,
    }).subscribe(data => {
      this.createdPost = data;
      console.log(data);

      if (this.createdPost.id != null) {
        this.imageUploadService.uploadImageToPost(this.selectedFile, this.createdPost.id)
          .subscribe(() => {
            this.notificationService.showSnackBar('Post created successfully');
            this.isPostCreated = true;
            this.router.navigate(['/profile']);
          });
      }
    });
  }

  // @ts-ignore
  onFileSelected(event): void {
    this.selectedFile = event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = (e) => {
      this.previewImgURL = reader.result;
    };
  }

}
