import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { take } from 'rxjs/operators';

import { Store } from "@ngrx/store";

import { StopTrainingComponent } from "./stop-training.component";
import { TrainingService } from "../training.service";
import { Exercise } from "../exercise.model";
import * as fromTraining from '../training.reducer';
import * as Training from '../training.actions';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {
  public progress = 0;
  private timer: number;
  // private exerciseSubscription: Subscription;

  constructor(private dialog: MatDialog,
              private trainingService: TrainingService,
              private store: Store<fromTraining.State>) { }

  ngOnInit(): void {
    // this.exerciseSubscription = this.trainingService.exerciseSwitched
    //   .subscribe(exercise => {
    //     console.log('CurrentTrainingComponent runningExercise:', exercise);
    //     if (exercise) {
    //       this.runningExercise = exercise;
    //     }
    //   });
    this._startOrResumeTimer();
  }

  private _startOrResumeTimer(): void {
    this.store.select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((exercise: Exercise) => {
        const stepTime = exercise.duration / 100 * 1000;
        this.timer = setInterval(() => {
          this.progress++;
          if (this.progress >= 100) {
            this.trainingService.completeExercise();
            clearInterval(this.timer);
          }
        }, stepTime);
      });
  }

  onStopTimer() {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: { progress: this.progress }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.trainingService.cancelExercise(this.progress);
        } else {
          this._startOrResumeTimer();
        }
      });
  }
}
