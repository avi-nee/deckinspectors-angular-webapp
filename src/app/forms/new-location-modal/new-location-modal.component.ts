import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HttpsRequestService} from "../../service/https-request.service";

@Component({
  selector: 'app-new-location-modal',
  templateUrl: './new-location-modal.component.html',
  styleUrls: ['./new-location-modal.component.scss']
})
export class NewLocationModalComponent {
  newLocationForm!: FormGroup;
  description:string;
  private _event: any;
  subProjects:any[] = [];
  isSubProject: boolean = false;
  data!:any;

  constructor(private formBuilder: FormBuilder,
              private cdr: ChangeDetectorRef,
              private dialogRef: MatDialogRef<NewLocationModalComponent>,
              private httpsRequestService: HttpsRequestService,
              @Inject(MAT_DIALOG_DATA) data : any) {
    this.description = data.description;
    this.subProjects = data.projectInfo;
    this.isSubProject = data.isSubProject;
    this.data = data;
    console.log(data);
  }

  ngOnInit() {
    this.newLocationForm = this.formBuilder.group({
      image: [''], // Add validators if needed
      name: [''], // Add validators if needed
      subProjectName: [null], // Add validators if needed
      description: [''],
      subProjectType: []
    });
  }

  handleFileInput(event: any) {
    this._event = event;
    // Handle file input change, e.g., read and process the selected file
  }
  close() {
    this.dialogRef.close();
  }

  save() {
    console.log(this.newLocationForm.value);
    this.createNewLocation();
    this.dialogRef.close(this.newLocationForm);
  }

  createNewLocation(){
    let url = 'https://deckinspectors-dev.azurewebsites.net/api/location/add';
    let data = {
      "name": this.newLocationForm.value.name,
      "description": this.newLocationForm.value.description,
      "parentid": this.data.isSubProject?this.newLocationForm.value.subProjectName.id:this.data.projectInfo.parentId,
      "parenttype": this.data.isSubProject?this.newLocationForm.value.subProjectName.type:this.data.projectInfo.parenttype,
      "isInvasive": true,
      "createdBy": "deck",
      "url": this.newLocationForm.value.image,
      "type": this.data.isSubProject?this.newLocationForm.value.subProjectType:"projectlocation"
    }
    console.log(data);
    this.httpsRequestService.postHttpData(url, data).subscribe(
      (response:any) => {
        console.log(response);
      },
      error => {
        console.log(error)
      }
    );
  }
}
