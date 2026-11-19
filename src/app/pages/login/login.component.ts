import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule],
  template: `
  <main class="login-page">
    <section class="login-card">
      <div class="brand-mark">S</div>
      <h1>Bienvenido a MiniTwitter</h1>
      <p class="subtitle">Inicia sesión para entrar a tu muro.</p>
      <form (ngSubmit)="enter()" #loginForm="ngForm">
        <label class="form-label" for="username">Usuario</label>
        <input id="username" class="form-control mb-3" name="username"
          [(ngModel)]="username" required autocomplete="username"
          placeholder="Escribe tu usuario">
        <label class="form-label" for="password">Contraseña</label>
        <input id="password" class="form-control mb-3" type="password"
          name="password" [(ngModel)]="password" required
          autocomplete="current-password" placeholder="Escribe tu contraseña">
        @if (error) { <div class="alert alert-danger py-2">{{ error }}</div> }
        <button class="btn btn-primary w-100 py-2" [disabled]="loginForm.invalid">
          Iniciar sesión
        </button>
      </form>
      <div class="demo-hint">
        <strong>Credenciales de prueba</strong><br>
        Usuario: admin<br>Contraseña: 12345
      </div>
    </section>
  </main>`
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {
    if (this.auth.isAuthenticated()) this.router.navigate(['/posts']);
  }

  enter(): void {
    this.error = '';
    if (this.auth.login(this.username, this.password)) {
      this.router.navigate(['/posts']);
    } else {
      this.error = 'Usuario o contraseña incorrectos.';
    }
  }
}