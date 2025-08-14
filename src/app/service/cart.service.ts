import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  imageUrl: string;
  title: string;
  price: number;
  size?: string;
  quantity?: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.getValue();
  }

  addToCart(item: CartItem): void {
    const current = this.getCartItems();
    this.cartItemsSubject.next([...current, item]);
  }

  // NEW: remove by index (removes a single occurrence)
  removeAt(index: number): void {
    const items = [...this.getCartItems()];
    if (index >= 0 && index < items.length) {
      items.splice(index, 1);
      this.cartItemsSubject.next(items);
    }
  }

  // (optional) keep old API but make it value-based if you still call it elsewhere
  removeFromCart(item: CartItem): void {
    const items = [...this.getCartItems()];
    const idx = items.findIndex(
      (i) =>
        i.title === item.title &&
        i.price === item.price &&
        i.imageUrl === item.imageUrl &&
        (i.size ?? '') === (item.size ?? '')
    );
    if (idx !== -1) this.removeAt(idx);
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
  }

  getTotalPrice(): number {
    return this.getCartItems().reduce((acc, item) => acc + item.price, 0);
  }
}
