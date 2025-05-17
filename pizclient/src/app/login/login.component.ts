import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  success = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.error = '';
    this.success = '';
    this.http.post<any>('http://localhost:3000/auth/login', {
      email: this.email,
      password: this.password
    }, { withCredentials: true })
    .subscribe({
      next: (res) => {
        this.success = res && res.message ? res.message : 'Login effettuato!';
        this.error = '';
        // Simula token per demo: in produzione ricevi un vero token dal backend
        localStorage.setItem('token', 'dummy-token');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.error = (err && err.error && err.error.message) ? err.error.message : 'Errore durante il login.';
        this.success = '';
      }
    });
  }
}
