export class ChosenContact {
    name:string;
    email:string;
    phone:string;
    color:string;
    id:string;
    shortcut:string;

    constructor(obj?: ChosenContact){
        this.name = obj ? obj.name : '';
        this.email= obj ? obj.email :'';
        this.phone= obj ? obj.phone :'';
        this.color= obj ? obj.color :'#D1D1D1';
        this.id= obj ? obj.id : '';
        this.shortcut = obj ? obj.shortcut : ''
    }
}
