import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Header } from "@app/shared/header/header";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component( {
  selector: 'pb-home',
  imports: [ Header, ProgressBarModule, SelectButtonModule, FontAwesomeModule, ReactiveFormsModule, RouterOutlet ],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class Home {
}
