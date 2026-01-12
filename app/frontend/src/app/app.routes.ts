import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TransactionComponent } from './transaction/transaction.component';
import { AccountComponent } from './account/account.component';
import { BudgetComponent } from './budget/budget.component';
import { SavingGoalComponent } from './saving-goal/saving-goal.component';
import { ReportComponent } from './report/report.component';
import { CategoryComponent } from './category/category.component';
import { LayoutComponent } from './shared/layout.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'transactions', component: TransactionComponent },
      { path: 'accounts', component: AccountComponent },
      { path: 'budgets', component: BudgetComponent },
      { path: 'goals', component: SavingGoalComponent },
      { path: 'reports', component: ReportComponent },
      { path: 'categories', component: CategoryComponent },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '/dashboard' },
];
