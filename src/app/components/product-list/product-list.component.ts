import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  previousCategoryId: number = 1;
  currentCategoryId: number = 1;
  searchMode: boolean = false;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalElement: number = 0;

  constructor(private productService: ProductService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  updatePageSize(newPageSize: string) {
    this.pageSize = +newPageSize;
    this.pageNumber = 1;
    this.listProducts();
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const keyword: string = this.route.snapshot.paramMap.get('keyword')!;

    this.productService.searchProductsPaginate(keyword,
                                               this.pageNumber - 1,
                                               this.pageSize
                                               ).subscribe(this.processResult());
  }

  handleListProducts() {
    const hasCategoryId = this.route.snapshot.paramMap.get('id');

    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }
    else {
      this.currentCategoryId = 1;
    }

    if(this.previousCategoryId != this.currentCategoryId) {
      this.pageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;
    console.log(`Current category ID: ${this.currentCategoryId}, page number: ${this.pageNumber}`)

    this.productService.getProductListPaginate(this.pageNumber - 1,
                                               this.pageSize,
                                               this.currentCategoryId)
                                               .subscribe(this.processResult());
  }

  processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElement = data.page.totalElements;
    }
  }
}
