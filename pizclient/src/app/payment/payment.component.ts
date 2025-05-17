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
    nome: '',
    email: '',
    indirizzo: '',
    card: '',
    prodotti: [],
    totale: 0,
    metodoPagamento: 'simulato'
  };

  submitted = false;
  success = false;

  constructor(private http: HttpClient, private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.syncCartFromLocalStorage();
    this.formData.prodotti = this.cartService.cart;
    this.formData.totale = this.cartService.cart.reduce((sum, p) => sum + (p.prezzo * p.quantita), 0);
  }

  onSubmit() {
    this.submitted = true;
    this.formData.prodotti = this.cartService.cart;
    this.formData.totale = this.cartService.cart.reduce((sum, p) => sum + (p.prezzo * p.quantita), 0);

    if (this.formData.nome && this.formData.email && this.formData.indirizzo && this.formData.card) {
      this.http.post('http://localhost:3000/api/orders', this.formData).subscribe({
        next: () => {
          this.success = true;
          this.submitted = false;
          this.cartService.clearCart();
          this.formData = { nome: '', email: '', indirizzo: '', card: '', prodotti: [], totale: 0, metodoPagamento: 'simulato' };
        },
        error: () => {
          alert('❌ Errore durante il pagamento. Riprova più tardi.');
        }
      });
    }
  }
}
