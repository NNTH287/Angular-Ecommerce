import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit {

  totalQuantity: number = 0;
  totalPrice: number = 0.00;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.updateCartTotals();
  }

  updateCartTotals() {
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
  }
}
