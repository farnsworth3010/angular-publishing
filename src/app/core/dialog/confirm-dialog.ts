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
  selector: 'app-confirm-dialog',
  template: `
      <p class="mt-2">{{ data?.message || 'Are you sure?' }}</p>
      <div class="flex justify-end gap-2 mt-4">
        <button pButton type="button" class="p-button-text" (click)="reject()">{{ data?.rejectLabel || 'Cancel' }}</button>
        <button pButton type="button" class="p-button-primary" (click)="accept()">{{ data?.acceptLabel || 'OK' }}</button>
      </div>
  `,
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
