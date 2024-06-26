import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }
  get shippingStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get billingStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }

  constructor(private formBuilder: FormBuilder, 
              private formService: Luv2ShopFormService,
              private cartService: CartService) { }

  ngOnInit(): void {
    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl(
          '', 
          [Validators.required, 
            Validators.minLength(2), 
            Luv2ShopValidators.notOnlyWhitespace]
        ),
        lastName: new FormControl(
          '', 
          [Validators.required, 
            Validators.minLength(2), 
            Luv2ShopValidators.notOnlyWhitespace]
        ),
        email: new FormControl(
          '', 
          [Validators.required, 
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), 
            Luv2ShopValidators.notOnlyWhitespace]
        )
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl(
          '', 
          [Validators.required, 
            Validators.minLength(2), 
            Luv2ShopValidators.notOnlyWhitespace]
        ),
        city: new FormControl(
          '', 
          [Validators.required, 
            Validators.minLength(2), 
            Luv2ShopValidators.notOnlyWhitespace]
        ),
        state: new FormControl(
          '', 
          [Validators.required]
        ),
        country: new FormControl(
          '', 
          [Validators.required]
        ),
        zipCode: new FormControl(
          '', 
          [Validators.required, 
            Validators.minLength(2), 
            Luv2ShopValidators.notOnlyWhitespace]
        )
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl(
          '', 
          [Validators.required, 
            Validators.minLength(2), 
            Luv2ShopValidators.notOnlyWhitespace]
        ),
        city: new FormControl(
          '', 
          [Validators.required, 
            Validators.minLength(2), 
            Luv2ShopValidators.notOnlyWhitespace]
        ),
        state: new FormControl(
          '', 
          [Validators.required]
        ),
        country: new FormControl(
          '', 
          [Validators.required]
        ),
        zipCode: new FormControl(
          '', 
          [Validators.required, 
            Validators.minLength(2), 
            Luv2ShopValidators.notOnlyWhitespace]
        )
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl(
          '', 
          [Validators.required]
        ),
        nameOnCard: new FormControl(
          '', 
          [Validators.required, 
            Validators.minLength(2), 
            Luv2ShopValidators.notOnlyWhitespace]
        ),
        cardNumber: new FormControl(
          '', 
          [Validators.required,
            Validators.pattern('[0-9]{16}')]
        ),
        securityCode: new FormControl(
          '', 
          [Validators.required,
            Validators.pattern('[0-9]{3}')]
        ),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    // populate credit card info
    const startMonth = new Date().getMonth() + 1;
    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    );
    this.formService.getCreditCardYears().subscribe(
      data => {
        this.creditCardYears = data;
      }
    );

    // populate countries
    this.formService.getCountries().subscribe(
      data => {
        this.countries = data;
      }
    );
  }

  reviewCartDetails() {
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
  }

  onSubmit(): void{
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }
  }

  copyShippingAddressToBillingAddress(event: any) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number  = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    let startMonth: number;
    if(selectedYear === currentYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    );
  }

  getStatesFor(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;

    this.formService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }

        formGroup?.get('state')?.setValue(data[0]);
      }
    );
  }
}
