import {Component, inject} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {MessagesService} from "../messages/messages.service";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";

@Component({
    selector: 'login',
    imports: [
        RouterLink,
        ReactiveFormsModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private messagesService = inject(MessagesService);

  loginForm = this.fb.nonNullable.group({
    email: [''],
    password: ['']
  });

  onLogin(): void {
    const { email, password } = this.loginForm.getRawValue();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      this.messagesService.showMessage('Please enter both email and password', 'error');
      return;
    }

    this.authService.login({ email: trimmedEmail, password: trimmedPassword }).subscribe({
      next: () => {
        this.messagesService.showMessage('Login successful!', 'success');
      },
      error: (err) => {
        console.error('Login error:', err);
        this.messagesService.showMessage('Login failed. Please check your credentials.', 'error');
      }
    });
  }
}
