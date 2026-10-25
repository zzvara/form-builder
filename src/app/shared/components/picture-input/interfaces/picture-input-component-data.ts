import { InputData } from '@interfaces/input-data';

export interface PictureInputComponentData extends InputData<string | null> {
  fileName?: string;
  file?: File | null;
  uploadedFile?: string | null;
}
