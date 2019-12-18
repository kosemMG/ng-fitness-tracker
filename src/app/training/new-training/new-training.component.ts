import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Observable, Subscription } from "rxjs";

import { Store } from '@ngrx/store';

import { TrainingService } from "../training.service";
// import { UIService } from "../../shared/ui.service";
import { Exercise } from "../exercise.model";
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[];
  isLoading$: Observable<boolean>;
  private exercisesSubscription: Subscription;
  // private loadingSubscription: Subscription;

  constructor(private trainingService: TrainingService,
              // public uiService: UIService,
              private store: Store<fromRoot.State>) { }

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    // this.loadingSubscription = this.uiService.loadedStateChange
    //   .subscribe(loadedState => this.isLoading = loadedState);
    this.exercisesSubscription = this.trainingService.exercisesChanged
      .subscribe(exercises => this.exercises = exercises);
    this.fetchExercises();
  }

  ngOnDestroy(): void {
    if (this.exercisesSubscription) {
      this.exercisesSubscription.unsubscribe();
    }
    // if (this.loadingSubscription) {
    //   this.loadingSubscription.unsubscribe();
    // }
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm): void {
    const id = form.value.selectedExercise;
    this.trainingService.startExercise(id);
  }
}
