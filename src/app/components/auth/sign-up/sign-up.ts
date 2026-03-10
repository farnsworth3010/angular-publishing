import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component( {
  selector: 'app-sign-up',
  imports: [ ReactiveFormsModule, RouterLink, ButtonModule, InputTextModule, PasswordModule ],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class SignUp {
  #fb = inject( FormBuilder );

  protected form = this.#fb.group(
    {
      email: [ '', [ Validators.required, Validators.email ] ],
      password: [ '', [ Validators.required, Validators.minLength( 8 ) ] ],
      confirmPassword: [ '', [ Validators.required, Validators.minLength( 8 ) ] ],
    },
    {
      validators: ( group ) => {
        const password = group.get( 'password' )?.value;
        const confirmPassword = group.get( 'confirmPassword' )?.value;

        return password === confirmPassword ? null : { passwordMismatch: true };
      }
    }
  );

  protected onSubmit(): void {

    // Util.markAllControlsAsDirty( this.form );
  }
}
