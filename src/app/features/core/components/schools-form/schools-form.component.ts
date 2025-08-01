import { Component, OnInit, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreApiService } from '../../services/core-api.service';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../../../shared/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-schools-form',
  standalone: false,
  templateUrl: './schools-form.component.html',
  styleUrls: ['./schools-form.component.scss']
})
export class SchoolsFormComponent implements OnInit {
  schoolForm!: FormGroup;
  districts: any[] = [];
  cities: any[] = [];
  zones: any[] = [];
  schoolTypes: any[] = [];
  clusters: any[] = [];
  isPopupMode = false;

  constructor(
    private fb: FormBuilder,
    private api: CoreApiService,
    private router: Router,
    private dialog: MatDialog,
    @Optional() public dialogRef?: MatDialogRef<SchoolsFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any
  ) {}

ngOnInit(): void {
  this.isPopupMode = !!this.dialogRef;
  this.initializeForm();
  this.fetchSchoolTypes();

  if (this.data) {
    this.api.getDistrictsByState(1).subscribe({
      next: (districtsRes) => {
        this.districts = districtsRes || [];
        this.schoolForm.patchValue({ district: this.data.districtID });

        this.api.getCitiesByDistrict(this.data.districtID).subscribe({
          next: (citiesRes) => {
            this.cities = citiesRes || [];
            this.schoolForm.patchValue({ city: this.data.cityID });

            this.api.getZones(this.data.cityID).subscribe({
              next: (zonesRes) => {
                this.zones = zonesRes || [];
                this.schoolForm.patchValue({ zone: this.data.zoneID });

                this.api.getClustersByZone(this.data.zoneID).subscribe({
                  next: (clustersRes) => {
                    this.clusters = clustersRes || [];
                    this.schoolForm.patchValue({ cluster: this.data.clusterId });
                    this.patchForm(this.data); // Final patch after dropdowns are ready
                  },
                  error: () => this.clusters = []
                });
              },
              error: () => this.zones = []
            });
          },
          error: () => this.cities = []
        });
      },
      error: () => this.districts = []
    });
  } else {
    this.fetchDistricts(1); // only for add form
  }
}


  initializeForm(): void {
    this.schoolForm = this.fb.group({
      schoolName: ['', [Validators.required, Validators.minLength(3)]],
      contactPerson: ['', Validators.required],
      contactPersonDesignation: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      district: ['', Validators.required],
      city: ['', Validators.required],
      zone: ['', Validators.required],
      cluster: ['', Validators.required],
      schoolType: ['', Validators.required],
      latitude: [''],
      longitude: [''],
      hodName: ['', Validators.required],
      hodMobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      hodEmail: ['', [Validators.required, Validators.email]]
    });
  }

patchForm(school: any): void {
  this.schoolForm.patchValue({
    schoolName: school.schoolName,
    hodName: school.hodName,
    hodMobile: school.hodPhone,
    hodEmail: school.hodEmail,
    contactPerson: school.contactPersonName,
    contactPersonDesignation: school.contactPersonDesignation,
    mobile: school.contactPersonPhone,
    email: school.contactPersonEmail,
    schoolType: school.schoolTypeId,
    address: school.schoolAddress,
    latitude: school.latitude,
    longitude: school.longitude
  });

  this.schoolForm.addControl('schoolID', this.fb.control(school.schoolID));
}


  fetchDistricts(stateId: number): void {
    this.api.getDistrictsByState(stateId).subscribe({
      next: (res) => this.districts = res || [],
      error: () => this.districts = []
    });
  }

  onDistrictChange(districtId: number): void {
    this.api.getCitiesByDistrict(districtId).subscribe({
      next: (res) => this.cities = res || [],
      error: () => this.cities = []
    });
  }

  onCityChange(cityId: number): void {
    this.fetchZones(cityId);
    this.schoolForm.get('zone')?.setValue(null);
    this.clusters = [];
  }

  fetchZones(cityId: number): void {
    if (!cityId) return;

    this.api.getZones(cityId).subscribe({
      next: (res) => this.zones = res || [],
      error: () => this.zones = []
    });
  }

  fetchSchoolTypes(): void {
    this.api.getSchoolTypes().subscribe({
      next: (res) => this.schoolTypes = res || [],
      error: () => this.schoolTypes = []
    });
  }

  fetchClustersByZone(): void {
    const zoneId = this.schoolForm?.get('zone')?.value;
    if (!zoneId) return;
    this.api.getClustersByZone(zoneId).subscribe({
      next: (res) => this.clusters = res || [],
      error: () => this.clusters = []
    });
  }

  onZoneChange(): void {
    this.fetchClustersByZone();
  }

  onSubmit(): void {
    if (this.schoolForm.invalid) {
      this.schoolForm.markAllAsTouched();
      return;
    }

    const formValue = this.schoolForm.value;

    const payload = {
      schoolID: formValue.schoolID || 0,
      schoolName: formValue.schoolName,
      hodName: formValue.hodName,
      hodPhone: formValue.hodMobile,
      hodEmail: formValue.hodEmail,
      contactPersonName: formValue.contactPerson,
      contactPersonPhone: formValue.mobile,
      contactPersonEmail: formValue.email,
      contactPersonDesignation: formValue.contactPersonDesignation,
      schoolTypeId: formValue.schoolType,
      schoolAddress: formValue.address,
      latitude: formValue.latitude || 0,
      longitude: formValue.longitude || 0,
      clusterId: formValue.cluster,
      zoneID: formValue.zone,
      cityID: formValue.city,
      districtID: formValue.district,
      stateID: 1
    };

    this.api.updateSchool(payload).subscribe({
      next: () => {
        this.openAlertDialog('Success', 'School saved successfully!', 'success');
        if (this.dialogRef) {
          this.dialogRef.close('refresh');
        } else {
          this.router.navigate(['/home/core/schools-list']);
        }
      },
      error: (err) => {
        console.error('Error saving school', err);
        this.openAlertDialog('Error', 'Failed to save school. Please try again.', 'error');
      }
    });
  }

  openAlertDialog(title: string, message: string, type: string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: { title, message, type },
    });
  }

  onCancel(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else {
      this.router.navigate(['/home/core/schools-list']);
    }
  }
}
