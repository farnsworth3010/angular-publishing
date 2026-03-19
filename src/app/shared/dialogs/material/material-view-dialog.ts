import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Material } from '@app/api/model/material';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component( {
  selector: 'pb-material-view-dialog',
  templateUrl: './material-view-dialog.html',
  standalone: true,
  imports: [ CommonModule, ButtonModule ],
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class MaterialViewDialog {
  constructor( public config: DynamicDialogConfig, private ref: DynamicDialogRef ) { }

  get material(): Material | undefined {
    return this.config?.data as Material | undefined;
  }

  close() {
    this.ref.close();
  }
}
