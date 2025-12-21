import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';

@Component( {
  selector: 'app-root',
  imports: [ RouterOutlet, ToastModule, DynamicDialogModule ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class App {
  protected readonly title = signal( 'angular-publishing' );
}
