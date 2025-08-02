import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';;
import { CoreApiService } from '../../services/core-api.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-students-reward-transactions',
  standalone: false,
  templateUrl: './students-reward-transactions.component.html',
  styleUrls: ['./students-reward-transactions.component.scss']
})
export class StudentsRewardTransactionsComponent implements OnInit {
  transactions: any[] = [];
  loading = true;
  displayedColumns: string[] = ['transactionDate', 'rewardPoint', 'type', 'studentName'];
  constructor(
    public dialogRef: MatDialogRef<StudentsRewardTransactionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { studentID: number },
    private api: CoreApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.api.GetRewardTransaction(this.data.studentID).subscribe({
      next: (res) => {
        this.transactions = res || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch reward transactions', err);
        this.loading = false;
      }
    });
  }


closeDialog(): void {
 
  this.dialogRef.close(); // If using MatDialogRef (inject in constructor)
}
}
