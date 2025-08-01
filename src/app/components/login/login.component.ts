import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();

  email = '';
  password = '';
  error = '';

  constructor(public authService: AuthService) {}

  onLogin(event: Event): void {
    event.preventDefault();
    this.authService
      .signInWithEmail(this.email, this.password)
      .then(() => {
        this.error = '';
        this.close.emit();
      })
      .catch((err: any) => (this.error = err.message));
  }
}
