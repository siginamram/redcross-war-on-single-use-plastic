import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CoreApiService } from '../../services/core-api.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../../../shared/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-plasticcollection',
  standalone: false,
  templateUrl: './plasticcollection.component.html',
  styleUrls: ['./plasticcollection.component.scss']
})
export class PlasticcollectionComponent implements OnInit {
  collectionForm: FormGroup;
  collectionDate: Date = new Date();
  classList: any[] = [];
  sectionList: any[] = [];
  students: any[] = [];
  selectedClass: number | null = null;
  selectedSection: number | null = null;
  schoolId: number = Number(localStorage.getItem('schoolID'));

  constructor(
    private fb: FormBuilder,
    private api: CoreApiService,
    private dialog: MatDialog
  ) {
    this.collectionForm = this.fb.group({
       imageUrl: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^(https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)?)$'
          ),
        ]
      ],
      students: this.fb.array([])
    });
  }

  ngOnInit() {
    this.loadClassSectionData();
  }

  get studentsArray(): FormArray {
    return this.collectionForm.get('students') as FormArray;
  }

  loadClassSectionData() {
    this.api.getClasses().subscribe(res => this.classList = res);
    this.api.getSections().subscribe(res => this.sectionList = res);
  }

  onFiltersChange() {
    if (this.selectedClass && this.selectedSection && this.collectionDate) {
      const filters = {
        schoolId: this.schoolId,
        classId: this.selectedClass,
        sectionId: this.selectedSection,
        date: this.formatLocalDate(this.collectionDate)
      };

      this.api.GetPlasticCollectionsByClass(filters).subscribe({
        next: (res: any[] = []) => {
          this.students = res.map(student => ({
            studentID: student.studentID,
            studentName: student.studentName || '',
            rollNumber: student.rollNumber || '',
            weightKG: typeof student.weightKG === 'number' ? student.weightKG : '',
            collectionID: student.collectionID || 0
          }));

          this.buildStudentFormArray();

          this.collectionForm.patchValue({
            imageUrl: res.length > 0 ? (res[0].imageUrl || '') : ''
          });
        },
        error: (err) => {
          console.error('Failed to fetch plastic collection data:', err);
          this.students = [];
          this.buildStudentFormArray();
          this.collectionForm.patchValue({ imageUrl: '' });
        }
      });
    } else {
      this.students = [];
      this.buildStudentFormArray();
      this.collectionForm.patchValue({ imageUrl: '' });
    }
  }

  buildStudentFormArray() {
    const arr = this.students.map((student) =>
      this.fb.group({
        studentID: student.studentID,
        studentName: [student.studentName],
        rollNumber: [student.rollNumber],
       weightKG: [
        student.weightKG || '',
        [
          Validators.required,
          Validators.pattern(/^\d+(\.\d{1,2})?$/) // allows decimal up to 2 places
        ]
      ],
        collectionID: student.collectionID || 0
      })
    );
    this.collectionForm.setControl('students', this.fb.array(arr));
  }


  onSubmit() {
    if (this.collectionForm.invalid) {
  this.collectionForm.markAllAsTouched();
  return;
}
  const imageUrl = this.collectionForm.get('imageUrl')?.value || '';

  const payload = this.studentsArray.value.map((student: any) => ({
    collectionID: student.collectionID || 0,
    studentID: student.studentID,
    schoolID: this.schoolId,
    weightKG: parseFloat(student.weightKG || 0),
    collectionDate: this.formatLocalDate(this.collectionDate),
    imageUrl: imageUrl,
    studentName: student.studentName || '',
    rollNumber: student.rollNumber || ''
  }));

  this.api.BulkUploadPlasticCollection(payload).subscribe({
    next: () => {
      this.openAlertDialog('Success', 'Saved successfully!', 'success');
      this.onFiltersChange() ; // Refresh the data after saving
    },
    error: (err) => {
      console.error('Error saving collection', err);
      this.openAlertDialog('Error', 'Failed to save. Please try again.', 'error');
    }
  });
}
formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 0-based
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}T00:00:00`; // or leave out time if your API accepts just the date
}

  openAlertDialog(title: string, message: string, type: string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: { title, message, type }
    });
  }
}
