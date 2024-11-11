import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-product-list',
  template: `
    <div class="page-container">
      <mat-card class="list-card">
        <mat-card-header>
          <mat-card-title>
            <h1>Product Catalog</h1>
          </mat-card-title>
          <mat-card-subtitle>
            Manage your product inventory
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <!-- Search Filter -->
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search Products</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="Type to search..." #input>
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          <div class="table-container">
            <mat-table [dataSource]="dataSource" matSort class="mat-elevation-z2" [@tableAnimation]="'in'">
              
              <!-- Title Column -->
              <ng-container matColumnDef="title">
                <mat-header-cell *matHeaderCellDef mat-sort-header> Product Name </mat-header-cell>
                <mat-cell *matCellDef="let product"> {{product.title}} </mat-cell>
              </ng-container>

              <!-- Price Column -->
              <ng-container matColumnDef="price">
                <mat-header-cell *matHeaderCellDef mat-sort-header> Price </mat-header-cell>
                <mat-cell *matCellDef="let product"> 
                  <span class="price-tag">{{product.price | usdToInr}}</span>
                </mat-cell>
              </ng-container>

              <!-- Category Column -->
              <ng-container matColumnDef="category">
                <mat-header-cell *matHeaderCellDef mat-sort-header> Category </mat-header-cell>
                <mat-cell *matCellDef="let product">
                  <mat-chip-listbox>
                    <mat-chip color="primary" selected>{{product.category}}</mat-chip>
                  </mat-chip-listbox>
                </mat-cell>
              </ng-container>

              <!-- Stock Column -->
              <ng-container matColumnDef="stock">
                <mat-header-cell *matHeaderCellDef mat-sort-header> Stock </mat-header-cell>
                <mat-cell *matCellDef="let product">
                  <span [class.low-stock]="product.stock < 10">{{product.stock}}</span>
                </mat-cell>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <mat-header-cell *matHeaderCellDef> Actions </mat-header-cell>
                <mat-cell *matCellDef="let product">
                  <button mat-icon-button [matMenuTriggerFor]="menu" color="primary">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #menu="matMenu">
                    <button mat-menu-item (click)="viewProduct(product)">
                      <mat-icon>visibility</mat-icon>
                      <span>View Details</span>
                    </button>
                    <button mat-menu-item (click)="editProduct(product.id)">
                      <mat-icon>edit</mat-icon>
                      <span>Edit</span>
                    </button>
                    <button mat-menu-item (click)="deleteProduct(product.id)" color="warn">
                      <mat-icon>delete</mat-icon>
                      <span>Delete</span>
                    </button>
                  </mat-menu>
                </mat-cell>
              </ng-container>

              <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
              <mat-row *matRowDef="let row; columns: displayedColumns;"
                      class="product-row"
                      [class.expanded]="expandedProduct === row">
              </mat-row>
            </mat-table>

            <!-- Loading Spinner -->
            <div *ngIf="isLoading" class="loading-shade">
              <mat-spinner diameter="50"></mat-spinner>
            </div>

            <!-- No Data Message -->
            <div *ngIf="dataSource.data.length === 0 && !isLoading" class="no-data">
              <mat-icon>inventory_2</mat-icon>
              <p>No products available</p>
              <button mat-raised-button color="primary" routerLink="/product/create">
                Add Your First Product
              </button>
            </div>
          </div>

          <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" 
                        aria-label="Select page of products">
          </mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 20px;
    }

    .list-card {
      margin-bottom: 20px;
    }

    .search-field {
      width: 100%;
      margin-bottom: 20px;
    }

    .table-container {
      position: relative;
      min-height: 200px;
    }

    .loading-shade {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.1);
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .price-tag {
      color: #1976d2;
      font-weight: 500;
    }

    .low-stock {
      color: #f44336;
      font-weight: 500;
    }

    .product-row {
      cursor: pointer;
      &:hover {
        background: #f5f5f5;
      }
    }

    .no-data {
      text-align: center;
      padding: 20px;
      color: #666;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 16px;
      }
    }

    .mat-column-actions {
      width: 80px;
      text-align: center;
    }
  `],
  animations: [
    trigger('tableAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ProductListComponent implements OnInit {
  displayedColumns: string[] = ['title', 'price', 'category', 'stock', 'actions'];
  dataSource = new MatTableDataSource<Product>();
  expandedProduct: Product | null = null;
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productService: ProductService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe(
      (response: any) => {
        this.dataSource.data = response.products;
        this.isLoading = false;
      },
      error => {
        this.showMessage('Error loading products');
        this.isLoading = false;
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  viewProduct(product: Product): void {
    this.expandedProduct = this.expandedProduct === product ? null : product;
  }

  editProduct(id: number): void {
    this.router.navigate(['/product'], { queryParams: { id } });
  }

  deleteProduct(id: number): void {
    const dialogRef = this.snackBar.open('Are you sure you want to delete this product?', 'Delete', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['confirm-dialog']
    });

    dialogRef.onAction().subscribe(() => {
      this.productService.deleteProduct(id).subscribe(
        () => {
          this.dataSource.data = this.productService.getCurrentProducts();
          this.showMessage('Product deleted successfully');
        },
        error => {
          this.showMessage('Error deleting product');
        }
      );
    });
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}