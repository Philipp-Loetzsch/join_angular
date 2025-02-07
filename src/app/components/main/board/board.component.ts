import { Component, OnInit } from '@angular/core';
import { UserDatasService } from '../../../services/user-datas.service';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Tasks } from '../../../interfaces/interfaces';
import { AddTaskComponent } from '../add-task/add-task.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    AddTaskComponent,
    TaskDetailComponent,
    CdkDropList,
    CdkDrag,
  ],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  providers: [],
})
export class BoardComponent implements OnInit {
  allTasks: Tasks[] = [];
  tasksTodo: Tasks[] = [];
  tasksInProgress: Tasks[] = [];
  tasksAwaitFeedback: Tasks[] = [];
  tasksDone: Tasks[] = [];
  showAddTask: boolean = false;
  showTaskDetails: boolean = false;
  status!: string;
  chosenTask!: Tasks;
  private updateTimeout: any;

  constructor(private userDataService: UserDatasService) {}

  ngOnInit(): void {
    const checkTasks = () => {
      if (this.userDataService.tasks.length > 0) {
        this.getTasks();
      } else {
        setTimeout(checkTasks, 200);
      }
    };
    checkTasks();
  }

  getTasks() {
    const allTasks = this.userDataService.tasks;
    const filterAndSortTasks = (status: string) => {
      return allTasks
        .filter((task) => task.status === status)
        .sort((a, b) => a.position - b.position);
    };
    this.tasksTodo = filterAndSortTasks('todo');
    this.tasksInProgress = filterAndSortTasks('inProgress');
    this.tasksAwaitFeedback = filterAndSortTasks('feedback');
    this.tasksDone = filterAndSortTasks('done');
  }

  openAddTask(status: string) {
    this.showAddTask = true;
    this.status = status;
  }

  openDetailCard(task: string, i: number): void {
    const taskNames = [
      'tasksTodo',
      'tasksInProgress',
      'tasksAwaitFeedback',
      'tasksDone',
    ];
    const validTask = this[task as keyof BoardComponent] as Tasks[];
    if (taskNames.includes(task)) this.chosenTask = validTask[i];

    console.log(this.chosenTask.title + '' + i);

    this.showTaskDetails = true;
  }

  drop(event: CdkDragDrop<Tasks[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.updateStatus(event);
    }
    event.container.data.forEach((task, index) => {
      task.position = index;
    });
    this.setAllTasks();
  }

  updateStatus(event: CdkDragDrop<Tasks[], Tasks[], any>) {
    const statusMap = new Map([
      [this.tasksTodo, 'todo'],
      [this.tasksInProgress, 'inProgress'],
      [this.tasksAwaitFeedback, 'feedback'],
      [this.tasksDone, 'done'],
    ]);
    const movedTask = event.container.data[event.currentIndex];
    const newStatus = statusMap.get(event.container.data);
    if (newStatus) {
      movedTask.status = newStatus;
    }
  }

  setAllTasks() {
    clearTimeout(this.updateTimeout);
      this.updateTimeout = setTimeout(() => {
      this.allTasks = [
        ...this.tasksTodo,
        ...this.tasksInProgress,
        ...this.tasksAwaitFeedback,
        ...this.tasksDone,
      ];
      this.userDataService.updateTasks(this.allTasks);
    }, 800);
  }
}
