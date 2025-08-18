import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-darkroom',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './darkroom.component.html',
  styleUrls: ['./darkroom.component.scss'],
})
export class DarkroomComponent {
  rates = [
    {
      service: 'Black & White Processing',
      description:
        'Custom hand-processed B&W film for fine contrast and classic grain',
      price: 400,
    },
    {
      service: 'C-41 Color Processing',
      description: 'Professional color negative (C-41) film processing',
      price: 500,
    },
    {
      service: 'ECN-2 Processing',
      description:
        'Specialized motion picture film developing with cinematic tones',
      price: 500,
    },
    {
      service: 'Fuji Frontier Scanning',
      description:
        'Sharp, warm scans on India’s only working Fuji Frontier SP2000',
      price: 400,
    },
    {
      service: '4x6 Minilab Printing (matte)',
      description: 'Full roll printed with a Fuji minilab in 4x6 enlargement',
      price: 500,
    },
    {
      service: 'Negative Return Shipping',
      description: 'Safe courier return of developed film negatives',
      price: 100,
    },
  ];
}
