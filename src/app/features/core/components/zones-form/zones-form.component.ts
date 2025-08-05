import { Component, OnInit, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreApiService } from '../../services/core-api.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  districts: any[] = [];
  selectedDistrict: number = 0;
  stateId: number = 1;
  isPopup: boolean = false;
  isUpdateMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private api: CoreApiService,
    private dialog: MatDialog,
    private router: Router,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    @Optional() private dialogRef: MatDialogRef<ZonesFormComponent>
  ) {
    this.isPopup = !!dialogRef;

    this.zoneForm = this.fb.group({
      zoneID: [0], // ✅ Use exact key names
      cityID: ['', Validators.required],
      zoneName: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    console.log('Data:', this.data);

    this.isUpdateMode = !!(this.data?.zoneID && this.data.zoneID !== 0);
    console.log('isUpdateMode:', this.isUpdateMode);

    if (this.isUpdateMode) {
      // ✅ Edit mode: patch form with data
      this.zoneForm.patchValue({
        zoneID: this.data.zoneID,
        zoneName: this.data.zoneName,
        cityID: this.data.cityID
      });
    } else {
      // ✅ Add mode: load district list
      this.api.getDistrictsByState(this.stateId).subscribe(res => {
        this.districts = res;
      });
    }
  }

  onDistrictChange(): void {
    this.zoneForm.get('cityID')?.setValue('');
    this.cities = [];

    if (this.selectedDistrict) {
      this.api.getCitiesByDistrict(this.selectedDistrict).subscribe(res => {
        this.cities = res;
      });
    }
  }

  onSubmit(): void {
    if (this.zoneForm.invalid) {
      this.zoneForm.markAllAsTouched();
      return;
    }

    const payload = this.zoneForm.value;

    this.api.UpdateZone(payload).subscribe({
      next: () => {
        const isNew = payload.zoneID === 0;
        const msg = isNew ? 'Zone added successfully' : 'Zone updated successfully';
        this.openAlertDialog('Success', msg, 'success');

        if (this.isPopup) {
          this.dialogRef?.close('updated');
        } else {
          this.zoneForm.reset({ zoneID: 0 });
          this.router.navigate(['/home/core/zone-list']);
        }
      },
      error: () => {
        const isNew = payload.zoneID === 0;
        const msg = isNew ? 'Failed to add zone' : 'Failed to update zone';
        this.openAlertDialog('Error', msg, 'error');
      }
    });
  }

  onCancel(): void {
    if (this.isPopup) {
      this.dialogRef?.close();
    } else {
      history.back();
    }
  }

  openAlertDialog(title: string, message: string, type: string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: { title, message, type }
    });
  }
}
