import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthStore } from '@app/store/auth-store';

@Component( {
  selector: 'pb-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class Profile {
  #authStore = inject( AuthStore );

  protected name = this.#authStore.name();
  protected email = this.#authStore.email();
}
