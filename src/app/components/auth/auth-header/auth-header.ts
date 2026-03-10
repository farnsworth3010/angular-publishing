import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';

@Component( {
  selector: 'app-auth-header',
  imports: [ FontAwesomeModule, RouterLink ],
  templateUrl: './auth-header.html',
  styleUrl: './auth-header.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class AuthHeader {
  protected readonly faBook = faBook;
}
