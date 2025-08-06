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
      zoneID: [null, Validators.required],           // make sure default is null not ''
      volunteerID: ['', Validators.required],
      volunteer2ID: ['', Validators.required],
      cityID: ['']
    });

    // Load volunteers
    this.api.getVolunteers().subscribe({
      next: (res) => this.volunteers = res || [],
      error: () => this.volunteers = []
    });

    // Update mode
    if (this.data?.clusterId && this.data.clusterId !== 0) {
      this.isUpdateMode = true;
      const cityId = this.data.cityId || 1;

      this.api.getZones(cityId).subscribe({
        next: (res: any) => {
          this.zones = res || [];
  
          // Use timeout or zone patching to ensure dropdown is ready
          setTimeout(() => {
            this.clusterForm.patchValue({
              clusterId: this.data.clusterId,
              clusterName: this.data.clusterName,
              zoneID: this.data.zoneId,
              volunteerID: this.data.volunteerId,
              volunteer2ID: this.data.volunteer2Id
            });
          }, 0);
        }
      });
    } else {
      // Add Mode: Load districts
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

  console.log('Form Valid:', this.clusterForm.valid);
    if (this.clusterForm.invalid) return;

    const payload = this.clusterForm.value;
    console.log('Payload:', payload);
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
