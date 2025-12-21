import { inject, Injectable, Type } from '@angular/core';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DialogResult } from './dialog-ref';

export interface OpenDialogOptions<T = unknown> extends Partial<DynamicDialogConfig> {
  data?: T;
}

@Injectable( { providedIn: 'root' } )
export class AppDialogService {
  private dynamic = inject( DialogService );

  async open<T = unknown, R = unknown>( component: Type<any>, options?: OpenDialogOptions<T> ): Promise<DialogResult<R> | undefined> {
    return new Promise<DialogResult<R> | undefined>( ( resolve ) => {
      const ref = this.dynamic.open( component, {
        ...options,
        data: options?.data,
        closable: options?.closable ?? true,
        modal: options?.modal ?? true,
        dismissableMask: options?.dismissableMask ?? false,
        baseZIndex: options?.baseZIndex ?? 1000
      } );

      if ( !ref ) {
        resolve( undefined );
        return;
      }

      ref.onClose.subscribe( ( result?: DialogResult<R> ) => {
        resolve( result );
      } );
    } );
  }
}
