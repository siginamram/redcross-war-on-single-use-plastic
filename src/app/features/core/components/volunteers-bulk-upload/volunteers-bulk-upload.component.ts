import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { CoreApiService } from '../../services/core-api.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../../../shared/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-volunteers-bulk-upload',
  standalone: false,
  templateUrl: './volunteers-bulk-upload.component.html',
  styleUrls: ['./volunteers-bulk-upload.component.scss']
})
export class VolunteersBulkUploadComponent {
   selectedFileName: string = '';
  volunteerList: any[] = [];
  schoolID: number = Number(localStorage.getItem('schoolID'));
  hasValidationErrors: boolean = false;

  displayedColumns: string[] = [
    'volunteerName',
    'mobileNo',
    'email',
    'address',
    'organization'
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

        this.volunteerList = jsonData.map((v: any) => ({
          volunteerName: v.volunteerName || '',
          mobileNo: v.mobileNo?.toString() || '',
          email: v.email || '',
          address: v.address || '',
          organization: v.organization || '',
          schoolID: this.schoolID
        }));

        this.validateVolunteerList();
      } catch (err) {
        console.error('File parse error:', err);
        this.openAlertDialog('Error', 'Failed to read Excel file. Please check format.', 'error');
      }
    };

    reader.readAsArrayBuffer(file);
  }

  validateVolunteerList(): void {
    const requiredFields = ['volunteerName', 'mobileNo', 'email', 'address', 'organization'];
    this.hasValidationErrors = this.volunteerList.some((volunteer) =>
      requiredFields.some((field) => {
        const val = volunteer[field];
        return val === undefined || val === null || val.toString().trim() === '';
      })
    );

    if (this.hasValidationErrors) {
      this.openAlertDialog(
        'Validation Error',
        'Some rows have missing required fields. Please fix them and re-upload.',
        'error'
      );
    }
  }

  uploadVolunteers(): void {
    if (!this.volunteerList.length) {
      this.openAlertDialog('No Data', 'Please upload a valid Excel file first.', 'error');
      return;
    }

    if (this.hasValidationErrors) {
      this.openAlertDialog('Validation Error', 'Fix missing fields before submitting.', 'error');
      return;
    }

    this.api.BulkUploadVolunteer(this.volunteerList).subscribe({
      next: () => {
        this.openAlertDialog('Success', 'Volunteers uploaded successfully!', 'success');
        this.resetForm();
      },
      error: (err) => {
        console.error('Upload error:', err);
        this.openAlertDialog('Failed', 'Something went wrong. Please try again.', 'error');
      }
    });
  }

  openAlertDialog(title: string, message: string, type: string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: { title, message, type }
    });
  }

  resetForm(): void {
    this.selectedFileName = '';
    this.volunteerList = [];
    this.hasValidationErrors = false;
  }

      downloadExcelTemplate(): void {
      const headers = [
      'volunteerName', 'mobileNo', 'email', 'address', 'organization'
      ];
    
      const worksheet = XLSX.utils.aoa_to_sheet([headers]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
      XLSX.writeFile(workbook, 'Volunteers_Bulk_Upload_Template.xlsx');
    }
}