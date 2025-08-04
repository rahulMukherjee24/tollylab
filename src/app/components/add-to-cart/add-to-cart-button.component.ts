import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-to-cart-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-to-cart-button.component.html',
  styleUrls: ['./add-to-cart-button.component.scss'],
})
export class AddToCartButtonComponent {
  @Input() imageUrl!: string;
  @Output() cartAdd = new EventEmitter<string>();

  handleClick(event: Event): void {
    event.stopPropagation(); // Prevent parent click if wrapped in clickable div
    console.log('Add to Cart:', this.imageUrl);
    this.cartAdd.emit(this.imageUrl);
  }
}
