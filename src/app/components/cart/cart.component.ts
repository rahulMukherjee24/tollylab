import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface CartItem {
  imageUrl: string;
  title: string;
  price: number;
  size?: string;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  cartItems: CartItem[] = [
    {
      imageUrl: 'https://via.placeholder.com/150',
      title: 'Sample Frame',
      price: 250,
      size: '8x10',
    },
    {
      imageUrl: 'https://via.placeholder.com/150',
      title: 'Another Frame',
      price: 300,
    },
  ];

  removeFromCart(item: CartItem): void {
    this.cartItems = this.cartItems.filter((i) => i !== item);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.price, 0);
  }
}
