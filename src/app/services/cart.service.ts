import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(cartItem: CartItem) {
    let existingCartItem: CartItem = this.cartItems.find(item => item.id === cartItem.id)!;
    let isItemAlreadyExists: boolean = (existingCartItem != undefined);

    if (isItemAlreadyExists) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(cartItem);
    }

    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalQuantityVal = 0;
    let totalPriceVal = 0;

    for(let item of this.cartItems) {
      totalQuantityVal += item.quantity;
      totalPriceVal += item.quantity * item.unitPrice;
    }

    this.totalQuantity.next(totalQuantityVal);
    this.totalPrice.next(totalPriceVal);
  }
}
