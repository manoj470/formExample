import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
// import { NgxSpinnerService } from 'ngx-spinner/public_api';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  dropdownList:any = Array<{item_id: number, item_text: string}>;
  dropdownSettings:IDropdownSettings={};
  

  constructor(private spinner: NgxSpinnerService) { }

  // ngOnInit(): void {
  // }

  // dropdownList = Array<{item_id: number, item_text: string}>;
  // selectedItems = [];
  // item_id:number | undefined;
  // dropdownSettings:IDropdownSettings = {};
  
  ngOnInit() {
    this.spinner.show();
    this.dropdownList = [
      { item_id: 1, item_text: 'Mumbai' },
      { item_id: 2, item_text: 'Bangaluru' },
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
      { item_id: 5, item_text: 'New Delhi' }
    ];
    this.dropdownSettings = {
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true
    };
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  onSubmit(){
    
  }
}
