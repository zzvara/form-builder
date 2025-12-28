import { AbstractInput } from '@abstract-classes/abstract-input';
import { Component } from '@angular/core';
import { PictureInputComponentData } from '@components/picture-input/interfaces/picture-input-component-data';
import { PictureInputEditComponent } from '@components/picture-input/picture-input-edit/picture-input-edit.component';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-picture-input',
  templateUrl: './picture-input.component.html',
  styleUrls: [],
  standalone: false,
})
export class PictureInputComponent extends AbstractInput<string | null, PictureInputComponentData, PictureInputEditComponent> {
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.data.file = input.files[0];
    }
  }

  override onChange(event: Event | NzUploadChangeParam): void {
    const info = event as NzUploadChangeParam;

    if (info.file.status !== 'uploading') {
      console.warn(info.file, info.fileList);
    }

    if (info.file.status === 'done') {
      console.info(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      console.error(`${info.file.name} file upload failed.`);
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

  override edit(): void {
    this.modalService
      .openModal({
        modalTitle: this.translate.instant('COMPONENTS.PICTURE_INPUT.MODEL_TITLE_PICTURE_INPUT'), // Use the translated title here
        modalContent: PictureInputEditComponent,
        modalData: this.data,
      })
      .subscribe(this.defaultOnEditSubscribeEvent);
  }
}
