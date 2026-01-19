import { AbstractInput } from '@abstract-classes/abstract-input';
import { Component, OnInit } from '@angular/core';
import { PictureInputComponentData } from '@components/picture-input/interfaces/picture-input-component-data';
import { PictureInputEditComponent } from '@components/picture-input/picture-input-edit/picture-input-edit.component';
import { NzUploadChangeParam, NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-picture-input',
  templateUrl: './picture-input.component.html',
  styleUrls: [],
  standalone: false,
})
export class PictureInputComponent
  extends AbstractInput<string | null, PictureInputComponentData, PictureInputEditComponent>
  implements OnInit
{
  fileList: NzUploadFile[] = [];

  override onChange(event: Event | NzUploadChangeParam): void {
    if ((event as NzUploadChangeParam).file) {
      const info = event as NzUploadChangeParam;
      this.fileList = info.fileList;
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        console.info(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        console.error(`${info.file.name} file upload failed.`);
      }
    }
  }

  uploadToLocalStorage = (item: NzUploadXHRArgs): Subscription => {
    const obs = new Observable((observer) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        try {
          localStorage.setItem(item.file.name, base64);
          item.onSuccess!(base64, item.file, event);
          observer.complete();
        } catch (e) {
          observer.error(e);
          item.onError!(e as Error, item.file);
        }
      };

      reader.onerror = (err) => {
        item.onError!(err, item.file);
        observer.error(err);
      };
      reader.readAsDataURL(item.file as any);
    });

    return obs.subscribe();
  };
  onDownload = (file: NzUploadFile): void => {
    const storedBase64 = localStorage.getItem(file.name) || (file.response as string);

    if (storedBase64) {
      const link = document.createElement('a');
      link.href = storedBase64;
      link.download = file.name;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error('The file content cannot be found (LocalStorage or URL missing).');
    }
  };
  onRemove = (file: NzUploadFile): boolean => {
    localStorage.removeItem(file.name);
    return true;
  };

  override edit(): void {
    this.modalService
      .openModal({
        modalTitle: this.translate.instant('COMPONENTS.PICTURE_INPUT.MODEL_TITLE_PICTURE_INPUT'),
        modalContent: PictureInputEditComponent,
        modalData: this.data,
      })
      .subscribe(this.defaultOnEditSubscribeEvent);
  }
}
