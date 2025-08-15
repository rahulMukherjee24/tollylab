import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddToCartButtonComponent } from '../add-to-cart/add-to-cart-button.component';
import { CartItem, CartService } from '../../service/cart.service';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

interface FilmProduct {
  title: string;
  img: string;
  price: number;
  filmType: string;
}

@Component({
  selector: 'app-film-scroll',
  standalone: true,
  imports: [CommonModule, AddToCartButtonComponent],
  templateUrl: './film-scroll.component.html',
  styleUrls: ['./film-scroll.component.scss'],
})
export class FilmScrollComponent implements OnInit, OnDestroy {
  products: FilmProduct[] = [];
  clickedIndex: number | null = null;

  // quantity lookup by title (keeps UI reactive to cart)
  qtyByTitle: Record<string, number> = {};

  private subs: Subscription = new Subscription();

  constructor(
    private firestore: Firestore,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const filmCol = collection(this.firestore, 'filmScroll');

    const filmsSub = collectionData(filmCol, { idField: 'id' })
      .pipe(
        map((docs: any[]) =>
          docs.map((doc) => ({
            title: this.formatTitle(doc.filmType || ''),
            img: doc.url,
            price: doc.price || 0,
            filmType: doc.filmType || '',
          }))
        )
      )
      .subscribe((films) => {
        this.products = films;
      });

    // subscribe to cart changes and maintain qty map
    const cartSub = this.cartService.cartItems$.subscribe((items) => {
      const map: Record<string, number> = {};
      for (const it of items) {
        // if multiple entries of same title exist, sum them (defensive)
        map[it.title] = (map[it.title] ?? 0) + (it.quantity ?? 1);
      }
      this.qtyByTitle = map;
    });

    this.subs.add(filmsSub);
    this.subs.add(cartSub);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
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

  /** Add -> if not present adds with qty=1 (service merges), UI will flip because we subscribe to cart */
  handleAddToCart(film: FilmProduct, index: number, ev?: MouseEvent): void {
    if (ev) ev.stopPropagation();
    const item: CartItem = {
      imageUrl: film.img,
      title: film.title,
      price: film.price,
      quantity: 1,
    };

    this.cartService.addToCart(item);

    // keep the small pulse animation if you like
    this.clickedIndex = index;
    setTimeout(() => {
      this.clickedIndex = null;
    }, 600);
  }

  increaseQty(film: FilmProduct, ev?: MouseEvent): void {
    if (ev) ev.stopPropagation();
    const current = this.qtyByTitle[film.title] ?? 0;
    this.cartService.updateQuantity(film.title, current + 1);
  }

  decreaseQty(film: FilmProduct, ev?: MouseEvent): void {
    if (ev) ev.stopPropagation();
    const current = this.qtyByTitle[film.title] ?? 0;
    const next = current - 1;
    if (next > 0) {
      this.cartService.updateQuantity(film.title, next);
    } else {
      // remove entirely
      this.cartService.removeFromCartByTitle(film.title);
    }
  }

  getQuantityForProduct(film: FilmProduct): number {
    return this.qtyByTitle[film.title] ?? 0;
  }

  goToSelectedProduct(filmType: string): void {
    this.router.navigate(['/selected-product', filmType]);
  }
}
