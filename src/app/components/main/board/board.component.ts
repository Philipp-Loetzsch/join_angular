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
  imports: [CommonModule, MatProgressBarModule, AddTaskComponent, TaskDetailComponent, CdkDropList, CdkDrag],
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
    const filterAndSortTasks = (status:string) => {
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

  openDetailCard(task: string , i:number):void{
    const taskNames = ['tasksTodo', 'tasksInProgress', 'tasksAwaitFeedback', 'tasksDone']
    const validTask = this[task as keyof BoardComponent] as Tasks[]
    if(taskNames.includes(task)) this.chosenTask = validTask[i];
   
    console.log(this.chosenTask.title + '' + i);
    
    this.showTaskDetails=true
  }

  drop(event: CdkDragDrop<Tasks[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      event.container.data.forEach((task, index) => {
        task.position = index;
        console.log(task.title + '  ' + task.position);
      });
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      const movedTask = event.container.data[event.currentIndex];
      if (event.container.data === this.tasksTodo) {
        movedTask.status = 'todo';
        console.log(this.tasksTodo[event.currentIndex].status + ' ' + this.tasksTodo[event.currentIndex].title);
      } else if (event.container.data === this.tasksInProgress) {
        movedTask.status = 'inProgress';
        console.log(this.tasksInProgress[event.currentIndex].status);
      } else if (event.container.data === this.tasksAwaitFeedback) {
        movedTask.status = 'feedback';
        console.log(this.tasksAwaitFeedback[event.currentIndex].status);
      } else if (event.container.data === this.tasksDone) {
        movedTask.status = 'done';
        console.log(this.tasksDone[event.currentIndex].status);
      }
    }

    setTimeout(() => {
      // this.userDataService.updateTask()
    }, 2000);

  }
}