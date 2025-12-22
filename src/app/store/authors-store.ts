import { inject, Injector, runInInjectionContext } from '@angular/core';
import { AuthorService } from '@app/api';
import { Author } from '@app/api/model/author';
import { AppDialogService } from '@app/core/dialog/dialog.service';
import { AuthorDisplayDialog } from '@app/shared/dialogs/author/author-display-dialog';
import { AuthorEditDialog } from '@app/shared/dialogs/author/author-edit-dialog';
import { ConfirmDialogComponent } from '@app/shared/dialogs/common/confirm-dialog';
import { NewsByAuthorDialog } from '@app/shared/dialogs/news/news-by-author-dialog';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { MessageService } from 'primeng/api';
import { pipe, switchMap, tap } from 'rxjs';

interface AuthorsState {
  authors: Author[];
  loading: boolean;
  cols: Array<{
    field: string;
    header: string;
    pipe?: any;
    link?: { label: string; action: ( injector: Injector, number: number ) => void; };
    actions?: Array<{ label: string; handler: ( injector: Injector, row: Author ) => void; }>;
  }>;
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
            const authorService = inject( AuthorService );
            const dialog = inject( AppDialogService );
            // call server with writerId query param (if backend supports it)
            authorService.authorControllerFindNews( id ).subscribe( ( list ) => {
              dialog.open<{ author: any; news: any[]; }, void>( NewsByAuthorDialog as any, { data: { author: { id }, news: list || [] }, header: 'News by author', width: '640px' } as any ).then( () => { } );
            }, () => {
              dialog.open<{ author: any; news: any[]; }, void>( NewsByAuthorDialog as any, { data: { author: { id }, news: [] }, header: 'News by author', width: '640px' } as any ).then( () => { } );
            } );
          } );
        }
      }
    }
    ,
    {
      field: 'actions', header: 'Actions', actions: [ {
        label: 'Edit', handler: ( injector: Injector, row: Author ) => {
          runInInjectionContext( injector, () => {
            const dialog = inject( AppDialogService );
            dialog.open<Author, Author>( AuthorEditDialog, { data: row, header: 'Edit Author', width: '480px' } as any ).then( () => { /* saved via dialog/store */ } );
          } );
        }
      }, {
        label: 'View', handler: ( injector: Injector, row: Author ) => {
          runInInjectionContext( injector, () => {
            const dialog = inject( AppDialogService );
            dialog.open<Author, void>( AuthorDisplayDialog, { data: row, header: 'Author Details', width: '420px' } as any ).then( () => { /* closed */ } );
          } );
        }
      }, {
        label: 'Delete', handler: ( injector: Injector, row: Author ) => {
          runInInjectionContext( injector, () => {
            const dialog = inject( AppDialogService );
            const authorStore = inject( AuthorsStore );
            dialog.open<{ title?: string; message?: string; }, boolean>( ConfirmDialogComponent, { data: { title: 'Delete author', message: `Are you sure you want to delete "${ row.firstName } ${ row.lastName }"?`, acceptLabel: 'Delete', rejectLabel: 'Cancel' }, header: 'Confirm Delete', width: '420px' } as any ).then( ( res ) => {
              if ( res && res.data ) {
                authorStore.deleteAuthor( row.id ).subscribe();
              }
            } );
          } );
        }
      } ]
    }
  ]
};

export const AuthorsStore = signalStore(
  { providedIn: 'root' },
  withState<AuthorsState>( initialState ),
  withMethods( ( store, authorService = inject( AuthorService ), messageService = inject( MessageService ) ) => ( {
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
    ),
    createAuthor( payload: any ) {
      const obs = authorService.authorControllerCreate( payload );
      obs.subscribe( () => {
        const next = [ ...store.authors(), payload ];
        patchState( store, { authors: next } );
      } );
      return obs;
    },
    updateAuthor( id: number, payload: any ) {
      const obs = authorService.authorControllerUpdate( id, payload );
      obs.subscribe( () => {
        const next = store.authors().map( ( a: Author ) => a.id === id ? { ...a, ...payload } : a );
        patchState( store, { authors: next } );
      } );
      return obs;
    },
    deleteAuthor( id: number ) {
      const obs = authorService.authorControllerRemove( id );
      obs.subscribe( {
        next: () => {
          const next = store.authors().filter( ( a: Author ) => a.id !== id );
          patchState( store, { authors: next } );
        },
        error: ( err ) => {
          const detail = err?.error?.error?.message || 'Failed to delete author';
          messageService.add( { severity: 'error', summary: 'Error', detail, life: 5000 } );
        }
      } );
      return obs;
    }
  } ) )
);