import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { News } from '@app/api/model/news';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component( {
  selector: 'pb-news-by-author-dialog',
  templateUrl: './news-by-author-dialog.html',
  standalone: true,
  imports: [ CommonModule, ButtonModule ],
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class NewsByAuthorDialog {
  constructor( public config: DynamicDialogConfig, private ref: DynamicDialogRef ) { }

  get author() {
    return this.config?.data?.author;
  }

  get news(): News[] {
    return ( this.config?.data?.news || [] ) as News[];
  }

  close() {
    this.ref.close();
  }
}
