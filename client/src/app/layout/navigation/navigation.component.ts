import { Component, OnInit } from '@angular/core';
import {User} from '../../models/User';
import {TokenStorageService} from '../../service/token-storage.service';
import {UserService} from '../../service/user.service';
import {Router} from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s ease', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('0.5s ease', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class NavigationComponent implements OnInit {

  isLoggedIn = false;  // Булевый оператор, чтобы отображать меню для афторизированного пользователя
  isDataLoaded = false;
  // @ts-ignore
  user: User;

  constructor(private tokenService: TokenStorageService,
              private userService: UserService,
              private router: Router) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenService.getToken();

    if(this.isLoggedIn) {
      this.userService.getCurrentUser()
        .subscribe(data => {
          this.user = data;
          this.isDataLoaded = true;
        })
    }
  }

  logout(): void {
    this.tokenService.logOut();
    this.router.navigate(['/login']);
  }

}
