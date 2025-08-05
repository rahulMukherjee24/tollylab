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

  clicked = false;

  handleClick(event: Event): void {
    event.stopPropagation();
    this.clicked = true;
    this.cartAdd.emit(this.imageUrl);

    // Reset animation state after it completes
    setTimeout(() => {
      this.clicked = false;
    }, 800); // Match this with your CSS animation duration
  }
}
