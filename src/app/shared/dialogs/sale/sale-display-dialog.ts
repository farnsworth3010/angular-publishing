import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Sale } from '@app/api/model/sale';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component( {
  selector: 'pb-sale-display-dialog',
  templateUrl: './sale-display-dialog.html',
  standalone: true,
  imports: [ CommonModule, ButtonModule ],
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class SaleDisplayDialog {
  constructor( public config: DynamicDialogConfig, private ref: DynamicDialogRef ) { }

  get sale(): Sale | undefined {
    return this.config?.data as Sale | undefined;
  }

  close() { this.ref.close(); }
}
