import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', loadComponent: () => import( './data-view' ).then( m => m.DataView ),
    children: [
      { path: '', redirectTo: 'books', pathMatch: 'full' },
      { path: 'books', loadComponent: () => import( './views/books/books' ).then( m => m.Books ) },
      { path: 'authors', loadComponent: () => import( './views/authors/authors' ).then( m => m.Authors ) },
      { path: 'categories', loadComponent: () => import( './views/categories/categories' ).then( m => m.Categories ) },
      { path: 'sales', loadComponent: () => import( './views/sales/sales' ).then( m => m.Sales ) },
      { path: 'materials', loadComponent: () => import( './views/materials/materials' ).then( m => m.Materials ) },
      { path: 'news', loadComponent: () => import( './views/news/news' ).then( m => m.News ) },
    ]
  },
];
