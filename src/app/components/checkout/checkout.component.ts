import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../service/cart.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent {
  cartTotal = 0;
  isProcessing = false;

  constructor(private http: HttpClient, private cartService: CartService) {
    // Calculate cart total from cart service
    this.cartService.cartItems$.subscribe((items) => {
      this.cartTotal = items.reduce((sum, item) => sum + item.price, 0);
    });
  }

  payWithRazorpay() {
    if (this.cartTotal <= 0) {
      alert('Your cart is empty!');
      return;
    }

    this.isProcessing = true;

    // Call backend to create order
    this.http
      .post<{ id: string }>('http://localhost:5000/create-order', {
        amount: this.cartTotal * 100, // Convert to paise
      })
      .subscribe({
        next: (order) => {
          this.isProcessing = false;
          this.openRazorpay(order.id);
        },
        error: (err) => {
          this.isProcessing = false;
          console.error(err);
          alert('Failed to start payment');
        },
      });
  }

  openRazorpay(orderId: string) {
    const options: any = {
      key: environment.razorpayKeyId, // Replace with your Razorpay Key ID
      amount: this.cartTotal,
      currency: 'INR',
      name: 'Tollylab',
      description: 'Test Transaction',
      order_id: orderId,
      handler: (response: any) => {
        alert('Payment Successful: ' + response.razorpay_payment_id);
        console.log(response);
      },
      prefill: {
        name: 'Rahul Mukherjee',
        email: 'rahul@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#F37254',
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  }
}
