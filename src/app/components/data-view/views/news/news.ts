import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'pb-news',
  imports: [],
  templateUrl: './news.html',
  styleUrl: './news.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class News {

}
