import { getInputGroups } from '@pages/edit/config/edit-data-config';
import { TranslateService } from '@ngx-translate/core';
import { appConfig } from '@app/app.config';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { PictureInputComponent } from '@components/picture-input/picture-input.component';
import type { NzUploadFile } from 'ng-zorro-antd/upload';

describe('PictureInputComponent', () => {
  let component: PictureInputComponent;
  let fixture: ComponentFixture<PictureInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PictureInputComponent],
      providers: appConfig.providers,
    });
    fixture = TestBed.createComponent(PictureInputComponent);
    component = fixture.componentInstance;
    const formInput = getInputGroups(TestBed.inject(TranslateService)).find(
      (input) => input.type === 'PictureInputComponent',
    )!;
    fixture.componentRef.setInput('data', formInput.data);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  for (const wrapped of [false, true]) {
    it(`stores a ${wrapped ? 'wrapped' : 'native'} uploaded file`, async () => {
      const blob = new File(['image content'], 'lint-upload-test.png', { type: 'image/png' });
      const file: NzUploadFile = wrapped
        ? { uid: 'upload-test', name: blob.name, originFileObj: blob }
        : (Object.assign(blob, { uid: 'upload-test' }) as unknown as NzUploadFile);
      const save = spyOn(Storage.prototype, 'setItem');

      await new Promise<void>((resolve, reject) => {
        component.uploadToLocalStorage({
          file,
          postFile: blob,
          onSuccess: (result: string, uploaded: NzUploadFile, event: ProgressEvent<FileReader>) => {
            try {
              expect(result).toBe('data:image/png;base64,aW1hZ2UgY29udGVudA==');
              expect(uploaded).toBe(file);
              expect(event.type).toBe('load');
              expect(save).toHaveBeenCalledWith(blob.name, result);
              resolve();
            } catch (error) {
              reject(error);
            }
          },
          onError: reject,
        });
      });
    });
  }
});
