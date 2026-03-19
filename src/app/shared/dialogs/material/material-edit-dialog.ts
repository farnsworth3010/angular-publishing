import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Material } from '@app/api/model/material';
import { MaterialsStore } from '@app/store/materials-store';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';

@Component( {
  selector: 'pb-material-edit-dialog',
  templateUrl: './material-edit-dialog.html',
  standalone: true,
  imports: [ ReactiveFormsModule, ButtonModule, InputTextModule ],
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class MaterialEditDialog {
  #fb = inject( FormBuilder );
  #config = inject( DynamicDialogConfig );
  #ref = inject( DynamicDialogRef );
  #materialsStore = inject( MaterialsStore );

  material?: Material = this.#config?.data as Material | undefined;

  form = this.#fb.group( {
    name: [ this.material?.name ?? '', Validators.required ],
    amount: [ this.material?.amount ?? 0, Validators.required ]
  } );

  cancel() {
    this.#ref.close();
  }

  save() {
    if ( this.form.invalid ) return;

    const payload: any = {
      name: this.form.value.name,
      amount: this.form.value.amount
    };

    if ( this.material?.id ) {
      this.#materialsStore.updateMaterial( this.material.id, payload ).subscribe( ( saved ) => {
        this.#ref.close( { data: saved } );
      } );
    } else {
      this.#materialsStore.createMaterial( payload ).subscribe( ( saved ) => {
        this.#ref.close( { data: saved } );
      } );
    }
  }
}
