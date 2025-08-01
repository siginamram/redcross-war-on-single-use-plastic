import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreApiService } from '../../services/core-api.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlertDialogComponent } from '../../../../shared/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-zones-form',
  standalone: false,
  templateUrl: './zones-form.component.html',
  styleUrls: ['./zones-form.component.scss']
})
export class ZonesFormComponent implements OnInit {
  zoneForm: FormGroup;
  cities: any[] = [];

  constructor(
    private fb: FormBuilder,
    private api: CoreApiService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.zoneForm = this.fb.group({
      zoneId: [0], // 0 = new; >0 = update
      cityID: ['', Validators.required],
      zoneName: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.api.getCitiesByDistrict(1).subscribe(res => this.cities = res);
  }

  onSubmit(): void {
    if (this.zoneForm.invalid) {
      this.zoneForm.markAllAsTouched();
      return;
    }

    const payload = this.zoneForm.value;

    this.api.UpdateZone(payload).subscribe({
      next: () => {
        const isNew = payload.zoneId === 0;
        const msg = isNew ? 'Zone added successfully' : 'Zone updated successfully';
        this.openAlertDialog('Success', msg, 'success');
        this.zoneForm.reset({ zoneId: 0 });
         this.router.navigate(['/home/core/zone-list']);
      },
      error: () => {
        const isNew = payload.zoneId === 0;
        const msg = isNew ? 'Failed to add zone' : 'Failed to update zone';
        this.openAlertDialog('Error', msg, 'error');
      }
    });
  }

  onCancel(): void {
    history.back();
  }

  openAlertDialog(title: string, message: string, type: string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: { title, message, type }
    });
  }
}
