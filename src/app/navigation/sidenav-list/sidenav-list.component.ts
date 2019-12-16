import { Component, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';
import { Subscription } from "rxjs";

import { AuthService } from "../../auth/auth.service";

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {
  @Output() sidenavClose = new EventEmitter<void>();
  private authSubscription: Subscription;
  private isAuth = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authSubscription = this.authService.authChange
      .subscribe(authStatus => this.isAuth = authStatus);
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  onCloseSidenav(): void {
    this.sidenavClose.emit();
  }

  onLogout(): void {
    this.onCloseSidenav();
    this.authService.logout();
  }
}
