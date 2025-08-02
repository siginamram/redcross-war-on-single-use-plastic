import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../../../shared/components/alert-dialog/alert-dialog.component';
import { CoreApiService } from '../../services/core-api.service';

@Component({
  selector: 'app-schools-bulk-upload',
  standalone: false,
  templateUrl: './schools-bulk-upload.component.html',
  styleUrls: ['./schools-bulk-upload.component.scss']
})
export class SchoolsBulkUploadComponent {
  selectedFileName: string = '';
  schoolList: any[] = [];
  hasValidationErrors: boolean = false;

  displayedColumns: string[] = [
    'schoolName', 'hodName', 'hodPhone', 'hodEmail',
    'contactPersonName', 'contactPersonPhone', 'contactPersonEmail',
    'contactPersonDesignation', 'schoolTypeId', 'schoolAddress',
    'latitude', 'longitude', 'clusterId', 'zoneID',
    'cityID', 'districtID', 'stateID'
  ];

  constructor(private coreApiService: CoreApiService, private dialog: MatDialog) {}

  triggerFileInput(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (!file) return;

    this.selectedFileName = file.name;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

        this.schoolList = jsonData.map((entry) => ({
          schoolName: entry.schoolName || '',
          hodName: entry.hodName || '',
          hodPhone: entry.hodPhone?.toString() || '',
          hodEmail: entry.hodEmail || '',
          contactPersonName: entry.contactPersonName || '',
          contactPersonPhone: entry.contactPersonPhone?.toString() || '',
          contactPersonEmail: entry.contactPersonEmail || '',
          contactPersonDesignation: entry.contactPersonDesignation || '',
          schoolTypeId: entry.schoolTypeId || '',
          schoolAddress: entry.schoolAddress || '',
          latitude: entry.latitude?.toString() || '',
          longitude: entry.longitude?.toString() || '',
          clusterId: entry.clusterId || '',
          zoneID: entry.zoneID || '',
          cityID: entry.cityID || '',
          districtID: entry.districtID || '',
          stateID: entry.stateID || ''
        }));

        this.validateData();
      } catch (err) {
        this.openAlertDialog('Error', 'Failed to read the file.', 'error');
      }
    };

    reader.readAsArrayBuffer(file);
  }

  validateData(): void {
    const requiredFields = this.displayedColumns;
    this.hasValidationErrors = this.schoolList.some((entry) =>
      requiredFields.some((field) => !entry[field] || entry[field].toString().trim() === '')
    );

    if (this.hasValidationErrors) {
      this.openAlertDialog(
        'Validation Error',
        'Some rows have missing required fields. Please correct the Excel and try again.',
        'warning'
      );
    }
  }

  uploadSchools(): void {
    if (this.hasValidationErrors) {
      this.openAlertDialog('Fix Errors', 'Resolve validation issues before submitting.', 'error');
      return;
    }

    this.coreApiService.BulkUploadSchool(this.schoolList).subscribe({
      next: () => {
        this.openAlertDialog('Success', 'Schools uploaded successfully!', 'success');
        this.resetForm();
      },
      error: (err) => {
        const msg = this.extractErrorMessage(err);
        this.openAlertDialog('Upload Failed', msg, 'error');
      }
    });
  }

  resetForm(): void {
    this.selectedFileName = '';
    this.schoolList = [];
    this.hasValidationErrors = false;
  }

  openAlertDialog(title: string, message: string, type: string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: { title, message, type }
    });
  }

  extractErrorMessage(error: any): string {
    if (error?.error?.errors) {
      return Object.values(error.error.errors).flat().join('\n');
    }
    return 'An unexpected error occurred.';
  }
}
