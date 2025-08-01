import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class SignupComponent {
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();

  email = '';
  password = '';
  acceptedTerms = false;

  constructor(private authService: AuthService) {}

  closeModal() {
    this.close.emit();
  }

  async onEmailSignup() {
    if (!this.acceptedTerms) {
      alert('Please accept the terms to continue.');
      return;
    }
    if (!this.email || !this.password) {
      alert('Please provide email and password.');
      return;
    }

    try {
      await this.authService.signUpWithEmail(this.email, this.password);
      this.closeModal();
    } catch (error: any) {
      alert(error.message);
    }
  }

  async onGoogleSignup() {
    try {
      await this.authService.signInWithGoogle();
      this.closeModal();
    } catch (error: any) {
      alert(error.message);
    }
  }
}
