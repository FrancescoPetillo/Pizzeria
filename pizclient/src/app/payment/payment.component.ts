import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  formData = {
    name: '',
    email: '',
    address: '',
    card: ''
  };

  success = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.http.post('http://localhost:3000/checkout', this.formData).subscribe({
      next: () => {
        this.success = true;
        this.formData = { name: '', email: '', address: '', card: '' };
      },
      error: () => {
        alert('Errore durante il pagamento. Riprova più tardi.');
      }
    });
  }
}