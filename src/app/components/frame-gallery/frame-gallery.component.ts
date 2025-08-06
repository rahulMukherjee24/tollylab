import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { RouterModule } from '@angular/router';
import { map, Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AddToCartButtonComponent } from '../add-to-cart/add-to-cart-button.component';
import { CartItem, CartService } from '../../service/cart.service';

@Component({
  standalone: true,
  selector: 'app-frame-gallery',
  imports: [CommonModule, RouterModule, AddToCartButtonComponent, FormsModule],
  templateUrl: './frame-gallery.component.html',
  styleUrls: ['./frame-gallery.component.scss'],
})
export class FrameGalleryComponent implements OnInit {
  filmTypes: string[] = ['all'];
  selectedFilmType = 'all';

  private allItemsSubject = new BehaviorSubject<
    { url: string; filmType: string }[]
  >([]);
  private currentPageSubject = new BehaviorSubject<number>(1);
  private selectedFilmTypeSubject = new BehaviorSubject<string>('all');

  readonly itemsPerPage = 10;

  pagedUrls$!: Observable<string[]>;
  totalPages = 1;
  isLoading = true;

  constructor(private firestore: Firestore, private cartService: CartService) {}

  ngOnInit(): void {
    const frameCollection = collection(this.firestore, 'frameCounter');

    collectionData(frameCollection)
      .pipe(
        map((docs: any[]) => {
          // Extract film types dynamically
          const types = Array.from(
            new Set(docs.map((doc) => doc.filmType).filter(Boolean))
          );
          this.filmTypes = ['all', ...types];

          // Store the whole doc array for filtering later
          return docs.map((doc) => ({
            url: doc.url,
            filmType: doc.filmType || 'unknown',
          }));
        })
      )
      .subscribe((items) => {
        this.totalPages = Math.ceil(items.length / this.itemsPerPage);
        this.allItemsSubject.next(items);
      });

    // Combine page changes + filter changes
    this.pagedUrls$ = combineLatest([
      this.allItemsSubject.asObservable(),
      this.currentPageSubject.asObservable(),
      this.selectedFilmTypeSubject.asObservable(),
    ]).pipe(
      map(([allItems, page, filter]) => {
        const filtered =
          filter === 'all'
            ? allItems
            : allItems.filter((item) => item.filmType === filter);
        this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
        const start = (page - 1) * this.itemsPerPage;
        return filtered
          .slice(start, start + this.itemsPerPage)
          .map((item) => item.url);
      })
    );

    this.pagedUrls$.subscribe(() => {
      setTimeout(() => {
        this.isLoading = false;
      }, 300);
    });
  }

  changeFilmType(type: string): void {
    this.selectedFilmTypeSubject.next(type);
    this.currentPageSubject.next(1); // Reset to first page on filter change
  }

  changePage(delta: number): void {
    const newPage = this.currentPageSubject.value + delta;
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.isLoading = true;
      this.currentPageSubject.next(newPage);
    }
  }

  get currentPage(): number {
    return this.currentPageSubject.value;
  }

  addToCart(url: string) {
    const item: CartItem = {
      imageUrl: url,
      title: 'Frame Counter Image',
      price: 199,
    };
    this.cartService.addToCart(item);
  }
}
