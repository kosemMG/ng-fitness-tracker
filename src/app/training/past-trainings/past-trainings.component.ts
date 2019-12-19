import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
// import { Subscription } from 'rxjs';

import { Store } from "@ngrx/store";

import { Exercise } from "../exercise.model";
import { TrainingService } from "../training.service";
import { MatPaginator } from "@angular/material/paginator";
import * as fromTraining from '../training.reducer';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, {static: false }) paginator: MatPaginator;
  public displayedColumns: string[] = ['date', 'name', 'duration', 'calories', 'state'];
  public dataSource = new MatTableDataSource<Exercise>();
  // private exerciseSubscription: Subscription;

  constructor(private trainingService: TrainingService,
              private store: Store<fromTraining.State>) { }

  ngOnInit(): void {
    this.store.select(fromTraining.getFinishedExercises)
      .subscribe((finishedExercises: Exercise[]) => this.dataSource.data = finishedExercises);
    this.trainingService.fetchCompletedOrCancelledExercises();
    // this.exerciseSubscription = this.trainingService.finishedExercisesChanged
    //   .subscribe((exercises: Exercise[]) => this.dataSource.data = exercises);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
