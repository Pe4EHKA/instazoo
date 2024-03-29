import { Component, OnInit } from '@angular/core';
import {Post} from '../../models/Post';
import {User} from '../../models/User';
import {PostService} from '../../service/post.service';
import {UserService} from '../../service/user.service';
import {CommentService} from '../../service/comment.service';
import {NotificationService} from '../../service/notification.service';
import {ImageUploadService} from '../../service/image-upload.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class IndexComponent implements OnInit {

  isPostsLoaded = false;
  // @ts-ignore
  posts: Post[];
  isUserDataLoaded = false;
  // @ts-ignore
  user: User;
  selectedImage: any;

  constructor(private postService: PostService,
              private userService: UserService,
              private commentService: CommentService,
              private notificationService: NotificationService,
              private imageService: ImageUploadService
  ) { }

  ngOnInit(): void {
    this.postService.getAllPosts()
      .subscribe(data => {
        console.log(data);
        this.posts = data;
        this.getImagesToPosts(this.posts);
        this.getCommentsToPosts(this.posts);
        this.isPostsLoaded = true;
      });

    this.userService.getCurrentUser()
      .subscribe(data => {
        console.log(data);
        this.user = data;
        this.isUserDataLoaded = true;
      });
  }

  getImagesToPosts(posts: Post[]): void {
    posts.forEach(p => {
      this.imageService.getImageToPost(<number>p.id)
        // @ts-ignore
        .subscribe(data => {
          p.image = data.imageBytes;
        })
    });
  }

  getCommentsToPosts(posts: Post[]): void {
    posts.forEach(p => {
      this.commentService.getCommentsToPost(<number>p.id)
        .subscribe(data => {
          p.comments = data
        })
    });
  }

  likePost(postId : any, postIndex : any): void {
    const  post = this.posts[postIndex];
    console.log(post);


    if (!post.usersLiked?.includes(this.user.username)) {
      this.postService.likePost(postId, this.user.username)
        .subscribe(() => {

          post.usersLiked?.push(this.user.username);
          this.notificationService.showSnackBar('Liked!');
        });
    } else {
      this.postService.likePost(postId, this.user.username)
        .subscribe(() => {

          const index = post.usersLiked?.indexOf(this.user.username, 0);
          // @ts-ignore
          if (index > -1) {

            // @ts-ignore
            post.usersLiked?.splice(index, 1);
          }
        });
    }
  }

  postComment(message: any, postId: any, postIndex: any): void {
    const post = this.posts[postIndex];

    console.log(post);
    this.commentService.addToCommentToPost(postId, message)
      .subscribe(data => {
        console.log(data);
        // @ts-ignore
        post.comments.push(data);
      });
  }

  formatImage(img: any): any {
    if (img == null) {
      return null;
    }
    return 'data:image/jpeg;base64,' + img;
  }

  openFullScreenImage(image: any): void {
    this.selectedImage = image;
  }
}
