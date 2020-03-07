import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: ImageUploadComponent,
    multi: true
  }]
})
export class ImageUploadComponent implements ControlValueAccessor {
  isApp: boolean;

  constructor(private camera: Camera){
    this.isApp = (!document.URL.startsWith('http') || !document.URL.startsWith('http://localhost:8'));
    if(!this.isApp) {
      this.isDisabled = true;
    }
  }

  options: CameraOptions = {
    quality: 30,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }

  private onChange: Function = (captureImage: string) => {};
  private onTouch: Function = () => {};
  public isDisabled: boolean = false;

  base64Image: string;

  captureImage() {
    this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.writeValue('data:image/jpeg;base64,' + imageData);
    }, (err) => {
      console.log(err);
      // Handle error
    });
    this.onTouch();
  }

  writeValue(value: string): void {
    if(value != null){
      this.onChange(value);
      this.base64Image = value;
    }else{
      this.base64Image = 'https://voice.global/wp-content/plugins/wbb-publications/public/assets/img/placeholder.jpg';
      this.onChange('https://voice.global/wp-content/plugins/wbb-publications/public/assets/img/placeholder.jpg');
    }
  }

  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    console.log("touched");
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
