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
    // Rimappa i prodotti per lo schema richiesto dal backend
    const mappedProducts = this.cartService.cart.map((p: any) => ({
      productId: p._id, // usa _id, non id
      quantity: p.qty !== undefined ? p.qty : p.quantita
    }));
    const payload = {
      name: this.formData.nome,
      email: this.formData.email,
      address: this.formData.indirizzo,
      products: mappedProducts,
      totalAmount: this.cartService.cart.reduce((sum, p) => sum + (p.prezzo * (p.qty !== undefined ? p.qty : p.quantita)), 0),
      paymentMethod: this.formData.metodoPagamento,
      cardLast4: this.formData.card.slice(-4)
    };
    if (payload.name && payload.email && payload.address && payload.products.length > 0 && payload.cardLast4) {
      this.http.post('http://localhost:3000/api/orders', payload).subscribe({
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
