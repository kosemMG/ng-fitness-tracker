import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from "rxjs";
import { map } from "rxjs/operators";

import { AngularFirestore } from 'angularfire2/firestore';

import { UIService } from "../shared/ui.service";
import { Exercise } from "./exercise.model";

@Injectable({ providedIn: 'root' })
export class TrainingService {
  public exerciseSwitched = new BehaviorSubject<Exercise | null>(null);
  public exercisesChanged = new Subject<Exercise[] | null>();
  public finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  private firebaseSubscriptions: Subscription[] = [];

  constructor(private db: AngularFirestore, private uiService: UIService) {
  }

  public fetchAvailableExercises() {
    const errorMessage = 'Fetching exercises failed, please try again later.';
    this.uiService.loadedStateChange.next(true);
    const subscription = this.db.collection('availableExercises').snapshotChanges()
      .pipe(
        map(docArray => docArray.map(doc => ({
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          } as Exercise
        ))))
      .subscribe((exercises: Exercise[]) => {
        this.uiService.loadedStateChange.next(false);
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises]);
      }, error => {
        this.uiService.loadedStateChange.next(false);
        this.uiService.showSnackbar(errorMessage, 3500);
        this.exercisesChanged.next(null);
      });
    this.firebaseSubscriptions.push(subscription);
  }

  public fetchCompletedOrCancelledExercises() {
    const subscription = this.db.collection('finishedExercises').valueChanges()
      .subscribe((exercises: Exercise[]) => this.finishedExercisesChanged.next(exercises));
    this.firebaseSubscriptions.push(subscription);
  }

  public cancelFirebaseSubscriptions() {
    this.firebaseSubscriptions.forEach(subscription => subscription.unsubscribe());
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
    this.addToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed'
    });
    this.runningExercise = null;
    this.exerciseSwitched.next(null);
  }

  public cancelExercise(progress: number) {
    this.addToDatabase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled'
    });
    this.runningExercise = null;
    this.exerciseSwitched.next(null);
  }

  private addToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise)
      .catch(error => console.log(error));
  }
}
