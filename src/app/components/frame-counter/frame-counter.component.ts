import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { Router, RouterModule } from '@angular/router';
import { AddToCartButtonComponent } from '../add-to-cart/add-to-cart-button.component';
import { CartItem, CartService } from '../../service/cart.service';

@Component({
  selector: 'app-frame-counter',
  standalone: true,
  imports: [CommonModule, RouterModule, AddToCartButtonComponent],
  templateUrl: './frame-counter.component.html',
  styleUrls: ['./frame-counter.component.scss'],
})
export class FrameCounterComponent implements OnInit {
  private firestore = inject(Firestore);

  frames: string[] = [];
  loading = true;
  error: string | null = null;

  @ViewChild('scrollContainer', { static: true })
  scrollContainerRef!: ElementRef;

  constructor(private router: Router, private cartService: CartService) {}

  ngOnInit(): void {
    this.loadFrames();
  }

  private loadFrames(): void {
    const colRef = collection(this.firestore, 'frameCounter');
    getDocs(colRef)
      .then((snapshot) => {
        this.frames = snapshot.docs
          .map((doc) => doc.data()['url'])
          .filter(Boolean);
      })
      .catch((err) => {
        console.error('Error fetching frameCounter data:', err);
        this.error = 'Failed to load frames';
      })
      .finally(() => {
        this.loading = false;
      });
  }

  scrollFrames(direction: 'left' | 'right') {
    const el = this.scrollContainerRef.nativeElement as HTMLElement;
    const scrollAmount = 300;
    el.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  }

  navigateToGallery() {
    this.router.navigate(['/frame-gallery']);
  }

  handleAddToCart(url: string) {
    const item: CartItem = {
      imageUrl: url,
      title: 'Frame Counter Image',
      price: 199,
    };

    this.cartService.addToCart(item);
    console.log('Added to cart:', item);
  }
}
