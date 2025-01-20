export interface Contact {
  name: string;
  email: string;
  phone: string;
  color: string;
  id:string;
}

export interface Tasks {
  assignedTo: Assigned[];
  subtasks:string[];
  description: string;
  dueDate: number;
  prio: string;
  status: string;
  title: string;
  category:string;
  id: string;
}

export interface Assigned{
  name:string;
  id:string;
  color:string;
  shortcut:string;
}