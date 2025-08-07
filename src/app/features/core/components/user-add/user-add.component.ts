import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreApiService } from '../../services/core-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-add',
  standalone: false,
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {
  userForm!: FormGroup;

  roles: any[] = [];
  districts: any[] = [];
  cities: any[] = [];
  zones: any[] = [];

  // UI Control flags
  showDistrict = false;
  showCity = false;
  showZone = false;

  // Default state ID for districts
  stateId: number = 1;

  constructor(
    private fb: FormBuilder,
    private api: CoreApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Form initialization
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      username: ['', Validators.required],
      passwordHash: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      roleID: ['', Validators.required],
      districtID: [''],
      cityID: [''],
      zoneID: ['']
    });

    // Load roles and districts
    this.api.GetRoles().subscribe(res => {
      this.roles = res || [];
    });

    this.api.getDistrictsByState(this.stateId).subscribe(res => {
      this.districts = res || [];
    });
  }

  // Role selection logic
  onRoleChange(roleId: number): void {
    this.showDistrict = false;
    this.showCity = false;
    this.showZone = false;

    // Show dropdowns based on selected role
    if (roleId === 4) {
      this.showDistrict = true;
    } else if (roleId === 6) {
      this.showDistrict = true;
      this.showCity = true;
    } else if (roleId === 5) {
      this.showDistrict = true;
      this.showCity = true;
      this.showZone = true;
    }

    // Clear dependent fields
    this.userForm.patchValue({
      districtID: '',
      cityID: '',
      zoneID: ''
    });

    this.cities = [];
    this.zones = [];
  }

  // Load cities
  onDistrictChange(districtId: number): void {
    this.api.getCitiesByDistrict(districtId).subscribe(res => {
      this.cities = res || [];
    });
  }

  // Load zones
  onCityChange(cityId: number): void {
    this.api.getZones(cityId).subscribe(res => {
      this.zones = res || [];
    });
  }

  // Submit form
onSubmit(): void {
  if (this.userForm.invalid) {
    console.warn('Form is invalid:', this.userForm.value);
    return;
  }

  const payload = this.userForm.value;
  console.log('Submitting user:', payload);

  this.api.UpdateUser(payload).subscribe({
    next: (res) => {
      alert('User updated successfully');
      this.router.navigate(['/home/core/user-list']);
    },
    error: (err) => {
      console.error('Failed to update user:', err);
      alert('Failed to update user. Please try again.');
    }
  });
}


  // Cancel button handler
  onCancel(): void {
    this.router.navigate(['/home/core/users-list']);
  }
}
