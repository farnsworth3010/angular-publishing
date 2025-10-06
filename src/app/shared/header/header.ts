import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '@app/store/auth-store';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import {
  faBook,
  faHome,
  faSignOutAlt,
  faUser, IconDefinition
} from '@fortawesome/free-solid-svg-icons';

@Component( {
  selector: 'pb-header',
  imports: [ FaIconComponent, RouterLink ],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class Header {
  protected readonly faBook: IconDefinition = faBook;

  #authStore = inject( AuthStore );

  protected readonly items = [
    { label: 'Home', link: '/', icon: faHome },
    { label: 'Profile', link: '/profile', icon: faUser },
    { label: 'Logout', action: this.logout.bind( this ), icon: faSignOutAlt }
  ];

  protected logout(): void {
    this.#authStore.logout();
  }
}
