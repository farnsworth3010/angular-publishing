import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { logoGradientGif } from '@app/core/constants/assets';
import { AuthStore } from '@app/store/auth-store';
import { ProgressBarModule } from 'primeng/progressbar';
import { environment } from 'src/environments/environment.development';

@Component( {
  selector: 'app-auth',
  imports: [ RouterOutlet, ProgressBarModule ],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class Auth {
  protected readonly logoUrl: string = logoGradientGif;
  protected readonly version = environment.version;

  #authStore = inject( AuthStore );

  protected loading = this.#authStore.loading;
}
