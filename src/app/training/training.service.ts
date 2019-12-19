import { Injectable } from '@angular/core';
import { Subscription } from "rxjs";
import { map, take } from "rxjs/operators";

import { AngularFirestore } from 'angularfire2/firestore';
import { Store } from '@ngrx/store';

import { UIService } from "../shared/ui.service";
import { Exercise } from "./exercise.model";
import * as fromTraining from './training.reducer';
import * as Training from './training.actions';
import * as UI from '../shared/ui.actions';

@Injectable({ providedIn: 'root' })
export class TrainingService {
  // public exerciseSwitched = new BehaviorSubject<Exercise | null>(null);
  // public exercisesChanged = new Subject<Exercise[] | null>();
  // public finishedExercisesChanged = new Subject<Exercise[]>();
  // private availableExercises: Exercise[] = [];
  // private runningExercise: Exercise;
  private firebaseSubscriptions: Subscription[] = [];

  constructor(private db: AngularFirestore,
              private uiService: UIService,
              private store: Store<fromTraining.State>) {
  }

  public fetchAvailableExercises() {
    const errorMessage = 'Fetching exercises failed, please try again later.';
    this.store.dispatch(new UI.StartLoading());
    // this.uiService.loadedStateChange.next(true);
    const subscription = this.db.collection('availableExercises').snapshotChanges()
      .pipe(
        map(docArray => docArray.map(doc => ({
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          } as Exercise
        ))))
      .subscribe((exercises: Exercise[]) => {
        // this.uiService.loadedStateChange.next(false);
        // this.availableExercises = exercises;
        // this.exercisesChanged.next([...this.availableExercises]);
        this.store.dispatch(new UI.StopLoading());
        this.store.dispatch(new Training.SetAvailableExercises(exercises));
      }, error => {
        // this.uiService.loadedStateChange.next(false);
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar(errorMessage, 3500);
        // this.exercisesChanged.next(null);
        this.store.dispatch(new Training.SetAvailableExercises(null));
      });
    this.firebaseSubscriptions.push(subscription);
  }

  public fetchCompletedOrCancelledExercises() {
    const subscription = this.db.collection('finishedExercises').valueChanges()
      // .subscribe((exercises: Exercise[]) => this.finishedExercisesChanged.next(exercises));
      .subscribe((exercises: Exercise[]) => this.store.dispatch(new Training.SetFinishedExercises(exercises)));
    this.firebaseSubscriptions.push(subscription);
  }

  public cancelFirebaseSubscriptions() {
    this.firebaseSubscriptions.forEach(subscription => subscription.unsubscribe());
  }

  // public get currentExercise() {
  //   return { ...this.runningExercise };
  // }

  public startExercise(id: string) {
    // this.runningExercise = this.availableExercises.find(exercise => exercise.id === id);
    // this.exerciseSwitched.next({ ...this.runningExercise });
    this.store.dispatch(new Training.StartTraining(id));
  }

  public completeExercise() {
    this.store.select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((exercise: Exercise) => {
        this.addToDatabase({
          ...exercise,
          date: new Date(),
          state: 'completed'
        });
        this.store.dispatch(new Training.StopTraining());
      });
    // this.runningExercise = null;
    // this.exerciseSwitched.next(null);
  }

  public cancelExercise(progress: number) {
    this.store.select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((exercise: Exercise) => {
        this.addToDatabase({
          ...exercise,
          duration: exercise.duration * (progress / 100),
          calories: exercise.calories * (progress / 100),
          date: new Date(),
          state: 'cancelled'
        });
        this.store.dispatch(new Training.StopTraining());
      });
    // this.runningExercise = null;
    // this.exerciseSwitched.next(null);
  }

  private addToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise)
      .catch(error => console.log(error));
  }
}
