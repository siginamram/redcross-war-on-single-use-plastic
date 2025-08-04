import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { CoreApiService } from '../../services/core-api.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../../../shared/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-students-bulk-upload',
  standalone: false,
  templateUrl: './students-bulk-upload.component.html',
  styleUrls: ['./students-bulk-upload.component.scss']
})
export class StudentsBulkUploadComponent {
 selectedFileName: string = '';
   studentList: any[] = [];
   schoolID: number = Number(localStorage.getItem('schoolID'));
   hasValidationErrors: boolean = false;
 
   displayedColumns: string[] = [
     'studentName',
     'gender',
     'rollNumber',
     'photoLink',
     'classID',
     'sectionID'
   ];
 
   constructor(
     private api: CoreApiService,
     private dialog: MatDialog
   ) {}
 
   triggerFileInput(fileInput: HTMLInputElement): void {
     fileInput.click();
   }
 
   onFileSelected(event: any): void {
     const file: File = event.target.files[0];
     if (!file) return;
 
     this.selectedFileName = file.name;
 
     const reader: FileReader = new FileReader();
     reader.onload = (e: any) => {
       try {
         const data = new Uint8Array(e.target.result);
         const workbook = XLSX.read(data, { type: 'array' });
         const worksheet = workbook.Sheets[workbook.SheetNames[0]];
         let jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);
 
         this.studentList = jsonData.map((s: any) => ({
           studentName: s.studentName || '',
           gender: Number(s.gender) || 0,
           rollNumber: s.rollNumber?.toString() || '',
           photoLink: s.photoLink || '',
           classID: Number(s.classID) || 0,
           sectionID: Number(s.sectionID) || 0,
           schoolID: this.schoolID
         }));
 
         this.validateStudentList();
       } catch (err) {
         console.error('File parsing error:', err);
         this.openAlertDialog(
           'Invalid File',
           'Unable to read Excel file. Please check the format.',
           'error'
         );
       }
     };
 
     reader.readAsArrayBuffer(file);
   }
 
   validateStudentList(): void {
     const requiredFields = ['studentName', 'gender', 'rollNumber', 'classID', 'sectionID'];
     this.hasValidationErrors = this.studentList.some((student, index) => {
       return requiredFields.some(field => {
         const val = student[field];
         return val === undefined || val === null || val.toString().trim() === '';
       });
     });
 
     if (this.hasValidationErrors) {
       this.openAlertDialog(
         'Validation Failed',
         'Some rows have missing required fields. Please fix and re-upload.',
         'error'
       );
     }
   }
 
   uploadStudents(): void {
     if (!this.studentList.length) {
       this.openAlertDialog('No Data', 'Please upload a valid Excel file first.', 'error');
       return;
     }
 
     if (this.hasValidationErrors) {
       this.openAlertDialog('Validation Error', 'Fix missing fields before submitting.', 'error');
       return;
     }
 
     this.api.BulkUploadStudent(this.studentList).subscribe({
       next: () => {
         this.openAlertDialog('Upload Success', 'Students uploaded successfully!', 'success');
         this.resetForm();
       },
       error: (err) => {
         console.error('Upload error:', err);
         const msg = this.extractErrorMessage(err);
         this.openAlertDialog('Upload Failed', msg, 'error');
       }
     });
   }
 
   extractErrorMessage(error: any): string {
     if (error?.error?.errors) {
       const messages = Object.values(error.error.errors)
         .flat()
         .map((msg: any) => `• ${msg}`);
       return messages.join('\n');
     }
     return 'An unexpected error occurred. Please try again.';
   }
 
   openAlertDialog(title: string, message: string, type: string): void {
     this.dialog.open(AlertDialogComponent, {
       width: '400px',
       data: { title, message, type }
     });
   }
 
   resetForm(): void {
     this.selectedFileName = '';
     this.studentList = [];
     this.hasValidationErrors = false;
   }
 
     downloadExcelTemplate(): void {
     const headers = [
       'studentName', 'gender', 'rollNumber', 'classID', 'sectionID'
     ];
   
     const worksheet = XLSX.utils.aoa_to_sheet([headers]);
     const workbook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
     XLSX.writeFile(workbook, 'Student_Bulk_Upload_Template.xlsx');
   }
   
 }