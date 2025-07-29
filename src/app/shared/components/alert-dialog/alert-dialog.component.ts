import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-dialog',
  standalone: false,
  template: `
    <div class="alert-card">
      <div class="icon-wrapper" [ngClass]="data.type">
        <img [src]="getIconUrl()" alt="icon" />
      </div>
      <h2 class="alert-title">{{ data.title }}</h2>
      <p class="alert-message">{{ data.message }}</p>
      <button mat-raised-button color="primary" class="alert-btn" (click)="onConfirm()">OK</button>
    </div>
  `,
  styles: [`
    .alert-card {
      background: #fff;
      border-radius: 14px;
      padding: 30px 25px;
      max-width: 400px;
      width: 90%;
      text-align: center;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
      animation: fadeIn 0.3s ease;
    }

    .icon-wrapper {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      margin: 0 auto 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #eee;
    }

    .icon-wrapper img {
      width: 40px;
      height: 40px;
    }

    .icon-wrapper.success { background: #e8f5e9; }
    .icon-wrapper.error { background: #ffebee; }
    .icon-wrapper.warning { background: #fff8e1; }

    .alert-title {
      font-size: 22px;
      font-weight: 600;
      margin: 10px 0;
      color: #333;
    }

    .alert-message {
      font-size: 16px;
      color: #555;
      margin-bottom: 25px;
      line-height: 1.4;
    }

    .alert-btn {
      padding: 10px 20px;
      font-size: 16px;
      border-radius: 8px;
      background-color: #3f51b5;
      color: white;
      transition: background 0.2s ease;
    }

    .alert-btn:hover {
      background-color: #303f9f;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 600px) {
      .alert-card { padding: 20px; }
      .alert-title { font-size: 20px; }
      .alert-message { font-size: 14px; }
    }
  `]
})
export class AlertDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  getIconUrl(): string {
    switch (this.data.type) {
      case 'success':
        return 'assets/icons/success.svg'; // Use your local asset
      case 'error':
        return 'assets/icons/error.svg';
      case 'warning':
        return 'assets/icons/warning.svg';
      default:
        return 'assets/icons/info.svg';
    }
  }
}
