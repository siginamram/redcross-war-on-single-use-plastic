import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreApiService } from '../../services/core-api.service';
import { Router } from '@angular/router';
import { AlertDialogComponent } from '../../../../shared/components/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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

  constructor(
    private fb: FormBuilder,
    private api: CoreApiService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.fetchDistricts(1); 
    this.fetchSchoolTypes();
    this.fetchClustersByZone(); // You can also call this on zone change
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
    this.fetchClustersByZone(); // re-fetch clusters when zone changes
  }

 onSubmit(): void {
  if (this.schoolForm.invalid) {
    this.schoolForm.markAllAsTouched();
    return;
  }

  const formValue = this.schoolForm.value;

  const payload = {
    schoolID: formValue.schoolID || 0, // optional, set to 0 if undefined
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
    stateID: 1 // assuming state is fixed for now
  };

  this.api.updateSchool(payload).subscribe({
    next: () => {
      //alert('School saved successfully');
      this.openAlertDialog('Success', 'School saved successfully!', 'success');
      this.router.navigate(['/home/core/schools-list']);
    },
    error: (err) => {
      console.error('Error saving school', err);
      //alert('Failed to save school');
      this.openAlertDialog('Error', 'Failed to save school. Please try again.', 'error');
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
    this.router.navigate(['/home/core/schools-list']);
  }
}
