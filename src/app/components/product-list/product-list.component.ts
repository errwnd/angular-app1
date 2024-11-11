import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-list',
  template: `
    <div class="container mat-elevation-z8">
      <div class="header">
        <h2>Products</h2>
        <button mat-raised-button color="primary" (click)="createProduct()">
          Add Product
        </button>
      </div>

      <mat-table [dataSource]="dataSource" class="mat-elevation-z8">
        <!-- Title Column -->
        <ng-container matColumnDef="title">
          <mat-header-cell *matHeaderCellDef> Name </mat-header-cell>
          <mat-cell *matCellDef="let product"> {{product.title}} </mat-cell>
        </ng-container>

        <!-- Price Column -->
        <ng-container matColumnDef="price">
          <mat-header-cell *matHeaderCellDef> Price </mat-header-cell>
          <mat-cell *matCellDef="let product"> {{product.price | usdToInr}} </mat-cell>
        </ng-container>

        <!-- Category Column -->
        <ng-container matColumnDef="category">
          <mat-header-cell *matHeaderCellDef> Category </mat-header-cell>
          <mat-cell *matCellDef="let product"> {{product.category}} </mat-cell>
        </ng-container>

        <!-- Description Column -->
        <ng-container matColumnDef="description">
          <mat-header-cell *matHeaderCellDef> Description </mat-header-cell>
          <mat-cell *matCellDef="let product"> {{product.description}} </mat-cell>
        </ng-container>

        <!-- Stock Column -->
        <ng-container matColumnDef="stock">
          <mat-header-cell *matHeaderCellDef> Stock </mat-header-cell>
          <mat-cell *matCellDef="let product"> {{product.stock}} </mat-cell>
        </ng-container>

        <!-- Actions Column -->
        <ng-container matColumnDef="actions">
          <mat-header-cell *matHeaderCellDef> Actions </mat-header-cell>
          <mat-cell *matCellDef="let product">
            <button mat-icon-button color="primary" (click)="editProduct(product.id)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteProduct(product.id)">
              <mat-icon>delete</mat-icon>
            </button>
          </mat-cell>
        </ng-container>

        <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
        <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
      </mat-table>

      <!-- No Data Row -->
      <div *ngIf="dataSource.data.length === 0" class="no-data">
        No products available
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      margin: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    mat-table {
      width: 100%;
    }
    .no-data {
      text-align: center;
      padding: 20px;
      font-style: italic;
      color: #666;
    }
    mat-cell {
      padding: 10px;
    }
  `]
})
export class ProductListComponent implements OnInit {
  displayedColumns: string[] = ['title', 'price', 'category', 'description', 'stock', 'actions'];
  dataSource = new MatTableDataSource<Product>();

  constructor(
    private productService: ProductService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (response: any) => {
        this.dataSource.data = response.products;
      },
      error => {
        this.showMessage('Error loading products');
      }
    );
  }

  createProduct(): void {
    this.router.navigate(['/product/create']);
  }

  editProduct(id: number): void {
    this.router.navigate(['/product'], { queryParams: { id } });
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(
        () => {
          this.dataSource.data = this.productService.getCurrentProducts();
          this.showMessage('Product deleted successfully');
        },
        error => {
          this.showMessage('Error deleting product');
        }
      );
    }
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}