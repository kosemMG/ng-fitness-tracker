import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";

import { TrainingService } from "../training.service";
import { UIService } from "../../shared/ui.service";
import { Exercise } from "../exercise.model";

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[];
  isLoading = false;
  private exercisesSubscription: Subscription;
  private loadingSubscription: Subscription;

  constructor(private trainingService: TrainingService, public uiService: UIService) { }

  ngOnInit(): void {
    this.loadingSubscription = this.uiService.loadedStateChange
      .subscribe(loadedState => this.isLoading = loadedState);
    this.exercisesSubscription = this.trainingService.exercisesChanged
      .subscribe(exercises => this.exercises = exercises);
    this.fetchExercises();
  }

  ngOnDestroy(): void {
    if (this.exercisesSubscription) {
      this.exercisesSubscription.unsubscribe();
    }
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm): void {
    const id = form.value.selectedExercise;
    this.trainingService.startExercise(id);
  }
}
