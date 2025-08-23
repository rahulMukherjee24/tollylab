import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
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

  ngOnInit(): void {
    this.loadOrders();
  }

  private loadOrders(): void {
    const user = this.auth.currentUser;
    if (!user) {
      this.loading = false;
      return;
    }

    const q = query(
      collection(this.firestore, 'orderHistory'),
      where('userId', '==', user.uid)
    );

    getDocs(q)
      .then((querySnapshot) => {
        this.orders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      })
      .catch((err) => {
        console.error('Error fetching order history:', err);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  async updateStatus(order: any, event: Event): Promise<void> {
    const newStatus = (event.target as HTMLElement).innerText.trim();
    if (!newStatus || newStatus === order.status) return;

    try {
      const orderRef = doc(this.firestore, 'orderHistory', order.id);
      await updateDoc(orderRef, { status: newStatus });
      order.status = newStatus; // update UI instantly
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  }
}
