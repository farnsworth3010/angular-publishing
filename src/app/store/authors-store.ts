import { inject } from '@angular/core';
import { Author, AuthorService } from '@app/api';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

interface AuthorsState {
  authors: Author[];
  loading: boolean;
  cols: { field: string, header: string, pipe?: any; }[];
}

const initialState: AuthorsState = {
  authors: [],
  loading: false,
  cols: [
    { field: 'id', header: 'ID' },
    { field: 'firstName', header: 'Firstname' },
    { field: 'lastName', header: 'Lastname' },
  ]
};

export const AuthorsStore = signalStore(
  { providedIn: 'root' },
  withState<AuthorsState>( initialState ),
  withMethods( ( store, authorService = inject( AuthorService ) ) => ( {
    setAuthors( authors: Author[] ) {
      patchState( store, { authors } );
    },
    setLoading( loading: boolean ) {
      patchState( store, { loading } );
    },
    get: rxMethod(
      pipe(
        tap( () => patchState( store, { loading: true } ) ),
        switchMap( () => authorService.authorControllerFindAll() ),
        tap( ( authors ) => patchState( store, { loading: false, authors } ) ),
      )
    )
  } ) )
);