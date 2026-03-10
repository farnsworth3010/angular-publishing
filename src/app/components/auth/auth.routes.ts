import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', loadComponent: () => import( './auth' ).then( m => m.Auth ),
    children: [
      { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
      { path: 'sign-in', loadComponent: () => import( './sign-in/sign-in' ).then( m => m.SignIn ) },
      // { path: 'sign-up', loadComponent: () => import( './sign-up/sign-up' ).then( m => m.SignUp ) },
    ]
  },
];
