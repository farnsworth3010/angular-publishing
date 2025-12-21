import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

export interface ConfirmDialogData {
  title?: string;
  message?: string;
  acceptLabel?: string;
  rejectLabel?: string;
}

@Component( {
  selector: 'pb-confirm-dialog',
  templateUrl: './confirm-dialog.html',
  standalone: true,
  imports: [ ButtonModule ],
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class ConfirmDialogComponent {
  constructor( public config: DynamicDialogConfig, private ref: DynamicDialogRef ) { }

  get data() {
    return this.config?.data as ConfirmDialogData | undefined;
  }

  accept() {
    this.ref.close( { data: true } );
  }

  reject() {
    this.ref.close( { data: false } );
  }
}
