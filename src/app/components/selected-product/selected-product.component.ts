import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
} from '@angular/fire/firestore';
import { map } from 'rxjs';
import { AddToCartButtonComponent } from '../add-to-cart/add-to-cart-button.component';

interface ProductDetail {
  title: string;
  img: string;
  description: string;
  filmType: string;
  price?: number;
}

@Component({
  selector: 'app-selected-product',
  standalone: true,
  imports: [CommonModule, AddToCartButtonComponent],
  templateUrl: './selected-product.component.html',
  styleUrls: ['./selected-product.component.scss'],
})
export class SelectedProductComponent implements OnInit {
  filmType!: string;
  images: string[] = [];
  isLoading = true;

  productDetail?: ProductDetail;
  moreProducts: ProductDetail[] = [];

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to param changes so navigating to the same component with a new param works
    this.route.paramMap.subscribe((params) => {
      this.filmType = params.get('filmType') || '';
      if (!this.filmType) return;

      this.fetchProductDetail();
      this.fetchMoreProducts();
      this.fetchImages();
    });
  }

  private fetchProductDetail() {
    const filmCol = collection(this.firestore, 'filmScroll');
    const filmQuery = query(filmCol, where('filmType', '==', this.filmType));

    collectionData(filmQuery)
      .pipe(
        map((docs: any[]) =>
          docs.map((doc) => ({
            title: doc.title || this.formatTitle(doc.filmType || ''),
            img: doc.url,
            description: doc.description || 'No description available.',
            filmType: doc.filmType,
            price: doc.price || 0,
          }))
        )
      )
      .subscribe((results) => {
        this.productDetail = results.length ? results[0] : undefined;
      });
  }

  private fetchMoreProducts() {
    const filmCol = collection(this.firestore, 'filmScroll');

    collectionData(filmCol)
      .pipe(
        map((docs: any[]) =>
          docs
            .filter((doc) => doc.filmType !== this.filmType)
            .map((doc) => ({
              title: doc.title || this.formatTitle(doc.filmType || ''),
              img: doc.url,
              description: doc.description || '',
              filmType: doc.filmType,
              price: doc.price || 0,
            }))
        )
      )
      .subscribe((products) => {
        this.moreProducts = products;
      });
  }

  private fetchImages() {
    this.isLoading = true;
    const framesRef = collection(this.firestore, 'frameCounter');
    const framesQuery = query(
      framesRef,
      where('filmType', '==', this.filmType)
    );

    collectionData(framesQuery)
      .pipe(map((docs: any[]) => docs.map((doc) => doc.url)))
      .subscribe((urls) => {
        this.images = urls;
        this.isLoading = false;
      });
  }

  formatTitle(filmType: string): string {
    return filmType
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  }

  goToSelectedProduct(filmType: string) {
    this.router.navigate(['/selected-product', filmType]);
  }
}
