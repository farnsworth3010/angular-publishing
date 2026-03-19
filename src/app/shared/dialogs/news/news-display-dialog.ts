import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { News } from '@app/api/model/news';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component( {
  selector: 'pb-news-display-dialog',
  templateUrl: './news-display-dialog.html',
  standalone: true,
  imports: [ CommonModule, ButtonModule ],
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class NewsDisplayDialog {
  constructor( public config: DynamicDialogConfig, private ref: DynamicDialogRef ) { }

  get news(): News | undefined {
    return this.config?.data as News | undefined;
  }

  close() {
    this.ref.close();
  }
}
