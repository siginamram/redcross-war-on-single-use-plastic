import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreApiService } from '../../services/core-api.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlertDialogComponent } from '../../../../shared/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-cluster-form',
  standalone: false,
  templateUrl: './cluster-form.component.html',
  styleUrls: ['./cluster-form.component.scss']
})
export class ClusterFormComponent implements OnInit {
  clusterForm!: FormGroup;
  cities: any[] = [];
  zones: any[] = [];
  volunteers: any[] = [];
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
    @Optional() private dialogRef: MatDialogRef<ClusterFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isPopup = !!dialogRef;
  }

ngOnInit(): void {
  this.clusterForm = this.fb.group({
    clusterId: [0],
    clusterName: ['', Validators.required],
    zoneID: ['', Validators.required],
    volunteerID: ['', Validators.required],
    volunteerID2: ['', Validators.required],
    cityID: [''] // only for Add Mode
  });

  this.api.getVolunteers().subscribe({
    next: (res) => this.volunteers = res || [],
    error: () => this.volunteers = []
  });

  if (this.data?.clusterId && this.data.clusterId !== 0) {
  this.isUpdateMode = true;

  // 👇 Make sure to get cityId from some backup value
  const cityId = this.data.cityId || 1; // fallback if needed

  this.api.getZones(cityId).subscribe({
    next: (res: any) => {
      this.zones = res || [];
      this.clusterForm.patchValue({
        clusterId: this.data.clusterId,
        clusterName: this.data.clusterName,
        zoneID: this.data.zoneID,
        volunteerID: this.data.volunteerId,
        volunteerID2: this.data.volunteerId2,
      });
    }
  });
} else {
    // ✅ ADD MODE
    this.api.getDistrictsByState(this.stateId).subscribe(res => {
      this.districts = res;
    });
  }
}

  onDistrictChange(): void {
    this.clusterForm.get('cityID')?.setValue('');
    this.cities = [];

    if (this.selectedDistrict) {
      this.api.getCitiesByDistrict(this.selectedDistrict).subscribe(res => {
        this.cities = res;
      });
    }
  }

  onCityChange(cityId: number): void {
    this.zones = [];
    this.clusterForm.patchValue({ zoneID: null });

    this.api.getZones(cityId).subscribe({
      next: (res) => this.zones = res || [],
      error: () => this.zones = []
    });
  }

  onSubmit(): void {
    if (this.clusterForm.invalid) return;

    const payload = this.clusterForm.value;

    this.api.updateCluster(payload).subscribe({
      next: () => {
        this.openAlertDialog('Success', 'Cluster saved successfully.', 'success');

        if (this.isPopup) {
          this.dialogRef?.close('updated');
        } else {
          this.router.navigate(['/home/core/cluster-list']);
        }

        this.clusterForm.reset();
      },
      error: (err) => {
        this.openAlertDialog('Error', 'Failed to save cluster. Please try again.', 'error');
        console.error(err);
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
      data: { title, message, type },
    });
  }
}
