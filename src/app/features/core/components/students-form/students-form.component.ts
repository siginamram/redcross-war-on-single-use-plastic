import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-students-form',
  standalone: false,
  templateUrl: './students-form.component.html',
  styleUrls: ['./students-form.component.scss'],
})
export class StudentsFormComponent {
  studentForm: FormGroup;

  zones = ['Zone A', 'Zone B', 'Zone C'];
  clustersByZone: Record<string, string[]> = {
    'Zone A': ['Cluster A1', 'Cluster A2'],
    'Zone B': ['Cluster B1'],
    'Zone C': ['Cluster C1', 'Cluster C2'],
  };
  schoolsByCluster: Record<string, string[]> = {
    'Cluster A1': ['Sunrise Public School'],
    'Cluster A2': ['Green Valley High'],
    'Cluster B1': ['Riverdale High'],
    'Cluster C1': ['Moonlight School'],
    'Cluster C2': ['Hilltop Academy'],
  };
  sections = ['A', 'B', 'C', 'D', 'E'];

  filteredClusters: string[] = [];
  filteredSchools: string[] = [];

  classes = ['6', '7', '8', '9', '10'];

  constructor(private fb: FormBuilder, private router: Router) {
    this.studentForm = this.fb.group({
      zone: ['', Validators.required],
      cluster: ['', Validators.required],
      schoolName: ['', Validators.required],
      studentName: ['', Validators.required],
      class: ['', Validators.required],
      section: [''],
      rollNo: [''],
      photoUrl: ['']
    });
  }

  onZoneChange() {
    const selectedZone = this.studentForm.get('zone')?.value;
    this.filteredClusters = this.clustersByZone[selectedZone] || [];
    this.studentForm.get('cluster')?.reset();
    this.studentForm.get('schoolName')?.reset();
    this.filteredSchools = [];
  }

  onClusterChange() {
    const selectedCluster = this.studentForm.get('cluster')?.value;
    this.filteredSchools = this.schoolsByCluster[selectedCluster] || [];
    this.studentForm.get('schoolName')?.reset();
  }

  onCancel() {
    this.router.navigate(['/home/core/students-list']);
  }

  onSubmit() {
    if (this.studentForm.valid) {
      const formData = this.studentForm.value;
      console.log('Form Data:', formData);
      // Save logic here
    }
  }
}
