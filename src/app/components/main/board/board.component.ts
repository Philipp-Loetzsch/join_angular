import { Component, OnInit } from '@angular/core';
import { UserDatasService } from '../../../services/user-datas.service';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Tasks } from '../../../interfaces/interfaces';
import { AddTaskComponent } from '../add-task/add-task.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule, AddTaskComponent, TaskDetailComponent],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  providers: [],
})
export class BoardComponent implements OnInit {
  allTasks: Tasks[] = [];
  tasksTodo:Tasks[]=[]
  tasksInProgress:Tasks[]=[]
  tasksAwaitFeedback:Tasks[]=[]
  tasksDone:Tasks[]=[]
  showAddTask: boolean = false;
  showTaskDetails:boolean = false
  status!: string;
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
          checkTasks()

  }

  getTasks() {
    const allTasks = this.userDataService.tasks; // Fetch all tasks
    this.tasksTodo = allTasks.filter((task) => task.status === 'todo');
    this.tasksInProgress = allTasks.filter((task) => task.status === 'inProgress');
    this.tasksAwaitFeedback = allTasks.filter((task) => task.status === 'feedback');
    this.tasksDone = allTasks.filter((task) => task.status === 'done');
  }

  openAddTask(status: string) {
    this.showAddTask = true;
    this.status = status;
  }

  openDetailCard(task: string , i:number){
    this.chosenTask = this.tasksDone[i];
    console.log(this.chosenTask + '' + i);
    
    this.showTaskDetails=true
  }
}

// import { Component, OnInit } from '@angular/core';
// import { UserDatasService } from '../../../services/user-datas.service';
// import { CommonModule } from '@angular/common';
// import { MatProgressBarModule } from '@angular/material/progress-bar';
// import {
//   DragDropModule,
//   CdkDragDrop,
//   moveItemInArray,
//   transferArrayItem,
// } from '@angular/cdk/drag-drop';
// import { Tasks } from '../../../interfaces/interfaces';
// import { AddTaskComponent } from '../add-task/add-task.component';
// import { TaskDetailComponent } from './task-detail/task-detail.component';

// type TaskGroup = {
//   id: string;
//   title: string;
//   tasks: Tasks[];
// };
// @Component({
//   selector: 'app-board',
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatProgressBarModule,
//     DragDropModule,
//     AddTaskComponent,
//     TaskDetailComponent
//   ],
//   templateUrl: './board.component.html',
//   styleUrls: ['./board.component.scss'],
// })
// export class BoardComponent implements OnInit {
//   tasksTodo: Tasks[] = [];
//   tasksInProgress: Tasks[] = [];
//   tasksAwaitFeedback: Tasks[] = [];
//   tasksDone: Tasks[] = [];
//   showAddTask: boolean = false;
//   status!: string;
//   tasks: TaskGroup[] = [];
//   showTaskDetails:boolean = false 
//   chosenTask!:Tasks
//   constructor(private userDataService: UserDatasService) {}

//   ngOnInit(): void {
//     const checkTasks = () => {
//       if (this.userDataService.tasks.length > 0) {
//         this.getTasks();
//       } else {
//         setTimeout(checkTasks, 200);
//       }
//     };
//     checkTasks();
//   }

//   /**
//    * Fetch tasks from the service and group them by their status.
//    */
//   getTasks() {
//     const allTasks = this.userDataService.tasks; // Fetch all tasks
//     this.tasksTodo = allTasks.filter((task) => task.status === 'todo');
//     this.tasksInProgress = allTasks.filter((task) => task.status === 'inProgress');
//     this.tasksAwaitFeedback = allTasks.filter((task) => task.status === 'feedback');
//     this.tasksDone = allTasks.filter((task) => task.status === 'done');
//     this.tasks = [
//       { id: 'todo', title: 'To do', tasks: this.tasksTodo },
//       {
//         id: 'in Progress',
//         title: 'In progress',
//         tasks: this.tasksInProgress,
//       },
//       {
//         id: 'feedback',
//         title: 'Await feedback',
//         tasks: this.tasksAwaitFeedback,
//       },
//       { id: 'done', title: 'Done', tasks: this.tasksDone },
//     ];
//     console.log(this.tasks);
//   }

//   drop(event: CdkDragDrop<Tasks[]>) {
//     if (event.previousContainer === event.container) {
//       // Sortieren innerhalb derselben Liste
//       moveItemInArray(
//         event.container.data,
//         event.previousIndex,
//         event.currentIndex
//       );
//     } else {
//       // Verschieben zwischen verschiedenen Listen
//       transferArrayItem(
//         event.previousContainer.data,
//         event.container.data,
//         event.previousIndex,
//         event.currentIndex
//       );
//       const movedTask = event.container.data[event.currentIndex];
//       movedTask.status = this.getStatusFromContainerId(event.container.id);
//     }
//   }

//   // Status des Tasks aktualisieren
//   getStatusFromContainerId(containerId: string): string {
//     switch (containerId) {
//       case 'todo':
//         return 'todo';
//       case 'inProgress':
//         return 'inprogress';
//       case 'awaitFeedback':
//         return 'feedback';
//       case 'done':
//         return 'done';
//       default:
//         return '';
//     }
//   }

//   /**
//    * Opens the Add Task dialog with the given status.
//    */
//   openAddTask(status: string) {
//     this.showAddTask = true;
//     this.status = status;
//     console.log(status);
    
//   }

//   openCardDetail(i:number){
//     this.showTaskDetails = true
//   }

  // updateTaskStatus(updatedTask: Tasks) {
  //   const index = this.tasks.findIndex(task => task.id === updatedTask.id);
  //   if (index !== -1) {
  //     this.tasks[index] = updatedTask;
  //   }
  // }
//}
