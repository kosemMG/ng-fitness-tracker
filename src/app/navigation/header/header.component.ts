import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {Observable, Subscription} from "rxjs";
import { Store } from "@ngrx/store";

import { AuthService } from "../../auth/auth.service";
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() sidenavToggle = new EventEmitter<void>();
  public isAuth$: Observable<boolean>;
  // private authSubscription: Subscription;

  constructor(private store: Store<fromRoot.State>,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.isAuth$ = this.store.select(fromRoot.getIsAuthenticated);
    // this.authSubscription = this.authService.authChange
    //   .subscribe(authStatus => this.isAuth = authStatus);
  }

  onToggleSidenav(): void {
    this.sidenavToggle.emit();
  }

  onLogout(): void {
    this.authService.logout();
  }
}
