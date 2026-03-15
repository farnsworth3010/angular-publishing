import { inject, Injector, runInInjectionContext } from '@angular/core';
import { BookService } from '@app/api';
import { Author } from '@app/api/model/author';
import { Book } from '@app/api/model/book';
import { Category } from '@app/api/model/category';
import { AppDialogService } from '@app/core/dialog/dialog.service';
import { ArrayItemPipe } from '@app/core/pipes/array-item-pipe';
import { BookDisplayDialog } from '@app/shared/dialogs/book/book-display-dialog';
import { BookEditDialog } from '@app/shared/dialogs/book/book-edit-dialog';
import { ConfirmDialogComponent } from '@app/shared/dialogs/common/confirm-dialog';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { MessageService } from 'primeng/api';
import { pipe, switchMap, tap } from 'rxjs';

interface BooksState {
  books: Book[];
  loading: boolean;
  cols: Array<{
    field: string;
    header: string;
    pipe?: any;
    pipeArgs?: any;
    link?: { label: string; action: ( injector: Injector, id: any ) => void; };
    actions?: Array<{ label: string; handler: ( injector: Injector, row: Book ) => void; }>;
  }>;
}

const initialState: BooksState = {
  books: [],
  loading: false,
  cols: [
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Name' },
    // { field: 'pages', header: 'Pages' },
    { field: 'value', header: 'Value' },
    { field: 'quantity', header: 'Quantity' },
    // { field: 'publishingStart', header: 'Pub. Start', pipe: DatePipe },
    // { field: 'publishingEnd', header: 'Pub. End', pipe: DatePipe },
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
    {
      field: 'actions', header: 'Actions', actions: [ {
        label: 'Edit', handler: ( injector: Injector, row: Book ) => {
          runInInjectionContext( injector, () => {
            const dialog = inject( AppDialogService );
            dialog.open<Book, Book>( BookEditDialog, { data: row, header: 'Edit Book', width: '700px' } as any ).then( () => { /* saved via dialog/store */ } );
          } );
        }
      }, {
        label: 'View', handler: ( injector: Injector, row: Book ) => {
          runInInjectionContext( injector, () => {
            const dialog = inject( AppDialogService );
            dialog.open<Book, void>( BookDisplayDialog, { data: row, header: 'Book Details', width: '640px' } as any ).then( () => { /* closed */ } );
          } );
        }
      }, {
        label: 'Delete', handler: ( injector: Injector, row: Book ) => {
          runInInjectionContext( injector, () => {
            const dialog = inject( AppDialogService );
            const bookStore = inject( BooksStore );
            dialog.open<{ title?: string; message?: string; }, boolean>( ConfirmDialogComponent, { data: { title: 'Delete book', message: `Are you sure you want to delete \"${ row.name }\"?`, acceptLabel: 'Delete', rejectLabel: 'Cancel' }, header: 'Confirm Delete', width: '420px' } as any ).then( ( res ) => {
              if ( res && res.data ) {
                bookStore.deleteBook( row.id ).subscribe();
              }
            } );
          } );
        }
      } ]
    }
  ]
};

export const BooksStore = signalStore(
  { providedIn: 'root' },
  withState<BooksState>( initialState ),
  withMethods( ( store, bookService = inject( BookService ), messageService = inject( MessageService ) ) => ( {
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
    ,
    createBook( createBookDto: any ) {
      const obs = bookService.bookControllerCreate( createBookDto );
      obs.subscribe( ( created ) => {
        const next = [ ...store.books(), created ];
        patchState( store, { books: next } );
      } );
      return obs;
    },
    updateBook( id: number, updateBookDto: any ) {
      const obs = bookService.bookControllerUpdate( id, updateBookDto );
      obs.subscribe( ( updated ) => {
        const next = store.books().map( ( b: Book ) => b.id === updated.id ? updated : b );
        patchState( store, { books: next } );
      } );
      return obs;
    }
    ,
    deleteBook( id: number ) {
      const obs = bookService.bookControllerRemove( id );
      obs.subscribe( {
        next: () => {
          const next = store.books().filter( ( b: Book ) => b.id !== id );
          patchState( store, { books: next } );
        },
        error: ( err ) => {
          const detail = err?.error?.error?.message || 'Failed to delete book';
          messageService.add( { severity: 'error', summary: 'Error', detail, life: 5000 } );
        }
      } );
      return obs;
    }
  } ) )
);