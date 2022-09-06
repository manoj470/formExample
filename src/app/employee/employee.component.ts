import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModalDismissReasons, NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, NgForm, PatternValidator, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { __values } from 'tslib';

export class Employee{
  constructor(
    public id:number,
    public employeeName:string,
    public dateOfBirth:Date,
    public gender:string,
    public hobbies:string,
    public addressLine1:string,
    public addressLine2:string,
    public zipCode:number,
    public city:string,
    public country:string,
    public panNumber:string
  ){}
}

// export class Address{
//   constructor(
//     public addressLine1:string,
//     public addressLine2:string,
//     public zipCode:number,
//     public city:string,
//     public country:string
//   ){}
// }

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  hobbiesList:string[] = new Array("Reading","Cricket","Football","Listening music");
  dropdownSettings:IDropdownSettings={};

  public editForm!: FormGroup;
  emp:Employee[]|undefined;
  closedResult:string | undefined;
  selectedItems: string[] | undefined;
  public deleteId!: number;

  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal,
    private fb: FormBuilder
    // public datepipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.dropdownSettings = {
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // allowSearchFilter: true
    };
    this.getEmployees();
    this.editForm=this.fb.group({
      id:[''],
      employeeName:[''],
      dateOfBirth:[''],
      gender:[''],
      hobbies:[''],
      addressLine1:[''],
      addressLine2:[''],
      zipCode:[''],
      city:[''],
      country:[''],
      panNumber:['']
    });
  }

  newForm=new FormGroup({
    id:new FormControl(''),
    employeeName:new FormControl(''),
    dateOfBirth:new FormControl(''),
    gender:new FormControl(''),
    hobbies:new FormControl(''),
    addressLine1:new FormControl(''),
    addressLine2:new FormControl(''),
    zipCode:new FormControl(''),
    city:new FormControl(''),
    country:new FormControl(''),
    panNumber:new FormControl('',[Validators.required,Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')])
  });

  get panNumber(){
    return this.newForm.get("panNumber");
  }

  getEmployees(){
    this.httpClient.get<any>('http://localhost:8080/emp').subscribe(
      response =>{
        console.log("all data")
        console.log(response);
        this.emp=response;
      }
    )
  }

  open(content:any){
    this.modalService.open(content,{ariaLabelledBy:'modal-basic-title'}).result.then((result) =>{
      this.closedResult = `Closed with: ${result}`;
    },(reason) =>{
      this.closedResult= `Dismissed ${this.getDismissReason(reason)}`;
    });
    console.log(this.closedResult);
  }

  onSubmit() {
    console.log("Data is: >>>>>> "+this.newForm.value)
    const url = 'http://localhost:8080/emp/add_new';
    console.log("Going to save...")
    this.newForm.value.hobbies = this.newForm.value.hobbies?.toString();
    this.httpClient.post(url, this.newForm.value)
      .subscribe(() => {
        this.ngOnInit(); 
        this.modalService.dismissAll();
      });
     
  }

  // onSubmit(f: NgForm) {
  //   const url = 'http://localhost:8080/emp/add_new';
  //   console.log("Going to save...")
  //   // console.log("data: "+f.value.addressLine1);
  //   f.value.hobbies = f.value.hobbies.toString();
  //   console.log(f.value.dateOfBirth);
  //   // f.value.dateOfBirth = this.datepipe.transform(f.value.dateOfBirth,"yyyy-MM-dd",)
  //   console.log(f.value.dateOfBirth);
  //   this.httpClient.post(url, f.value)
  //     .subscribe(() => {
  //       this.ngOnInit(); 
  //     });
  //   this.modalService.dismissAll(); 
  // }

  private getDismissReason(reason:any): string{
    if(reason == ModalDismissReasons.ESC){
      return 'by pressing esc';
    }else if(reason == ModalDismissReasons.BACKDROP_CLICK){
      return 'by clicking on a backdrop';
    }else{
      return `with: ${reason}`;
    }

  }
  onItemSelect(item: any) {
    console.log("after on item select");
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log("after on all item select");
    console.log(items.toString());
  }

  openEdit(targetModal:any,employee:Employee){
    this.modalService.open(targetModal,{
      centered:true,
      backdrop:'static',
      size:'lg'
    });
    console.log("before edit "+employee.dateOfBirth)
    this.selectedItems =employee.hobbies.split(",");
    console.log(">>>>>>>>"+typeof(this.selectedItems));
    console.log(">>>>>>>>"+this.selectedItems);
    this.editForm.patchValue({
      id:employee.id,
      employeeName: employee.employeeName,
      dateOfBirth: employee.dateOfBirth,
      gender: employee.gender,
      hobbies: this.selectedItems,
      addressLine1: employee.addressLine1,
      addressLine2: employee.addressLine2,
      zipCode: employee.zipCode,
      city: employee.city,
      country: employee.country,
      panNumber: employee.panNumber
    });
  }

  onSave(){
    const editUrl='http://localhost:8080/emp/edit/'+this.editForm.value.id;
    console.log(this.editForm.value.id);
    this.editForm.value.hobbies = this.editForm.value.hobbies.toString();
    this.httpClient.put(editUrl,this.editForm.value)
    .subscribe(()=>{
      this.ngOnInit();
    });
    this.modalService.dismissAll();
  }

  openDelete(targetModal:any,employee:Employee){
    this.deleteId = employee.id;
    this.modalService.open(targetModal,{
      centered:true,
      backdrop:'static',
      size:'lg'
    });
  }

  OnDelete(){
    const deleteUrl='http://localhost:8080/emp/delete/'+this.deleteId;
    this.httpClient.delete(deleteUrl)
    .subscribe(()=>{
      this.ngOnInit();
      this.modalService.dismissAll();
    });
  }
}



