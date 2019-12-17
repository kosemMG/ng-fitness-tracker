import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";

import { TrainingService } from "../training.service";
import { Exercise } from "../exercise.model";

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[];
  private exercisesSubscription: Subscription;

  constructor(private trainingService: TrainingService) { }

  ngOnInit(): void {
    this.trainingService.fetchAvailableExercises();
    this.exercisesSubscription = this.trainingService.exercisesChanged
      .subscribe(exercises => this.exercises = exercises);
  }

  ngOnDestroy(): void {
    this.exercisesSubscription.unsubscribe();
  }

  onStartTraining(form: NgForm): void {
    const id = form.value.selectedExercise;
    this.trainingService.startExercise(id);
  }
}
