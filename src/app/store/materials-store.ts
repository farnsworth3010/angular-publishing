import { inject, Injector, runInInjectionContext } from '@angular/core';
import { MaterialService } from '@app/api/api/material.service';
import { Material } from '@app/api/model/material';
import { AppDialogService } from '@app/core/dialog/dialog.service';
import { ConfirmDialogComponent } from '@app/shared/dialogs/common/confirm-dialog';
import { MaterialEditDialog } from '@app/shared/dialogs/material/material-edit-dialog';
import { MaterialViewDialog } from '@app/shared/dialogs/material/material-view-dialog';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { MessageService } from 'primeng/api';
import { catchError, pipe, switchMap, tap } from 'rxjs';

interface MaterialsState {
  materials: Material[];
  loading: boolean;
  cols: Array<{
    field: string;
    header: string;
    pipe?: any;
    pipeArgs?: any;
    link?: { label: string; action: ( injector: Injector, number: number ) => void; };
    actions?: Array<{ label: string; handler: ( injector: Injector, row: Material ) => void; }>;
  }>;
}

const initialState: MaterialsState = {
  materials: [],
  loading: false,
  cols: [
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Name' },
    { field: 'amount', header: 'Amount' },
    {
      field: 'actions', header: 'Actions', actions: [ {
        label: 'Edit', handler: ( injector: Injector, row: Material ) => {
          runInInjectionContext( injector, () => {
            const dialog = inject( AppDialogService );
            dialog.open<Material, Material>( MaterialEditDialog, { data: row, header: 'Edit Material', width: '480px' } as any ).then( () => { /* saved via dialog/store */ } );
          } );
        }
      }, {
        label: 'View', handler: ( injector: Injector, row: Material ) => {
          runInInjectionContext( injector, () => {
            const dialog = inject( AppDialogService );
            dialog.open<Material, Material>( MaterialViewDialog, { data: row, header: 'Material Details', width: '420px' } as any ).then( () => { /* closed */ } );
          } );
        }
      }, {
        label: 'Delete', handler: ( injector: Injector, row: Material ) => {
          runInInjectionContext( injector, () => {
            const dialog = inject( AppDialogService );
            const materialsStore = inject( MaterialsStore );
            dialog.open<{ title?: string; message?: string; }, boolean>( ConfirmDialogComponent, { data: { title: 'Delete material', message: `Are you sure you want to delete "${ row.name }"?`, acceptLabel: 'Delete', rejectLabel: 'Cancel' }, header: 'Confirm Delete', width: '420px' } as any ).then( ( res ) => {
              if ( res && res.data ) {
                materialsStore.deleteMaterial( row.id ).subscribe();
              }
            } );
          } );
        }
      } ]
    }
  ]
};

export const MaterialsStore = signalStore(
  { providedIn: 'root' },
  withState<MaterialsState>( initialState ),
  withMethods( ( store, materialService: MaterialService = inject( MaterialService ), messageService: MessageService = inject( MessageService ) ) => ( {
    setMaterials( materials: Material[] ) {
      patchState( store, { materials } );
    },
    setLoading( loading: boolean ) {
      patchState( store, { loading } );
    },
    get: rxMethod(
      pipe(
        tap( () => patchState( store, { loading: true } ) ),
        switchMap( () => materialService.materialControllerFindAll() ),
        catchError( ( err ) => {
          patchState( store, { loading: false } );
          return [];
        } ),
        tap( ( materials: Material[] ) => patchState( store, { loading: false, materials } ) ),
      )
    ),
    createMaterial( payload: any ) {
      const obs = materialService.materialControllerCreate( payload );
      obs.subscribe( ( created: Material ) => {
        const next = [ ...store.materials(), created ];
        patchState( store, { materials: next } );
      }, ( err ) => {
        const detail = err?.error?.error?.message || 'Failed to create material';
        messageService.add( { severity: 'error', summary: 'Error', detail, life: 5000 } );
      } );
      return obs;
    },
    updateMaterial( id: number, payload: any ) {
      const obs = materialService.materialControllerUpdate( id, payload );
      obs.subscribe( ( updated: Material ) => {
        const next = store.materials().map( ( m ) => m.id === updated.id ? updated : m );
        patchState( store, { materials: next } );
      }, ( err ) => {
        const detail = err?.error?.error?.message || 'Failed to update material';
        messageService.add( { severity: 'error', summary: 'Error', detail, life: 5000 } );
      } );
      return obs;
    },
    deleteMaterial( id: number ) {
      const obs = materialService.materialControllerRemove( id );
      obs.subscribe( {
        next: () => {
          const next = store.materials().filter( ( m ) => m.id !== id );
          patchState( store, { materials: next } );
        },
        error: ( err ) => {
          const detail = err?.error?.error?.message || 'Failed to delete material';
          messageService.add( { severity: 'error', summary: 'Error', detail, life: 5000 } );
        }
      } );
      return obs;
    }
  } ) )
);
