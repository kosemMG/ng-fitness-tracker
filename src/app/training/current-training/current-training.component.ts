import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";

import { StopTrainingComponent } from "./stop-training.component";

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {
  @Output() trainingEnd = new EventEmitter<void>();
  progress = 0;
  timer: number;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this._startOrResumeTimer();
  }

  private _startOrResumeTimer() {
    this.timer = setInterval(() => {
      this.progress++;
      if (this.progress >= 100) {
        clearInterval(this.timer);
      }
    }, 200);
  }

  onStopTimer() {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent);
    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.trainingEnd.emit();
        } else {
          this._startOrResumeTimer();
        }
      });
  }
}
