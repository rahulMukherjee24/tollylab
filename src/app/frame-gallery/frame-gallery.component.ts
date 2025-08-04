import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { RouterModule } from '@angular/router';
import { map, Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { AddToCartButtonComponent } from '../components/add-to-cart/add-to-cart-button.component';

@Component({
  standalone: true,
  selector: 'app-frame-gallery',
  imports: [CommonModule, RouterModule, AddToCartButtonComponent],
  templateUrl: './frame-gallery.component.html',
  styleUrls: ['./frame-gallery.component.scss'],
})
export class FrameGalleryComponent implements OnInit {
  private allUrlsSubject = new BehaviorSubject<string[]>([]);
  private currentPageSubject = new BehaviorSubject<number>(1);
  readonly itemsPerPage = 10;

  pagedUrls$!: Observable<string[]>;
  totalPages = 1;
  isLoading = true;

  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    const frameCollection = collection(this.firestore, 'frameCounter');

    collectionData(frameCollection)
      .pipe(map((docs: any[]) => docs.map((doc) => doc.url)))
      .subscribe((urls) => {
        this.totalPages = Math.ceil(urls.length / this.itemsPerPage);
        this.allUrlsSubject.next(urls);
      });

    this.pagedUrls$ = combineLatest([
      this.allUrlsSubject.asObservable(),
      this.currentPageSubject.asObservable(),
    ]).pipe(
      map(([allUrls, page]) => {
        const start = (page - 1) * this.itemsPerPage;
        return allUrls.slice(start, start + this.itemsPerPage);
      })
    );

    // Show spinner until data is loaded
    this.pagedUrls$.subscribe(() => {
      setTimeout(() => {
        this.isLoading = false;
      }, 300); // just enough to show spinner
    });
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
    console.log('Add to Cart clicked for:', url);
    // Future: You can pass productId, title, price here when available
  }
}
