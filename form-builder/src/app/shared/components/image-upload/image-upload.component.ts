import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent {
  form: FormGroup;
  file: File | null = null;
  uploadedFile: string | null = null;

  constructor() {
    this.form = new FormGroup({
      file: new FormControl(''),
    });
    this.uploadedFile = localStorage.getItem('uploadedFile');
  }

  onFileChange(e: any) {
    this.file = e.target.files[0];
  }

  submit() {
    if (!this.file) {
      return;
    }
  
    const reader = new FileReader();
    reader.onload = (e) => {
      this.uploadedFile = reader.result as string;
      const dynamicName = 'uploadedFile_' + Date.now();
      this.uploadedFile = localStorage.getItem(dynamicName);
      };
    reader.readAsDataURL(this.file);
  }
}