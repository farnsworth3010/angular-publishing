import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Author } from '@app/api/model/author';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component( {
  selector: 'pb-author-display-dialog',
  templateUrl: './author-display-dialog.html',
  standalone: true,
  imports: [ CommonModule, ButtonModule ],
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class AuthorDisplayDialog {
  constructor( public config: DynamicDialogConfig, private ref: DynamicDialogRef ) { }

  get author(): Author | undefined {
    return this.config?.data as Author | undefined;
  }

  close() {
    this.ref.close();
  }
}
