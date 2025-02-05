export interface Contact {
  name: string;
  email: string;
  phone: string;
  color: string;
  id:string;
  shortcut:string;
}

export interface Tasks {
  assignedTo: Assigned[];
  subtasks:Subtask[];
  description: string;
  dueDate: number;
  prio: string;
  status: string;
  title: string;
  category:string;
  position: number;
  id: string;
}

export interface Assigned{
  name:string;
  id:string;
  color:string;
  shortcut:string;
}

export interface Subtask{
  title:string;
  complete: boolean;
}