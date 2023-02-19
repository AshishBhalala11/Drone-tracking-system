import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'drone-path-modal',
  templateUrl: './drone-path-modal.component.html',
  styleUrls: ['./drone-path-modal.component.css'],
})
export class DronePathModalComponent {
  @Output()
  modalClosed = new EventEmitter<any>();

  @ViewChild('fileInput')
  fileInput: ElementRef;

  selectedFile: File;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {}

  droneForm: FormGroup = this.fb.group({
    droneName: ['', Validators.required],
    timeData: this.fb.array([], Validators.required),
  });

  droneNameControl: FormControl = <FormControl>this.droneForm.get('droneName');
  timeDataControl: FormArray = <FormArray>this.droneForm.get('timeData');

  addTimeLocationData() {
    this.timeDataControl.push(this.createTimeLocationForm());
  }

  createTimeLocationForm(time?: any, latitude?: any, longitude?: any) {
    const currentTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const formGrp = this.fb.group({
      time: [time || currentTime, Validators.required],
      latitude: [parseInt(latitude) || '', Validators.required],
      longitude: [parseInt(longitude) || '', Validators.required],
    });
    return formGrp;
  }

  removeTimeLocationData(idx: number) {
    this.timeDataControl.removeAt(idx);
  }

  downloadSampleFile() {
    const fileName = 'drone_time_series_data';
    const extension = '.csv';
    const data = 'Time (YYYY-MM-DD HH:MM:SS),Latitude,Longitude';

    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.download = `${fileName}${extension}`;
    anchor.href = url;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
    if (!this.selectedFile) {
      return;
    }
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(this.selectedFile);
    reader.onload = (e: any) => {
      const binarystr: string = e.target.result;
      const rowWiseArray = binarystr.split('\n');

      for (let i = 1; i < rowWiseArray.length; i++) {
        if (rowWiseArray[i] && !rowWiseArray[i].trim().startsWith(',')) {
          const timeSeriesDataArray = rowWiseArray[i].split(',');
          this.timeDataControl.push(
            this.createTimeLocationForm(
              timeSeriesDataArray[0],
              timeSeriesDataArray[1],
              timeSeriesDataArray[2]
            )
          );
        }
      }
    };
  }

  removeFile() {
    this.selectedFile = null;
  }

  onCancel() {
    this.modalClosed.emit({});
  }

  onSubmit() {
    this.modalClosed.emit(this.droneForm);
  }
}
