import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Material } from '@app/api';
import { AppDialogService } from '@app/core/dialog/dialog.service';
import { MaterialEditDialog } from '@app/shared/dialogs/material/material-edit-dialog';
import { ButtonModule } from 'primeng/button';

@Component( {
  selector: 'pb-materials',
  imports: [ ButtonModule ],
  templateUrl: './materials.html',
  styleUrl: './materials.css',
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class Materials {
  #dialogService = inject( AppDialogService );

  openCreateMaterialDialog() {
    this.#dialogService.open<Material, Material>( MaterialEditDialog, { header: 'Create Material', width: '420px' } as any ).then( () => { /* saved via dialog/store */ } );
  }
}
