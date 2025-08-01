import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CoreApiService } from '../../services/core-api.service';

@Component({
  selector: 'app-schools-bulk-upload',
  standalone: false,
  templateUrl: './schools-bulk-upload.component.html',
  styleUrls: ['./schools-bulk-upload.component.scss']
})
export class SchoolsBulkUploadComponent {
  selectedFileName: string = '';
  constructor(private fb: FormBuilder, private coreApiService: CoreApiService) {}

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
