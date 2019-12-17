import { AfterViewInit, Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { Subscription } from 'rxjs';

import { Exercise } from "../exercise.model";
import { TrainingService } from "../training.service";
import { MatPaginator } from "@angular/material/paginator";

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, {static: false }) paginator: MatPaginator;
  public displayedColumns: string[] = ['date', 'name', 'duration', 'calories', 'state'];
  public dataSource = new MatTableDataSource<Exercise>();
  private exerciseSubscription: Subscription;

  constructor(private trainingService: TrainingService) { }

  ngOnInit(): void {
    this.exerciseSubscription = this.trainingService.finishedExercisesChanged
      .subscribe((exercises: Exercise[]) => this.dataSource.data = exercises);
    this.trainingService.fetchCompletedOrCancelledExercises();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.exerciseSubscription.unsubscribe();
  }

  public doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
