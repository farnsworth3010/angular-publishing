import { DatePipe } from '@angular/common';
import { inject, Injector, runInInjectionContext } from '@angular/core';
import { NewsService } from '@app/api/api/news.service';
import { News } from '@app/api/model/news';
import { AppDialogService } from '@app/core/dialog/dialog.service';
import { ConfirmDialogComponent } from '@app/shared/dialogs/common/confirm-dialog';
import { NewsDisplayDialog } from '@app/shared/dialogs/news/news-display-dialog';
import { NewsEditDialog } from '@app/shared/dialogs/news/news-edit-dialog';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { MessageService } from 'primeng/api';
import { pipe, switchMap, tap } from 'rxjs';

interface NewsState {
  news: News[];
  loading: boolean;
  cols: { field: string, header: string, pipe?: any; pipeArgs?: any; link?: { label: string; action: ( injector: Injector, value: any ) => void; }; isHtml?: boolean; actions?: Array<{ label: string; handler: ( injector: Injector, row: News ) => void; }>; }[];
}

const initialState: NewsState = {
  news: [],
  loading: false,
  cols: [
    { field: 'id', header: 'ID' },
    { field: 'title', header: 'Title' },
    { field: 'publishedAt', header: 'Published', pipe: DatePipe },
    {
      field: 'actions', header: 'Actions', actions: [
        {
          label: 'Edit', handler: ( injector: Injector, row: News ) => {
            runInInjectionContext( injector, () => {
              const dialog = inject( AppDialogService );
              dialog.open<News, News>( NewsEditDialog, { data: row, header: 'Edit News', width: '640px' } as any ).then( () => { /* saved via dialog/store */ } );
            } );
          }
        },
        {
          label: 'View', handler: ( injector: Injector, row: News ) => {
            runInInjectionContext( injector, () => {
              const dialog = inject( AppDialogService );
              dialog.open<News, News>( NewsDisplayDialog, { data: row, header: 'News Details', width: '540px' } as any ).then( () => { /* closed */ } );
            } );
          }
        },
        {
          label: 'Delete', handler: ( injector: Injector, row: News ) => {
            runInInjectionContext( injector, () => {
              const dialog = inject( AppDialogService );
              const newsStore = inject( NewsStore );
              dialog.open<{ title?: string; message?: string; }, boolean>( ConfirmDialogComponent, { data: { title: 'Delete news', message: `Are you sure you want to delete \"${ row.title }\"?`, acceptLabel: 'Delete', rejectLabel: 'Cancel' }, header: 'Confirm Delete', width: '420px' } as any ).then( ( res ) => {
                if ( res && res.data ) {
                  newsStore.deleteNews( row.id ).subscribe();
                }
              } );
            } );
          }
        }
      ]
    }
  ]
};

export const NewsStore = signalStore(
  { providedIn: 'root' },
  withState<NewsState>( initialState ),
  withMethods( ( store, newsService: NewsService = inject( NewsService ), messageService: MessageService = inject( MessageService ) ) => ( {
    setNews( news: News[] ) {
      patchState( store, { news } );
    },
    setLoading( loading: boolean ) {
      patchState( store, { loading } );
    },
    get: rxMethod(
      pipe(
        tap( () => patchState( store, { loading: true } ) ),
        switchMap( () => newsService.newsControllerFindAll() ),
        tap( ( news: News[] ) => patchState( store, { loading: false, news } ) ),
      )
    ),
    createNews( createNewsDto: any ) {
      const obs = newsService.newsControllerCreate( createNewsDto );
      obs.subscribe( ( created ) => {
        const next = [ ...store.news(), created ];
        patchState( store, { news: next } );
      }, ( err ) => {
        const detail = err?.error?.error?.message || 'Failed to create news';
        messageService.add( { severity: 'error', summary: 'Error', detail, life: 5000 } );
      } );
      return obs;
    },
    updateNews( id: number, updateNewsDto: any ) {
      const obs = newsService.newsControllerUpdate( id, updateNewsDto );
      obs.subscribe( ( updated ) => {
        const next = store.news().map( ( n: News ) => n.id === updated.id ? updated : n );
        patchState( store, { news: next } );
      }, ( err ) => {
        const detail = err?.error?.error?.message || 'Failed to update news';
        messageService.add( { severity: 'error', summary: 'Error', detail, life: 5000 } );
      } );
      return obs;
    },
    deleteNews( id: number ) {
      const obs = newsService.newsControllerRemove( id );
      obs.subscribe( {
        next: () => {
          const next = store.news().filter( ( n: News ) => n.id !== id );
          patchState( store, { news: next } );
        },
        error: ( err ) => {
          const detail = err?.error?.error?.message || 'Failed to delete news';
          messageService.add( { severity: 'error', summary: 'Error', detail, life: 5000 } );
        }
      } );
      return obs;
    }
  } ) )
);
