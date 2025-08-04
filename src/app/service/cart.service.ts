import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  imageUrl: string;
  title: string;
  price: number;
  size?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.getValue();
  }

  addToCart(item: CartItem): void {
    const currentItems = this.getCartItems();
    this.cartItemsSubject.next([...currentItems, item]);
  }

  removeFromCart(item: CartItem): void {
    const updatedItems = this.getCartItems().filter((i) => i !== item);
    this.cartItemsSubject.next(updatedItems);
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
  }

  getTotalPrice(): number {
    return this.getCartItems().reduce((acc, item) => acc + item.price, 0);
  }
}
