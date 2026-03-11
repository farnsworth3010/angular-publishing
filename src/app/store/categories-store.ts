import { inject } from '@angular/core';
import { CategoryService } from '@app/api/api/category.service';
import { Category } from '@app/api/model/category';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  cols: { field: string, header: string; }[];
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  cols: [
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Name' }
  ]
};

export const CategoriesStore = signalStore(
  { providedIn: 'root' },
  withState<CategoriesState>( initialState ),
  withMethods( ( store, categoryService: CategoryService = inject( CategoryService ) ) => ( {
    setCategories( categories: Category[] ) {
      patchState( store, { categories } );
    },
    setLoading( loading: boolean ) {
      patchState( store, { loading } );
    },
    get: rxMethod(
      pipe(
        tap( () => patchState( store, { loading: true } ) ),
        switchMap( () => categoryService.categoryControllerFindAll() ),
        tap( ( categories: Category[] ) => patchState( store, { loading: false, categories } ) ),
      )
    )
  } ) )
);
