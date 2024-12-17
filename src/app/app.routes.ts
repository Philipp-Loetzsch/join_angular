import { Routes } from '@angular/router';
import { LogInComponent } from './components/log-in/log-in.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { MainComponent } from './components/main/main.component';
import { SummaryComponent } from './components/summary/summary.component';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { BoardComponent } from './components/board/board.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { HelpComponent } from './components/help/help.component';
import { LegalNoticeComponent } from './components/legal-notice/legal-notice.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';

export const routes: Routes = [
  { path: '', component: LogInComponent },
  { path: 'sign_in', component: SignInComponent },
  { path: 'join', component: MainComponent,
    children: [
        {path:'summary', component: SummaryComponent},
        {path:'add_task', component: AddTaskComponent},
        {path:'board', component: BoardComponent},
        {path:'contacts', component: ContactsComponent},
        {path:'help', component: HelpComponent},
        {path:'legal_notice', component: LegalNoticeComponent},
        {path:'privacy_policy', component: PrivacyPolicyComponent},
    ]
   }
];
