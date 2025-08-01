import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CoreApiService } from '../../services/core-api.service';
import { AlertDialogComponent } from '../../../../shared/components/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-students-form',
  standalone: false,
  templateUrl: './students-form.component.html',
  styleUrls: ['./students-form.component.scss'],
})
export class StudentsFormComponent implements OnInit {
  studentForm: FormGroup;

  zones: any[] = [];
  clusters: any[] = [];
  schools: any[] = [];
  sections: any[] = [];
  classes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private coreApiService: CoreApiService,
    private dialog: MatDialog
  ) {
    this.studentForm = this.fb.group({
      zone: ['', Validators.required],
      cluster: ['', Validators.required],
      schoolName: ['', Validators.required],
      studentName: ['', Validators.required],
        gender: ['', Validators.required],
      class: ['', Validators.required],
      section: ['', Validators.required],
      rollNo: ['', Validators.required],
      photoUrl: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const cityId = 1; // Example: Static or dynamic
    this.coreApiService.getZones(cityId).subscribe((res) => {
      this.zones = res;
    });

    this.coreApiService.getSections().subscribe((res) => {
      this.sections = res;
    });

    this.coreApiService.getClasses().subscribe((res) => {
      this.classes = res;
    });
  }

  onZoneChange() {
    const zoneId = this.studentForm.get('zone')?.value;
    this.studentForm.get('cluster')?.reset();
    this.studentForm.get('schoolName')?.reset();
    this.schools = [];

    if (zoneId) {
      this.coreApiService.getClustersByZone(zoneId).subscribe((res) => {
        this.clusters = res;
      });
    }
  }

  onClusterChange() {
    const clusterId = this.studentForm.get('cluster')?.value;
    this.studentForm.get('schoolName')?.reset();

    if (clusterId) {
      this.coreApiService.getSchoolsByCluster(clusterId).subscribe((res) => {
        this.schools = res;
      });
    }
  }

  onCancel() {
    this.router.navigate(['/home/core/students-list']);
  }

onSubmit(): void {
  if (this.studentForm.invalid) {
    this.studentForm.markAllAsTouched();
    return;
  }

  const formValue = this.studentForm.value;

  const payload = {
    studentID: formValue.studentID || 0, // optional: set 0 for new student
    studentName: formValue.studentName,
    gender: formValue.gender,
    rollNumber: formValue.rollNo,
    classID: formValue.class,
    sectionID: formValue.section,
    photoLink: formValue.photoUrl || '',
    schoolID: formValue.schoolName,
    clusterId: formValue.cluster,

  };

  this.coreApiService.updateStudent(payload).subscribe({
    next: () => {
      this.openAlertDialog('Success', 'Student saved successfully!', 'success');
      this.router.navigate(['/home/core/students-list']);
    },
    error: (err) => {
      console.error('Error saving student', err);
      this.openAlertDialog('Error', 'Failed to save student. Please try again.', 'error');
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
}
