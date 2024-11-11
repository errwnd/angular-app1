
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product, ProductResponse } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://dummyjson.com/products';
  private products: Product[] = [];

  constructor(private http: HttpClient) { }

  getProducts(): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(this.apiUrl).pipe(
      map(response => {
        this.products = response.products;
        return response;
      })
    );
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/add`, product);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    //  DummyJSON won't actually delete items,
    return new Observable(observer => {
      // Find the product index
      const index = this.products.findIndex(p => p.id === id);
      if (index > -1) {
        // Remove from local array
        this.products.splice(index, 1);
        observer.next({ deleted: true, id });
        observer.complete();
      } else {
        observer.error('Product not found');
      }
    });
  }

  //  to get the current products without making an API call
  getCurrentProducts(): Product[] {
    return this.products;
  }
}