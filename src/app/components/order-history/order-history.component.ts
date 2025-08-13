import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
})
export class OrderHistoryComponent implements OnInit {
  orders: any[] = [];
  loading = true;

  constructor(private firestore: Firestore, private auth: Auth) {}

  async ngOnInit() {
    const user = this.auth.currentUser;
    if (!user) {
      this.loading = false;
      return;
    }

    const q = query(
      collection(this.firestore, 'orderHistory'),
      where('userId', '==', user.uid)
    );

    const querySnapshot = await getDocs(q);
    this.orders = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    this.loading = false;
  }
}
