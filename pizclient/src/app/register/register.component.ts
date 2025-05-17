import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  error = '';
  success = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    // RegEx semplice per validare la mail (puoi usare anche una più avanzata)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.error = 'Inserisci un indirizzo email valido.';
      this.success = '';
      return;
    }

    this.http.post<any>('http://localhost:3000/auth/register', {
      name: this.name,
      email: this.email,
      password: this.password
    }, { withCredentials: true })
    .subscribe({
      next: (res) => {
        this.error = '';
        this.success = (res && res.message) ? res.message : 'Registrazione avvenuta! Ora puoi fare il login.';
        // Se vuoi, puoi anche reindirizzare al login dopo qualche secondo:
        // setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.success = 'Registrazione avvenuta! Ora puoi fare il login.';
        this.error = '';
        // Se vuoi reindirizzare comunque al login dopo qualche secondo:
        // setTimeout(() => this.router.navigate(['/login']), 2000);
      }
    });
  }
}
