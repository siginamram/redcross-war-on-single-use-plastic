import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CoreApiService } from '../../services/core-api.service';
import { AlertDialogComponent } from '../../../../shared/components/alert-dialog/alert-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-school-register-student-form',
  standalone: false,
  templateUrl: './school-register-student-form.component.html',
  styleUrl: './school-register-student-form.component.scss'
})
export class SchoolRegisterStudentFormComponent implements OnInit {
  studentForm!: FormGroup;
  schoolId: number = Number(localStorage.getItem('schoolID'));
  sections: any[] = [];
  classes: any[] = [];

  isPopupMode = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private coreApiService: CoreApiService,
    private dialog: MatDialog,
    @Optional() public dialogRef?: MatDialogRef<SchoolRegisterStudentFormComponent>,
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
      this.patchForm(this.data);
    }
  }

  initializeForm(): void {
    this.studentForm = this.fb.group({
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
      studentName: student.studentName,
      gender: student.gender,
      class: student.classID,
      section: student.sectionID,
      rollNo: student.rollNumber,
      photoUrl: student.photoLink
    });
    this.studentForm.addControl('studentID', this.fb.control(student.studentID));
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
      schoolID: this.schoolId,
     
    };

    this.coreApiService.updateStudent(payload).subscribe({
      next: () => {
        this.openAlertDialog('Success', 'Student saved successfully!', 'success');
        if (this.isPopupMode) {
          this.dialogRef?.close('refresh');
        } else {
          this.router.navigate(['/home/core/school-students-list']);
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
      this.router.navigate(['/home/core/school-students-list']);
    }
  }

  openAlertDialog(title: string, message: string, type: string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: { title, message, type }
    });
  }
}

