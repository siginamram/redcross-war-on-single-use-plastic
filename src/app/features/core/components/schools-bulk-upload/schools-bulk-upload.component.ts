import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-schools-bulk-upload',
  standalone: false,
  templateUrl: './schools-bulk-upload.component.html',
  styleUrls: ['./schools-bulk-upload.component.scss']
})
export class SchoolsBulkUploadComponent {
  selectedFileName: string = '';

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      // TODO: handle the file upload logic here
      console.log('Selected file:', file);
    }
  }

  triggerFileInput(fileInput: HTMLInputElement): void {
    fileInput.click();
  }
}
