import { Routes } from '@angular/router';
import { LogInComponent } from './components/landing-page/log-in/log-in.component';
import { SignInComponent } from './components/landing-page/sign-in/sign-in.component';
import { MainComponent } from './components/main/main.component';
import { SummaryComponent } from './components/main/summary/summary.component';
import { AddTaskComponent } from './components/main/add-task/add-task.component';
import { BoardComponent } from './components/main/board/board.component';
import { ContactsComponent } from './components/main/contacts/contacts.component';
import { HelpComponent } from './components/main/help/help.component';
import { LegalNoticeComponent } from './components/main/legal-notice/legal-notice.component';
import { PrivacyPolicyComponent } from './components/main/privacy-policy/privacy-policy.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent, 
    children: [
      { path: '', component: LogInComponent },
      { path: 'sign_in', component: SignInComponent },
    ]
  },

  { path: 'main', component: MainComponent,
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
