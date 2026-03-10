import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', loadComponent: () => import( './home' ).then( m => m.Home ),
    children: [
      { path: '', loadComponent: () => import( '../data-view/data-view' ).then( m => m.DataView ) },
      { path: 'profile', loadComponent: () => import( '../profile/profile' ).then( m => m.Profile ) },
    ]
  }
];