import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from "rxjs";
import { Store } from "@ngrx/store";

import { AuthService } from "../../auth/auth.service";
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter<void>();
  public isAuth$: Observable<boolean>;
  // private authSubscription: Subscription;

  constructor(private authService: AuthService,
              private store: Store<fromRoot.State>) { }

  ngOnInit(): void {
    this.isAuth$ = this.store.select(fromRoot.getIsAuthenticated);
    // this.authSubscription = this.authService.authChange
    //   .subscribe(authStatus => this.isAuth = authStatus);
  }

  onCloseSidenav(): void {
    this.sidenavClose.emit();
  }

  onLogout(): void {
    this.onCloseSidenav();
    this.authService.logout();
  }
}
