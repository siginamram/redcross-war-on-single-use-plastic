import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreApiService } from '../../services/core-api.service';
import { Router } from '@angular/router';

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


 schoolTypes = [
  { id: 1, name: 'CBSE' },
  { id: 2, name: 'State' },
  { id: 3, name: 'ICSE' },
  { id: 4, name: 'Municipal' }
];

clusters = [
  { id: 1, name: 'Cluster 1' },
  { id: 2, name: 'Cluster 2' },
  { id: 3, name: 'Cluster 3' },
  { id: 4, name: 'Cluster 4' }
];
  constructor(
    private fb: FormBuilder,
    private api: CoreApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.fetchDistricts(1); 
    this.fetchZones();
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

fetchZones(): void {
  this.api.getZones().subscribe({
    next: (res) => this.zones = res || [],
    error: () => this.zones = []
  });
}


  onSubmit(): void {
    if (this.schoolForm.invalid) {
      this.schoolForm.markAllAsTouched();
      return;
    }

    const payload = this.schoolForm.value;
    console.log('Form Data Submitted:', payload);
    // TODO: call API to save the school
  }

  onCancel(): void {
    this.router.navigate(['/home/core/schools-list']);
  }
}
