import { config, of } from 'rxjs';
import { ModalServiceService } from '@services/modal/modal-service.service';
import { PictureInputEditComponent } from './picture-input-edit/picture-input-edit.component';
import { getInputGroups } from '@pages/edit/config/edit-data-config';
import { TranslateService } from '@ngx-translate/core';
import { appConfig } from '@app/app.config';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { PictureInputComponent } from '@components/picture-input/picture-input.component';
import { mockStorage } from '@app/testing/fixtures';
import type { NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';

describe('PictureInputComponent', () => {
  let component: PictureInputComponent;
  let fixture: ComponentFixture<PictureInputComponent>;

  beforeEach(() => {
    mockStorage();
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

  it('opens its settings editor and publishes saved changes', () => {
    const open = spyOn(TestBed.inject(ModalServiceService), 'openModal').and.returnValue(of(true));
    const edited = spyOn(component.edited, 'emit');
    component.edit();
    expect(open).toHaveBeenCalledWith(
      jasmine.objectContaining({
        modalContent: PictureInputEditComponent,
        modalData: component.data,
      }),
    );
    expect(edited).toHaveBeenCalledOnceWith(component.data);
  });

  it('updates upload status and displays success or failure messages', () => {
    const info = spyOn(console, 'info');
    const error = spyOn(console, 'error');
    spyOn(console, 'log');
    component.onChange(new Event('change'));
    expect(component.fileList()).toEqual([]);
    for (const status of ['uploading', 'done', 'error'] as const) {
      const file = { uid: 'file', name: 'photo.png', status };
      component.onChange({ file, fileList: [file] });
      expect(component.fileList()).toEqual([file]);
    }
    expect(info).toHaveBeenCalledWith('photo.png file uploaded successfully');
    expect(error).toHaveBeenCalledWith('photo.png file upload failed.');
  });

  it('reads image content and notifies the upload control after persistence', async () => {
    const file = new File(['image'], 'photo.png', { type: 'image/png' }) as unknown as NzUploadFile;
    const result = await new Promise<{ value: string; event: ProgressEvent }>((resolve, reject) => {
      component.uploadToLocalStorage({
        file,
        postFile: file,
        onSuccess: (value, returnedFile, event) => {
          expect(returnedFile).toBe(file);
          resolve({ value, event });
        },
        onError: reject,
      });
    });
    expect(result.value).toBe('data:image/png;base64,aW1hZ2U=');
    expect(localStorage.getItem('photo.png')).toBe(result.value);
    expect(result.event.type).toBe('load');
  });

  for (const failure of ['read', 'storage'] as const) {
    it(`reports an image ${failure} failure once without an unhandled observable error`, async () => {
      const reader = new FileReader();
      spyOn(window, 'FileReader').and.returnValue(reader);
      spyOn(reader, 'readAsDataURL');
      const error = new Error('Storage full');
      if (failure === 'storage') (localStorage.setItem as jasmine.Spy).and.throwError(error);
      const file: NzUploadFile = { uid: 'file', name: 'photo.png' };
      const onError = jasmine.createSpy('onError');
      const onSuccess = jasmine.createSpy('onSuccess');
      const previousHandler = config.onUnhandledError;
      const unhandled = jasmine.createSpy('unhandled');
      config.onUnhandledError = unhandled;
      try {
        const args: NzUploadXHRArgs = { file, postFile: file, onError, onSuccess };
        const subscription = component.uploadToLocalStorage(args);
        reader.dispatchEvent(new ProgressEvent(failure === 'read' ? 'error' : 'load'));
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onSuccess).not.toHaveBeenCalled();
        expect(subscription.closed).toBeTrue();
        expect(unhandled).not.toHaveBeenCalled();
      } finally {
        config.onUnhandledError = previousHandler;
      }
    });
  }

  it('downloads a response fallback and reports missing image content', () => {
    const click = spyOn(HTMLAnchorElement.prototype, 'click');
    component.onDownload({
      uid: 'file',
      name: 'photo.png',
      response: 'data:image/png;base64,AQ==',
    });
    expect((click.calls.mostRecent().object as HTMLAnchorElement).href).toBe(
      'data:image/png;base64,AQ==',
    );
    const error = spyOn(console, 'error');
    component.onDownload({ uid: 'missing', name: 'missing.png' });
    expect(click).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalled();
  });

  it('downloads saved image data without leaving temporary links in the DOM', () => {
    localStorage.setItem('image.png', 'data:image/png;base64,AQ==');
    const click = spyOn(HTMLAnchorElement.prototype, 'click');
    component.onDownload({ uid: 'image', name: 'image.png' });
    const downloaded = click.calls.mostRecent().object as HTMLAnchorElement;
    expect(downloaded.href).toBe('data:image/png;base64,AQ==');
    expect(downloaded.download).toBe('image.png');
    expect(downloaded.isConnected).toBeFalse();
  });

  it('removes persisted image content when a file is deleted', () => {
    localStorage.setItem('image.png', 'image-data');
    expect(component.onRemove({ uid: 'image', name: 'image.png' })).toBeTrue();
    expect(localStorage.getItem('image.png')).toBeNull();
  });
});
