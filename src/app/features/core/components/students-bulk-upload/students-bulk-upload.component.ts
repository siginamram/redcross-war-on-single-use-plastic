import { Component } from '@angular/core';

@Component({
  selector: 'app-students-bulk-upload',
  standalone: false,
  templateUrl: './students-bulk-upload.component.html',
  styleUrls: ['./students-bulk-upload.component.scss']
})
export class StudentsBulkUploadComponent {
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
