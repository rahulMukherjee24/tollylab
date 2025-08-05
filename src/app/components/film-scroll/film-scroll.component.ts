import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddToCartButtonComponent } from '../add-to-cart/add-to-cart-button.component';
import { CartItem, CartService } from '../../service/cart.service';

@Component({
  selector: 'app-film-scroll',
  standalone: true,
  imports: [CommonModule, AddToCartButtonComponent],
  templateUrl: './film-scroll.component.html',
  styleUrls: ['./film-scroll.component.scss'],
})
export class FilmScrollComponent {
  constructor(private cartService: CartService) {}
  products = [
    { title: 'Tollygrunge Vol. 1', img: 'assets/cam_roll1.png' },
    { title: 'Midnight Alley', img: 'assets/cam_roll2.png' },
    { title: 'Suburban Screamers', img: 'assets/cam_roll3.png' },
    { title: 'Retro Noir', img: 'assets/cam_roll4.png' },
  ];

  scrollLeft(container: HTMLDivElement) {
    container.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight(container: HTMLDivElement) {
    container.scrollBy({ left: 300, behavior: 'smooth' });
  }

  handleAddToCart(url: any) {
    const item: CartItem = {
      imageUrl: url,
      title: 'Frame Counter Image',
      price: 199, // or use logic if price varies
    };

    this.cartService.addToCart(item);
    console.log('Added to cart:', item);
  }
}
