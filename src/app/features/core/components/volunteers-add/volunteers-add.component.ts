import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreApiService } from '../../services/core-api.service';
import { Router } from '@angular/router';
import { AlertDialogComponent } from '../../../../shared/components/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-volunteers-add',
  standalone: false,
  templateUrl: './volunteers-add.component.html',
  styleUrls: ['./volunteers-add.component.scss']
})
export class VolunteersAddComponent implements OnInit {
  volunteerForm!: FormGroup;

  constructor(private fb: FormBuilder, private api: CoreApiService,
     private router: Router,
     private dialog: MatDialog
    ) {}

  ngOnInit(): void {
    this.volunteerForm = this.fb.group({
      volunteerName: ['', Validators.required],
      mobileNo: ['', [Validators.required, Validators.pattern('^[6-9]\\d{9}$')]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      organization: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.volunteerForm.invalid) {
      this.volunteerForm.markAllAsTouched();
      return;
    }

    const payload = this.volunteerForm.value;
    this.api.updateVolunteer(payload).subscribe({
      next: () => {
        this.openAlertDialog('Success', 'Volunteer added successfully!', 'success');
        this.router.navigate(['/home/core/Volunteers-list']);
      },
      error: () => {
           this.openAlertDialog('Error', 'Failed to save Volunteer. Please try again.', 'error');
      }
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

  onCancel(): void {
    this.router.navigate(['/home/core/Volunteers-list']);
  }
}
