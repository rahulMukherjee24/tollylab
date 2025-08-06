import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { RouterModule } from '@angular/router';
import { map, Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { AddToCartButtonComponent } from '../components/add-to-cart/add-to-cart-button.component';
import { CartItem, CartService } from '../service/cart.service';
import { FormsModule } from '@angular/forms';

interface FrameDoc {
  url: string;
  filmType?: string;
}

@Component({
  standalone: true,
  selector: 'app-frame-gallery',
  imports: [CommonModule, RouterModule, AddToCartButtonComponent, FormsModule],
  templateUrl: './frame-gallery.component.html',
  styleUrls: ['./frame-gallery.component.scss'],
})
export class FrameGalleryComponent implements OnInit {
  private allFramesSubject = new BehaviorSubject<FrameDoc[]>([]);
  private currentPageSubject = new BehaviorSubject<number>(1);
  private selectedFilmTypeSubject = new BehaviorSubject<string>('all');

  readonly itemsPerPage = 10;
  pagedUrls$!: Observable<string[]>;
  totalPages = 1;
  isLoading = true;
  selectedFilmType = 'all';

  // Filter dropdown options
  filmTypes = ['all', 'bnw', 'color', 'infrared'];

  constructor(private firestore: Firestore, private cartService: CartService) {}

  ngOnInit(): void {
    const frameCollection = collection(this.firestore, 'frameCounter');

    collectionData(frameCollection)
      .pipe(
        map((docs: any[]) =>
          docs.map((doc) => ({
            url: doc.url,
            filmType: doc.filmType || 'unknown',
          }))
        )
      )
      .subscribe((frames) => {
        this.allFramesSubject.next(frames);
        this.updateTotalPages(frames);
      });

    this.pagedUrls$ = combineLatest([
      this.allFramesSubject.asObservable(),
      this.selectedFilmTypeSubject.asObservable(),
      this.currentPageSubject.asObservable(),
    ]).pipe(
      map(([allFrames, selectedType, page]) => {
        let filtered =
          selectedType === 'all'
            ? allFrames
            : allFrames.filter((f) => f.filmType === selectedType);

        this.updateTotalPages(filtered);

        const start = (page - 1) * this.itemsPerPage;
        return filtered
          .slice(start, start + this.itemsPerPage)
          .map((f) => f.url);
      })
    );

    // Show spinner until data is loaded
    this.pagedUrls$.subscribe(() => {
      setTimeout(() => {
        this.isLoading = false;
      }, 300);
    });
  }

  changePage(delta: number): void {
    const newPage = this.currentPageSubject.value + delta;
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.isLoading = true;
      this.currentPageSubject.next(newPage);
    }
  }

  changeFilmType(type: string): void {
    this.selectedFilmTypeSubject.next(type);
    this.currentPageSubject.next(1); // Reset to first page
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
    console.log('Added to cart:', item);
  }

  private updateTotalPages(frames: FrameDoc[]): void {
    this.totalPages = Math.ceil(frames.length / this.itemsPerPage) || 1;
  }
  
}
