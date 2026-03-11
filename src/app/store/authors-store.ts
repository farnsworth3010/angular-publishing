import { inject, Injector, runInInjectionContext } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorService } from '@app/api';
import { Author } from '@app/api/model/author';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

interface AuthorsState {
  authors: Author[];
  loading: boolean;
  cols: { field: string, header: string, pipe?: any; link?: { label: string; action: ( injector: Injector, number: number ) => void; }; }[];
}

const initialState: AuthorsState = {
  authors: [],
  loading: false,
  cols: [
    { field: 'id', header: 'ID' },
    { field: 'firstName', header: 'Firstname' },
    { field: 'lastName', header: 'Lastname' },
    {
      field: 'id', header: 'News', link: {
        label: "Go to News",
        action: ( injector: Injector, id: number ) => {
          runInInjectionContext( injector, () => {
            const router = inject( Router );
            router.navigateByUrl( `/news#${ id }` );
          } );
        }
      }
    }
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