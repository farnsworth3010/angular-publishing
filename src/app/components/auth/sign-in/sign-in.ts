import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Util } from '@app/core/utils/util';
import { AuthStore } from '@app/store/auth-store';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component( {
  selector: 'app-sign-in',
  imports: [ PasswordModule, InputTextModule, ButtonModule, ReactiveFormsModule, RouterLink ],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class SignIn implements OnInit {
  #fb = inject( FormBuilder );
  #authStore = inject( AuthStore );

  protected loading = this.#authStore.loading;
  protected error = signal<boolean>( false );

  protected form = this.#fb.group( {
    email: [ '', [ Validators.required, Validators.email ] ],
    password: [ '', [ Validators.required, Validators.minLength( 6 ) ] ],
  } );

  ngOnInit(): void {
  }

  protected onSubmit(): void {
    if ( this.form.valid ) {
      const { email, password } = this.form.value;
      this.#authStore.login( { email: email!, password: password! } );
    }
    else {
      Util.markAllControlsAsDirty( this.form );
    }
  }

  protected loginAsGuest(): void {
    this.#authStore.loginAsGuest();
  }
}
