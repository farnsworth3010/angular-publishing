import { inject, Injector, runInInjectionContext } from '@angular/core';
import { CategoryService } from '@app/api/api/category.service';
import { Category } from '@app/api/model/category';
import { AppDialogService } from '@app/core/dialog/dialog.service';
import { CategoryEditDialog } from '@app/shared/dialogs/category/category-edit-dialog';
import { CategoryViewDialog } from '@app/shared/dialogs/category/category-view-dialog';
import { ConfirmDialogComponent } from '@app/shared/dialogs/common/confirm-dialog';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { MessageService } from 'primeng/api';
import { pipe, switchMap, tap } from 'rxjs';

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  cols: Array<{
    field: string;
    header: string;
    pipe?: any;
    link?: { label: string; action: ( injector: Injector, number: number ) => void; };
    actions?: Array<{ label: string; handler: ( injector: Injector, row: Category ) => void; }>;
  }>;
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  cols: [
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Name' },
    {
      field: 'actions', header: 'Actions', actions: [ {
        label: 'Edit', handler: ( injector: Injector, row: Category ) => {
          runInInjectionContext( injector, () => {
            const dialog = inject( AppDialogService );
            dialog.open<Category, Category>( CategoryEditDialog, { data: row, header: 'Edit Category', width: '480px' } as any ).then( () => { /* saved via dialog/store */ } );
          } );
        }
      }, {
        label: 'View', handler: ( injector: Injector, row: Category ) => {
          runInInjectionContext( injector, () => {
            const dialog = inject( AppDialogService );
            dialog.open<Category, Category>( CategoryViewDialog, { data: row, header: 'Category Details', width: '420px' } as any ).then( () => { /* closed */ } );
          } );
        }
      }, {
        label: 'Delete', handler: ( injector: Injector, row: Category ) => {
          runInInjectionContext( injector, () => {
            const dialog = inject( AppDialogService );
            const categoriesStore = inject( CategoriesStore );
            dialog.open<{ title?: string; message?: string; }, boolean>( ConfirmDialogComponent, { data: { title: 'Delete category', message: `Are you sure you want to delete "${ row.name }"?`, acceptLabel: 'Delete', rejectLabel: 'Cancel' }, header: 'Confirm Delete', width: '420px' } as any ).then( ( res ) => {
              if ( res && res.data ) {
                categoriesStore.deleteCategory( row.id ).subscribe();
              }
            } );
          } );
        }
      } ]
    }

  ]
};

export const CategoriesStore = signalStore(
  { providedIn: 'root' },
  withState<CategoriesState>( initialState ),
  withMethods( ( store, categoryService: CategoryService = inject( CategoryService ), messageService: MessageService = inject( MessageService ) ) => ( {
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
    ),
    createCategory( payload: { name: string; } ) {
      const obs = categoryService.categoryControllerCreate( payload );
      obs.subscribe( ( created: Category ) => {
        const next = [ ...store.categories(), created ];
        patchState( store, { categories: next } );
      }, ( err ) => {
        const detail = err?.error?.error?.message || 'Failed to create category';
        messageService.add( { severity: 'error', summary: 'Error', detail, life: 5000 } );
      } );
      return obs;
    },
    updateCategory( id: number, payload: { name: string; } ) {
      const obs = categoryService.categoryControllerUpdate( id, payload );
      obs.subscribe( () => {
        const next = store.categories().map( ( c ) => c.id === id ? { ...c, ...payload } : c );
        patchState( store, { categories: next } );
      }, ( err ) => {
        const detail = err?.error?.error?.message || 'Failed to update category';
        messageService.add( { severity: 'error', summary: 'Error', detail, life: 5000 } );
      } );
      return obs;
    },
    deleteCategory( id: number ) {
      const obs = categoryService.categoryControllerRemove( id );
      obs.subscribe( {
        next: () => {
          const next = store.categories().filter( ( c ) => c.id !== id );
          patchState( store, { categories: next } );
        },
        error: ( err ) => {
          const detail = err?.error?.error?.message || 'Failed to delete category';
          messageService.add( { severity: 'error', summary: 'Error', detail, life: 5000 } );
        }
      } );
      return obs;
    }
  } ) )
);
