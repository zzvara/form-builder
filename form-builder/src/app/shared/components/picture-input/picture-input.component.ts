import {Component, inject} from '@angular/core';
import {NzUploadChangeParam, NzUploadFile} from 'ng-zorro-antd/upload';
import {Observable, of} from 'rxjs';
import {ModalServiceService} from "../../../services/modal/modal-service.service";
import {AbstractInput} from "../../abstract-classes/abstract-input";
import {PictureInputComponentData} from "./interfaces/picture-input-component-data";
import {PictureInputEditComponent} from "./picture-input-edit/picture-input-edit.component";

@Component({
  selector: 'app-picture-input',
  templateUrl: './picture-input.component.html',
  styleUrls: ['./picture-input.component.css'],
})
export class PictureInputComponent extends AbstractInput<PictureInputComponentData, string | null> {
  private readonly modalService: ModalServiceService<PictureInputEditComponent, PictureInputComponentData> = inject(ModalServiceService);

  onFileChange(event: any): void {
    this.data.file = event.target.files[0];
  }

  override onChange(info: NzUploadChangeParam): void {
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

  override edit(): void {
    this.modalService.openModal({
      modalTitle: 'Edit Text Field Component Settings',
      modalContent: PictureInputEditComponent,
      modalData: {
        questionValue:    this.data.questionValue,
        descriptionValue: this.data.descriptionValue,
        defaultValue:     this.data.defaultValue,
        placeholderValue: this.data.placeholderValue,
      }
    }).subscribe(result => this.defaultValueSetter(result));
  }
}
