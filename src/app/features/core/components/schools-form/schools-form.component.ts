import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-schools-form',
  standalone: false,
  templateUrl: './schools-form.component.html',
  styleUrls: ['./schools-form.component.scss']
})
export class SchoolsFormComponent {
  schoolForm: FormGroup;
  districts = ['Guntur', 'Krishna', 'Prakasam'];
  cities = ['Guntur City', 'Vijayawada', 'Ongole'];
  zones = ['North', 'Central', 'South'];
  schoolTypes = ['CBSE', 'State', 'ICSE', 'Municipal'];
clusters = ['Cluster 1', 'Cluster 2', 'Cluster 3'];

  constructor(private fb: FormBuilder, private router: Router) {
    this.schoolForm = this.fb.group({
      schoolName: [''],
      contactPerson: [''],
      contactPersonDesignation: [''],
      mobile: [''],
      email: [''],
      address: [''],
      district: [''],
      city: [''],
      zone: [''],
      cluster: [''],       
      schoolType: [''],     
      latitude: [''],
      longitude: [''],
      hodName: [''],
      hodMobile: [''],
      hodEmail: ['']
    });
  }

  onSubmit() {
    if (this.schoolForm.valid) {
      console.log('Form Submitted', this.schoolForm.value);
      // Call your API here
    }
  }

  onCancel() {
    this.router.navigate(['/home/core/schools-list']);
  }
}
