import { Component, EventEmitter, Output } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'drone-path-modal',
  templateUrl: './drone-path-modal.component.html',
  styleUrls: ['./drone-path-modal.component.css'],
})

export class DronePathModalComponent {

  @Output()
  modalClosed = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder
  ) { }

  droneForm: FormGroup = this.fb.group({
    droneName: ['', Validators.required],
    timeData: this.fb.array([], Validators.required)
  });

  droneNameControl: FormControl = <FormControl>this.droneForm.get('droneName');
  timeDataControl: FormArray = <FormArray>this.droneForm.get('timeData');

  addTimeLocationData() {
    this.timeDataControl.push(this.createTimeLocationForm());
  }

  createTimeLocationForm() {
    const formGrp = this.fb.group({
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      time: ['', Validators.required]
    })
    return formGrp;
  }

  removeTimeLocationData(idx: number) {
    this.timeDataControl.removeAt(idx);
  }

  onCancel() {
    this.modalClosed.emit({});
  }

  onSubmit() {
    console.log('drone data', this.droneForm);
    this.modalClosed.emit(this.droneForm);
  }

}
