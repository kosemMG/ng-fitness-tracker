import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({ providedIn: 'root' })
export class UIService {
  public loadedStateChange = new Subject<boolean>();

  constructor(private snackbar: MatSnackBar) {
  }

  showSnackbar(message: string, duration: number) {
    const snackbarRef = this.snackbar.open(message, 'Close', { duration });
    snackbarRef.onAction()
      .subscribe(() => snackbarRef.dismiss());
  }
}
