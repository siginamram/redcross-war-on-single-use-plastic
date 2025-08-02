import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { CoreApiService } from '../../services/core-api.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../../../shared/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-school-register-student-bulk-upload',
  standalone: false,
  templateUrl: './school-register-student-bulk-upload.component.html',
  styleUrl: './school-register-student-bulk-upload.component.scss',
})
export class SchoolRegisterStudentBulkUploadComponent {
  selectedFileName: string = '';
  studentList: any[] = [];
  schoolID: number = Number(localStorage.getItem('schoolID'));

  constructor(private api: CoreApiService, private dialog: MatDialog) {}

  triggerFileInput(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        let jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

        // Attach schoolID and convert values
        this.studentList = jsonData.map((student: any) => ({
          studentName: student.studentName || '',
          gender: Number(student.gender) || 0,
          rollNumber: student.rollNumber?.toString() || '',
          photoLink: student.photoLink || '',
          classID: Number(student.classID) || 0,
          sectionID: Number(student.sectionID) || 0,
          schoolID: this.schoolID,
        }));

        console.log('Final Student Payload:', this.studentList);
      };

      reader.readAsArrayBuffer(file);
    }
  }

  uploadStudents(): void {
    if (!this.studentList.length) {
      this.openAlertDialog('Error', 'No students to upload. Please upload a valid Excel file.', 'error');
      return;
    }

    this.api.BulkUploadStudent(this.studentList).subscribe({
      next: () => {
        this.openAlertDialog('Success', 'Students uploaded successfully!', 'success');
        this.selectedFileName = '';
        this.studentList = [];
      },
      error: (err) => {
        console.error('Upload error:', err);
        this.openAlertDialog('Error', 'Failed to upload students.', 'error');
      }
    });
  }

  openAlertDialog(title: string, message: string, type: string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: { title, message, type },
    });
  }
}
