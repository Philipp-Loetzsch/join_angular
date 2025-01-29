// import { Component, OnInit } from '@angular/core';
// import { UserDatasService } from '../../../services/user-datas.service';
// import { CommonModule } from '@angular/common';
// import { MatProgressBarModule } from '@angular/material/progress-bar';
// import { Tasks } from '../../../interfaces/interfaces';
// import { AddTaskComponent } from '../add-task/add-task.component';

// @Component({
//   selector: 'app-board',
//   standalone: true,
//   imports: [CommonModule, MatProgressBarModule, AddTaskComponent],
//   templateUrl: './board.component.html',
//   styleUrls: ['./board.component.scss'],
//   providers: [],
// })
// export class BoardComponent implements OnInit {
//   tasks: Tasks[] = [];
//   showAddTask: boolean = false;
//   status!: string;
//   constructor(private userDataService: UserDatasService) {}

//   ngOnInit(): void {
//     this.getTasks();
//   }

//   getTasks() {
//     this.tasks = this.userDataService.tasks;
//     if (this.tasks.length === 0) {
//       const contactInterval = setInterval(() => {
//         this.tasks = this.userDataService.tasks;
//         if (this.tasks.length >= 0) {
//           clearInterval(contactInterval);
//         }
//       }, 1000);
//     }
//   }

//   openAddTask(status: string) {
//     this.showAddTask = true;
//     this.status = status;
//   }
// }

import { Component, OnInit } from '@angular/core';
import { UserDatasService } from '../../../services/user-datas.service';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Tasks } from '../../../interfaces/interfaces';
import { AddTaskComponent } from '../add-task/add-task.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';

type TaskGroup = {
  id: string;
  title: string;
  tasks: Tasks[];
};
@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    DragDropModule,
    AddTaskComponent,
    TaskDetailComponent
  ],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  tasksTodo: Tasks[] = [];
  tasksInProgress: Tasks[] = [];
  tasksAwaitFeedback: Tasks[] = [];
  tasksDone: Tasks[] = [];
  showAddTask: boolean = false;
  status!: string;
  tasks: TaskGroup[] = [];
  showTaskDetails:boolean = false 
  chosenTask!:Tasks
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

  /**
   * Fetch tasks from the service and group them by their status.
   */
  getTasks() {
    const allTasks = this.userDataService.tasks; // Fetch all tasks
    this.tasksTodo = allTasks.filter((task) => task.status === 'todo');
    this.tasksInProgress = allTasks.filter((task) => task.status === 'inProgress');
    this.tasksAwaitFeedback = allTasks.filter((task) => task.status === 'feedback');
    this.tasksDone = allTasks.filter((task) => task.status === 'done');
    this.tasks = [
      { id: 'todo', title: 'To do', tasks: this.tasksTodo },
      {
        id: 'in Progress',
        title: 'In progress',
        tasks: this.tasksInProgress,
      },
      {
        id: 'feedback',
        title: 'Await feedback',
        tasks: this.tasksAwaitFeedback,
      },
      { id: 'done', title: 'Done', tasks: this.tasksDone },
    ];
    console.log(this.tasks);
  }

  /**
   * Handles drag-and-drop events to move tasks between columns.
   */
  // drop(event: CdkDragDrop<Tasks[]>) {
  //   if (event.previousContainer === event.container) {
  //     // Reorder tasks within the same column
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     // Move task to a different column
  //     transferArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );

  //     // Update the status of the task based on the target column
  //     const task = event.container.data[event.currentIndex];
  //     if (event.container.id === 'todoList') task.status = 'todo';
  //     if (event.container.id === 'inProgressList') task.status = 'in progress';
  //     if (event.container.id === 'awaitFeedbackList') task.status = 'await feedback';
  //     if (event.container.id === 'doneList') task.status = 'done';

  //     // Optionally: Save the updated status in the service or backend
  //     // this.userDataService.updateTaskStatus(task);
  //   }
  // }
  drop(event: CdkDragDrop<Tasks[]>) {
    if (event.previousContainer === event.container) {
      // Sortieren innerhalb derselben Liste
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // Verschieben zwischen verschiedenen Listen
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const movedTask = event.container.data[event.currentIndex];
      movedTask.status = this.getStatusFromContainerId(event.container.id);
    }
  }

  // Status des Tasks aktualisieren
  getStatusFromContainerId(containerId: string): string {
    switch (containerId) {
      case 'todo':
        return 'todo';
      case 'inProgress':
        return 'inprogress';
      case 'awaitFeedback':
        return 'feedback';
      case 'done':
        return 'done';
      default:
        return '';
    }
  }

  /**
   * Opens the Add Task dialog with the given status.
   */
  openAddTask(status: string) {
    this.showAddTask = true;
    this.status = status;
    console.log(status);
    
  }

  openCardDetail(i:number){
    this.showTaskDetails = true
  }

  // updateTaskStatus(updatedTask: Tasks) {
  //   const index = this.tasks.findIndex(task => task.id === updatedTask.id);
  //   if (index !== -1) {
  //     this.tasks[index] = updatedTask;
  //   }
  // }
}
