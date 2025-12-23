import { inject, Pipe, PipeTransform } from '@angular/core';
import { BookMaterial } from '@app/api';
import { MaterialsStore } from '@app/store/materials-store';

@Pipe( {
  name: 'materials',
  standalone: true,
  pure: true
} )
export class MaterialsPipe implements PipeTransform {
  #materialsStore = inject( MaterialsStore );

  transform( bm: BookMaterial[] | undefined | null ): string {
    if ( bm ) {
      return bm.map( ( value ) => this.#materialsStore.materials().find( m => m.id === value?.material_id )?.name ).join( ', ' );
    }
    return '';
  }
}
