import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreApiService } from '../../services/core-api.service';
import { AlertDialogComponent } from '../../../../shared/components/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-update-popup',
  standalone: false,
  templateUrl: './user-update-popup.component.html',
  styleUrls: ['./user-update-popup.component.scss']
})
export class UserUpdatePopupComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<UserUpdatePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private api: CoreApiService,
    private dialog: MatDialog
  ) {
    this.form = this.fb.group({
      userID: [data.userID],
      username: [data.username, Validators.required],
      passwordHash: [data.passwordHash, Validators.required],
      fullName: [data.fullName, Validators.required]
    });
  }

  onUpdate() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.api.UpdateUser(this.form.value).subscribe((
      next: any) => {
      this.openAlertDialog('Success', 'User updated successfully', 'success');
      this.dialogRef.close('updated');
    }, (error: any) => {    
      this.openAlertDialog('Error', 'Failed to update user', 'error');
    });
  }
    

    openAlertDialog(title: string, message: string, type: string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: {
        title,
        message,
        type,
      },
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
