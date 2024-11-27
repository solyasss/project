import { Routes } from '@angular/router';
import {AuthGuard} from "./auth.guard";

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home-page',
    pathMatch: 'full'
  },
  {
    path: 'home-page',
    loadComponent: () => import('./pages/home-page/home-page.component').then(m => m.HomePageComponent)
  },
  {
    path: 'token-info-page',
    loadComponent: () => import('./pages/token-info-page/token-info-page.component').then(m => m.TokenInfoPageComponent)
  },
  {
    path: 'markets-page',
    loadComponent: () => import('./pages/markets-page/markets-page.component').then(m => m.MarketsPageComponent)
  },
  {
    path: 'login-page',
    loadComponent: () => import('./pages/login-page/login-page.component').then(m => m.LoginPageComponent)
  },
  {
    path: 'final-page',
    loadComponent: () => import('./pages/final-page/final-page.component').then(m => m.FinalPageComponent)
  },
  //Админка
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin-panel/admin-panel.component').then((m) => m.AdminPanelComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'coins',
        loadComponent: () =>
          import('./admin-panel/components/coins/coins.component').then((m) => m.CoinsComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./admin-panel/components/users/users.component').then((m) => m.UsersComponent),
      },
    ],
  },
  //Страница битой ссылки
  {
    path: '**',
    loadComponent: () => import('./pages/page-404/page-404.component').then(m => m.Page404Component)
  }
];


