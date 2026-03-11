import { DatePipe } from '@angular/common';
import { inject } from '@angular/core';
import { NewsService } from '@app/api/api/news.service';
import { News } from '@app/api/model/news';
import { LinkPipe } from '@app/core/pipes/link-pipe';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

interface NewsState {
  news: News[];
  loading: boolean;
  cols: { field: string, header: string, pipe?: any; pipeArgs?: any; link?: string; isHtml?: boolean; }[];
}

const initialState: NewsState = {
  news: [],
  loading: false,
  cols: [
    { field: 'id', header: 'ID' },
    { field: 'title', header: 'Title' },
    { field: 'publishedAt', header: 'Published', pipe: DatePipe },
    { field: 'writer', header: 'Writer', pipe: LinkPipe, link: '/authors' }
  ]
};

export const NewsStore = signalStore(
  { providedIn: 'root' },
  withState<NewsState>( initialState ),
  withMethods( ( store, newsService: NewsService = inject( NewsService ) ) => ( {
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
    )
  } ) )
);
