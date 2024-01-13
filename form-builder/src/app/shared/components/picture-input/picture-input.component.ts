import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-picture-input',
  templateUrl: './picture-input.component.html',
  styleUrls: ['./picture-input.component.css']
})
export class PictureInputComponent {
  @Input() fileName!: string;
  file: File | null = null;
  uploadedFile: string | null = localStorage.getItem(this.fileName);

  onFileChange(event: any): void {
    this.file = event.target.files[0];
  }

  submit(): void {
    if (!this.file) {
      console.error('No file selected.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      this.uploadedFile = reader.result as string;
      localStorage.setItem(this.fileName, this.uploadedFile);
    };
    reader.readAsDataURL(this.file);
  }
}
