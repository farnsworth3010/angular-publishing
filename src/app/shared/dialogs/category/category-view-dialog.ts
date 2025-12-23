import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Category } from '@app/api/model/category';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component( {
  selector: 'pb-category-view-dialog',
  templateUrl: './category-view-dialog.html',
  standalone: true,
  imports: [ CommonModule, ButtonModule ],
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class CategoryViewDialog {
  constructor( public config: DynamicDialogConfig, private ref: DynamicDialogRef ) { }

  get category(): Category | undefined {
    return this.config?.data as Category | undefined;
  }

  close() {
    this.ref.close();
  }
}
