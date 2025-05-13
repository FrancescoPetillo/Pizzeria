import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../cart.service';

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
    card: '',
    prodotti: []
  };

  submitted = false;
  success = false;

  constructor(private http: HttpClient, private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.syncCartFromLocalStorage(); // Sincronizza il carrello
    this.formData.prodotti = this.cartService.cart;
  }

  onSubmit() {
  this.submitted = true;
  this.formData.prodotti = this.cartService.cart;

  if (this.formData.name && this.formData.email && this.formData.address && this.formData.card) {
    this.http.post('http://localhost:3000/checkout', this.formData).subscribe({
      next: () => {
        this.success = true;
        this.submitted = false;

        // SVUOTARE IL CARRELLO SOLO DOPO PAGAMENTO RIUSCITO
        this.cartService.clearCart();  // A questo punto, il carrello verrà svuotato
        this.formData = { name: '', email: '', address: '', card: '', prodotti: [] };
      },
      error: () => {
        alert('❌ Errore durante il pagamento. Riprova più tardi.');
      }
    });
  }
}
}
