import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { Subscription } from "rxjs";

import { StopTrainingComponent } from "./stop-training.component";
import { TrainingService } from "../training.service";
import { Exercise } from "../exercise.model";

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit, OnDestroy {
  progress = 0;
  timer: number;
  private runningExercise: Exercise;
  private exerciseSubscription: Subscription;

  constructor(private dialog: MatDialog,
              private trainingService: TrainingService) { }

  ngOnInit(): void {
    this.exerciseSubscription = this.trainingService.exerciseSwitched
      .subscribe(exercise => {
        console.log('CurrentTrainingComponent runningExercise:', exercise);
        if (exercise) {
          this.runningExercise = exercise;
        }
      });
    this._startOrResumeTimer();
  }

  ngOnDestroy(): void {
    this.exerciseSubscription.unsubscribe();
  }

  private _startOrResumeTimer(): void {
    const stepTime = this.trainingService.currentExercise.duration / 100 * 1000;
    this.timer = setInterval(() => {
      this.progress++;
      if (this.progress >= 100) {
        this.trainingService.completeExercise();
        clearInterval(this.timer);
      }
    }, stepTime);
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
