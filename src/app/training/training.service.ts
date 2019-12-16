import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

import { Exercise } from "./exercise.model";

@Injectable({ providedIn: 'root' })
export class TrainingService {
  public exerciseSwitched = new Subject<Exercise | null>();
  private availableExercises: Exercise[] = [
    { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 },
  ];
  private runningExercise: Exercise;
  private doneExercises: Exercise[] = [];

  public get exercises() {
    return [...this.availableExercises];
  }

  public get completedOrCancelledExercises() {
    return [...this.doneExercises];
  }

  public get currentExercise() {
    return { ...this.runningExercise };
  }

  public startExercise(id: string) {
    this.runningExercise = this.availableExercises.find(exercise => exercise.id === id);
    console.log('TrainingService runningExercise:', this.runningExercise);
    this.exerciseSwitched.next({ ...this.runningExercise });
  }

  public completeExercise() {
    this.doneExercises.push({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed'
    });
    this.runningExercise = null;
    this.exerciseSwitched.next(null);
  }

  public cancelExercise(progress: number) {
    this.doneExercises.push({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled'
    });
    this.runningExercise = null;
    this.exerciseSwitched.next(null);
  }
}
