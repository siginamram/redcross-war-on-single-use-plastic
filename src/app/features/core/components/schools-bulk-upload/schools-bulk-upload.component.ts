import { Component } from '@angular/core';
import { CoreApiService } from '../../services/core-api.service';
import * as XLSX from 'xlsx';
import { AlertDialogComponent } from '../../../../shared/components/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-schools-bulk-upload',
  standalone: false,
  templateUrl: './schools-bulk-upload.component.html',
  styleUrls: ['./schools-bulk-upload.component.scss']
})
export class SchoolsBulkUploadComponent {
  selectedFileName: string = '';

  constructor(
    private coreApiService: CoreApiService,
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
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        let jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

        // Convert phone numbers to string
        jsonData = jsonData.map((school: any) => ({
          ...school,
          hodPhone: school.hodPhone?.toString() ?? '',
          contactPersonPhone: school.contactPersonPhone?.toString() ?? ''
        }));

        // Validate required fields
        const requiredFields = [
          'schoolName', 'hodName', 'hodPhone', 'hodEmail',
          'contactPersonName', 'contactPersonPhone', 'contactPersonEmail',
          'contactPersonDesignation', 'schoolTypeId', 'schoolAddress',
          'latitude', 'longitude', 'clusterId', 'zoneID',
          'cityID', 'districtID', 'stateID'
        ];

        const invalidEntries = jsonData.filter((item, index) => {
          for (const field of requiredFields) {
            if (
              item[field] === undefined ||
              item[field] === null ||
              item[field].toString().trim() === ''
            ) {
              console.warn(`Missing field "${field}" in row ${index + 2}`);
              return true;
            }
          }
          return false;
        });

        if (invalidEntries.length > 0) {
          this.openAlertDialog(
            'Validation Error',
            'Some rows are missing required fields. Please fix the Excel and try again.',
            'warning'
          );
          return;
        }

        // Send to API
        this.uploadSchools(jsonData);

      } catch (err) {
        console.error('Error parsing file:', err);
        this.openAlertDialog(
          'File Error',
          'Failed to read the Excel file. Make sure it is valid and not corrupted.',
          'error'
        );
      }
    };

    reader.readAsArrayBuffer(file);
  }

  uploadSchools(data: any[]): void {
    this.coreApiService.BulkUploadSchool(data).subscribe({
      next: () => {
        this.openAlertDialog('Success', 'Schools uploaded successfully!', 'success');
        this.selectedFileName = '';
      },
      error: (err) => {
        console.error('Upload error:', err);
        const backendError = this.extractErrorMessage(err);
        this.openAlertDialog('Upload Failed', backendError, 'error');
      }
    });
  }

  openAlertDialog(title: string, message: string, type: string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: { title, message, type }
    });
  }

  extractErrorMessage(error: any): string {
    if (error?.error?.errors) {
      const messages = Object.values(error.error.errors)
        .flat()
        .map((msg: any) => `• ${msg}`);
      return messages.join('\n');
    }
    return 'An unexpected error occurred. Please check the console.';
  }
}
