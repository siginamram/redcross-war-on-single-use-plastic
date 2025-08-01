import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CoreApiService } from '../../services/core-api.service';
import { AlertDialogComponent } from '../../../../shared/components/alert-dialog/alert-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-students-form',
  standalone: false,
  templateUrl: './students-form.component.html',
  styleUrls: ['./students-form.component.scss']
})
export class StudentsFormComponent implements OnInit {
  studentForm!: FormGroup;

  zones: any[] = [];
  clusters: any[] = [];
  schools: any[] = [];
  sections: any[] = [];
  classes: any[] = [];

  isPopupMode = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private coreApiService: CoreApiService,
    private dialog: MatDialog,
    @Optional() public dialogRef?: MatDialogRef<StudentsFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any
  ) {}

  ngOnInit(): void {
    this.isPopupMode = !!this.dialogRef;
    console.log('Is Popup Mode:', this.isPopupMode);
    console.log('Dialog Data:', this.data);
    this.initializeForm();

    this.coreApiService.getSections().subscribe(res => this.sections = res || []);
    this.coreApiService.getClasses().subscribe(res => this.classes = res || []);

    if (this.data) {
      // Update mode - load dependencies before patch
      this.coreApiService.getZones(1).subscribe(zones => {
        this.zones = zones || [];
        this.studentForm.patchValue({ zone: this.data.zoneID });

        this.coreApiService.getClustersByZone(this.data.zoneID).subscribe(clusters => {
          this.clusters = clusters || [];
          this.studentForm.patchValue({ cluster: this.data.clusterId });

          this.coreApiService.getSchoolsByCluster(this.data.clusterId).subscribe(schools => {
            this.schools = schools || [];
            this.patchForm(this.data);
          });
        });
      });
    } else {
      // Add mode
      this.coreApiService.getZones(1).subscribe(zones => {
        this.zones = zones || [];
      });
    }
  }

  initializeForm(): void {
    this.studentForm = this.fb.group({
      zone: ['', Validators.required],
      cluster: ['', Validators.required],
      schoolName: ['', Validators.required],
      studentName: ['', Validators.required],
      gender: ['', Validators.required],
      class: ['', Validators.required],
      section: ['', Validators.required],
      rollNo: ['', Validators.required],
      photoUrl: ['', Validators.required]
    });
  }

  patchForm(student: any): void {
    this.studentForm.patchValue({
      schoolName: student.schoolID,
      studentName: student.studentName,
      gender: student.gender,
      class: student.classID,
      section: student.sectionID,
      rollNo: student.rollNumber,
      photoUrl: student.photoLink
    });
    this.studentForm.addControl('studentID', this.fb.control(student.studentID));
  }

  onZoneChange(): void {
    const zoneId = this.studentForm.get('zone')?.value;
    this.studentForm.patchValue({ cluster: '', schoolName: '' });
    this.clusters = [];
    this.schools = [];

    if (zoneId) {
      this.coreApiService.getClustersByZone(zoneId).subscribe(res => {
        this.clusters = res || [];
      });
    }
  }

  onClusterChange(): void {
    const clusterId = this.studentForm.get('cluster')?.value;
    this.studentForm.patchValue({ schoolName: '' });
    this.schools = [];

    if (clusterId) {
      this.coreApiService.getSchoolsByCluster(clusterId).subscribe(res => {
        this.schools = res || [];
      });
    }
  }

  onSubmit(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    const formValue = this.studentForm.value;

    const payload = {
      studentID: formValue.studentID || 0,
      studentName: formValue.studentName,
      gender: formValue.gender,
      rollNumber: formValue.rollNo,
      classID: formValue.class,
      sectionID: formValue.section,
      photoLink: formValue.photoUrl,
      schoolID: formValue.schoolName,
      clusterId: formValue.cluster
    };

    this.coreApiService.updateStudent(payload).subscribe({
      next: () => {
        this.openAlertDialog('Success', 'Student saved successfully!', 'success');
        if (this.isPopupMode) {
          this.dialogRef?.close('refresh');
        } else {
          this.router.navigate(['/home/core/students-list']);
        }
      },
      error: (err) => {
        console.error('Error saving student', err);
        this.openAlertDialog('Error', 'Failed to save student. Please try again.', 'error');
      }
    });
  }

  onCancel(): void {
    if (this.isPopupMode) {
      this.dialogRef?.close();
    } else {
      this.router.navigate(['/home/core/students-list']);
    }
  }

  openAlertDialog(title: string, message: string, type: string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: { title, message, type }
    });
  }
}
