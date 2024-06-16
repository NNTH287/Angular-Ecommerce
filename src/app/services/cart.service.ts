import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

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

  decreaseQuantity(cartItem: CartItem) {
    cartItem.quantity--;

    if(cartItem.quantity == 0) {
      this.remove(cartItem);
    } else {
      this.computeCartTotals();
    }
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
  
  remove(cartItem: CartItem) {
    const cartItemIndex = this.cartItems.findIndex(item => item.id == cartItem.id);

    if(cartItemIndex > -1) {
      this.cartItems.splice(cartItemIndex, 1);
      this.computeCartTotals();
    }
  }
}
