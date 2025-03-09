import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

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
    FormsModule,
  ],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  providers: [],
})
export class BoardComponent implements OnInit, OnDestroy {
  allTasks: Tasks[] = [];
  tasksTodo: Tasks[] = [];
  tasksInProgress: Tasks[] = [];
  tasksAwaitFeedback: Tasks[] = [];
  tasksDone: Tasks[] = [];
  showAddTask: boolean = false;
  showTaskDetails: boolean = false;
  status!: string;
  chosenTask!: Tasks;
  private tasksSubscription!: Subscription;
  private updateTimeout: any;
  filteredTasks: Tasks[] = [];
  searchQuery: string = '';  
  draggedIndex: number | null = null;

  constructor(private userDataService: UserDatasService) {}

  ngOnInit(): void {
    this.tasksSubscription = this.userDataService.tasks$.subscribe((tasks) => {
      this.allTasks = tasks;
      this.getTasks();
    });
  }

  getTasks() {
    const filterAndSortTasks = (status: string) => {
      return this.allTasks
        .filter((task) => task.status === status)
        .sort((a, b) => a.position - b.position);
    };
    this.tasksTodo = filterAndSortTasks('todo');
    this.tasksInProgress = filterAndSortTasks('inProgress');
    this.tasksAwaitFeedback = filterAndSortTasks('feedback');
    this.tasksDone = filterAndSortTasks('done');
  }

  filterTasks() {
    const query = this.searchQuery.toLowerCase();
    if (!query) {
      this.getTasks();
      return;
    }   
    const matchesQuery = (task: Tasks) =>  task.title.toLowerCase().includes(query) || task.description.toLowerCase().includes(query);
    this.tasksTodo = this.allTasks.filter(task => task.status === 'todo' && matchesQuery(task));
    this.tasksInProgress = this.allTasks.filter(task => task.status === 'inProgress' && matchesQuery(task));
    this.tasksAwaitFeedback = this.allTasks.filter(task => task.status === 'feedback' && matchesQuery(task));
    this.tasksDone = this.allTasks.filter(task => task.status === 'done' && matchesQuery(task));
  }

  ngOnDestroy(): void {
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
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

  getCompletedSubtasks(task: any): number {
    return task.subtasks.filter((subtask: any) => subtask.complete).length;
  }

  getProgress(task: any): number {
    if (!task.subtasks || task.subtasks.length === 0) return 0;
    const completed = task.subtasks.filter((subtask: any) => subtask.complete).length;
    return (completed / task.subtasks.length) * 100;
  }


  onDragStarted(index: number) {
    this.draggedIndex = index;
  }

  onDragEnded(index: number) {
    if (this.draggedIndex === index) {
      this.draggedIndex = null;
    }
  }
}
