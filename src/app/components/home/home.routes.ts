import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', loadComponent: () => import( './home' ).then( m => m.Home ),
    children: [
      { path: '', loadChildren: () => import( '../data-view/view.routes' ).then( m => m.routes ) },
      { path: 'profile', loadComponent: () => import( '../profile/profile' ).then( m => m.Profile ) },
    ]
  }
];