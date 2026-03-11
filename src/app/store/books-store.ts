import { DatePipe } from '@angular/common';
import { inject } from '@angular/core';
import { BookService } from '@app/api';
import { Author } from '@app/api/model/author';
import { Book } from '@app/api/model/book';
import { Category } from '@app/api/model/category';
import { ArrayItemPipe } from '@app/core/pipes/array-item-pipe';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

interface BooksState {
  books: Book[];
  loading: boolean;
  cols: { field: string, header: string, pipe?: any; pipeArgs?: any; }[];
}

const initialState: BooksState = {
  books: [],
  loading: false,
  cols: [
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Name' },
    { field: 'pages', header: 'Pages' },
    { field: 'value', header: 'Value' },
    { field: 'quantity', header: 'Quantity' },
    { field: 'publishingStart', header: 'Pub. Start', pipe: DatePipe },
    { field: 'publishingEnd', header: 'Pub. End', pipe: DatePipe },
    {
      field: 'categories', header: 'Categories', pipe: ArrayItemPipe, pipeArgs: ( values: Category[] ) => {
        return values.map( v => v.name ).join( ', ' );
      }
    },
    {
      field: 'authors', header: 'Authors', pipe: ArrayItemPipe, pipeArgs: ( values: Author[] ) => {
        return values.map( v => v.firstName + ' ' + v.lastName ).join( ', ' );
      },
    },
    // { field: 'bookMaterials', header: 'Materials', pipe: ArrayItemPipe }
  ]
};

export const BooksStore = signalStore(
  { providedIn: 'root' },
  withState<BooksState>( initialState ),
  withMethods( ( store, bookService = inject( BookService ) ) => ( {
    setBooks( books: Book[] ) {
      patchState( store, { books } );
    },
    setLoading( loading: boolean ) {
      patchState( store, { loading } );
    },
    get: rxMethod(
      pipe(
        tap( () => patchState( store, { loading: true } ) ),
        switchMap( () => bookService.bookControllerFindAll() ),
        tap( ( books ) => patchState( store, { loading: false, books } ) ),
      )
    )
  } ) )
);