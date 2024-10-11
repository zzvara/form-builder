import { Component, Input, TemplateRef } from '@angular/core';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-picture-input',
  templateUrl: './picture-input.component.html',
  styleUrls: ['./picture-input.component.css'],
})
export class PictureInputComponent {
  questionValue: string = 'Picture input';
  descriptionValue: string = 'The input can be used for...';
  answerValue: any = 'Picture ';
  inputPlaceholder: string = 'Picture input value';
  inputTemplate!: TemplateRef<any>;
  type: string = 'text';
  @Input() fileName!: string;
  file: File | null = null;
  uploadedFile: string | null = localStorage.getItem(this.fileName);

  onFileChange(event: any): void {
    this.file = event.target.files[0];
  }

  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      console.log(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      console.log(`${info.file.name} file upload failed.`);
    }
  }

  uploadToLocalStorage = (file: NzUploadFile): Observable<string> => {
    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem(file.name, reader.result as string);
    };
    reader.readAsDataURL(file as any);
    return of('');
  };
}
