import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <mat-toolbar color="primary" class="app-toolbar">
        <span class="logo" routerLink="/">🛍️ Product Management System</span>
        <span class="flex-spacer"></span>
        <button mat-button routerLink="/products">
          <mat-icon>inventory_2</mat-icon>
          Products
        </button>
        <button mat-raised-button color="accent" routerLink="/product/create">
          <mat-icon>add</mat-icon>
          New Product
        </button>
      </mat-toolbar>

      <div class="content-container">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .app-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .logo {
      font-size: 1.5rem;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .flex-spacer {
      flex: 1 1 auto;
    }

    .content-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    button {
      margin-left: 8px;
    }

    mat-icon {
      margin-right: 4px;
    }
  `]
})
export class AppComponent {
  title = 'product-crud';
}