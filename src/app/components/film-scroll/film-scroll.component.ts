import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddToCartButtonComponent } from '../add-to-cart/add-to-cart-button.component';
import { CartItem, CartService } from '../../service/cart.service';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { map } from 'rxjs';

interface FilmProduct {
  title: string;
  img: string;
  price: number;
}

@Component({
  selector: 'app-film-scroll',
  standalone: true,
  imports: [CommonModule, AddToCartButtonComponent],
  templateUrl: './film-scroll.component.html',
  styleUrls: ['./film-scroll.component.scss'],
})
export class FilmScrollComponent implements OnInit {
  products: FilmProduct[] = [];
  clickedIndex: number | null = null;

  constructor(private firestore: Firestore, private cartService: CartService) {}

  ngOnInit(): void {
    const filmCol = collection(this.firestore, 'filmScroll');
    collectionData(filmCol, { idField: 'id' })
      .pipe(
        map((docs: any[]) =>
          docs.map((doc) => ({
            title: this.formatTitle(doc.filmType),
            img: `assets/${doc.filmType.toLowerCase()}.png`,
            price: doc.price || 0,
          }))
        )
      )
      .subscribe((films) => {
        this.products = films;
      });
  }

  formatTitle(filmType: string): string {
    return filmType
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  }

  scrollLeft(container: HTMLDivElement) {
    container.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight(container: HTMLDivElement) {
    container.scrollBy({ left: 300, behavior: 'smooth' });
  }

  handleAddToCart(film: FilmProduct, index: number): void {
    const item: CartItem = {
      imageUrl: film.img,
      title: film.title,
      price: film.price,
    };

    this.cartService.addToCart(item);
    this.clickedIndex = index;

    setTimeout(() => {
      this.clickedIndex = null;
    }, 600);
  }
}
