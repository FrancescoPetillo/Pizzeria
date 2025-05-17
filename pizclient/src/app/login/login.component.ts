import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.success = 'Login non ancora disponibile';
    // ignoriamo il risultato a prescindere dalla richiesta
    /*
    this.http.post<any>('http://localhost:3000/auth/login', {
      email: this.email,
      password: this.password
    }, { withCredentials: true })
    .subscribe({
      next: () => {},
      error: () => {}
    });
    */
  }
}
