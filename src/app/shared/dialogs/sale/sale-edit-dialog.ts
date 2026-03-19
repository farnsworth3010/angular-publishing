import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Sale } from '@app/api/model/sale';
import { SalesStore } from '@app/store/sales-store';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';

@Component( {
  selector: 'pb-sale-edit-dialog',
  templateUrl: './sale-edit-dialog.html',
  standalone: true,
  imports: [ ReactiveFormsModule, ButtonModule, InputTextModule ],
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class SaleEditDialog {
  #fb = inject( FormBuilder );
  #config = inject( DynamicDialogConfig );
  #ref = inject( DynamicDialogRef );
  #salesStore = inject( SalesStore );

  sale?: Sale = this.#config?.data as Sale | undefined;

  form = this.#fb.group( {
    date: [ this.sale?.date ?? null, Validators.required ],
    amount: [ this.sale?.amount ?? 0, Validators.required ],
    price: [ this.sale?.price ?? 0, Validators.required ],
    isExternal: [ this.sale?.isExternal ?? false ],
    bookId: [ this.sale?.bookId ?? null, Validators.required ],
    userId: [ this.sale?.userId ?? null, Validators.required ]
  } );

  cancel() { this.#ref.close(); }

  save() {
    if ( this.form.invalid ) return;
    const payload: any = { ...this.form.value };
    if ( this.sale?.id ) {
      this.#salesStore.updateSale( this.sale.id, payload ).subscribe( ( saved ) => this.#ref.close( { data: saved } ) );
    } else {
      this.#salesStore.createSale( payload ).subscribe( ( saved ) => this.#ref.close( { data: saved } ) );
    }
  }
}
