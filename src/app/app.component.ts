import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import data from '../assets/employees.json';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms'
import { Employee, JobTitle } from '../assets/model/employee.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  employees: Employee[] = [];
  employeesRef: Employee[] = [];
  jobTitles: JobTitle[] = [];
  title = 'empApp';
  empForm: any;
  isUserBeingAdded = false;
  ngOnInit() {
    this.employees = data.Employees;
    this.employeesRef = data.Employees;
    this.jobTitles = data.jobTitles;
    this.createform();  
  }

  createform() {
    this.empForm = new FormGroup({
      form: new FormGroup({
        empId: new FormControl(),
        name: new FormControl('', Validators.required),
        jobTitle: new FormControl('', Validators.required),
        age: new FormControl('', Validators.required),
        startDate: new FormControl('', Validators.required),
        endDate: new FormControl(),
        isCurrentlyWorking: new FormControl()
      }),
      filter: new FormGroup({
        name: new FormControl(''),
        jobTitle: new FormControl(''),
        age: new FormControl(''),
        startDate: new FormControl(''),
        endDate: new FormControl(''),
      })
    })
  }

  filterEmp() {
    let filters = this.empForm.get('filter').value;
    let filteredEmp: Employee[] = [];
    this.employeesRef.forEach((empObj: Employee) => {
      let isName = true;
      let isJobTitle = true;
      let isAge = true;
      let isStartDate = true;
      let isEndDate = true;
      if(filters['name']) {
        let filter = filters['name'].toLowerCase();
        let value = empObj['name'].toLowerCase();
        if(!value.includes(filter)){
          isName = false;
        }
      }
      if(filters['age']) {
        let filter = filters['age'];
        let value = empObj['age'];
        if(value != filter){
          isAge = false;
        }
      }

      if(filters['jobTitle'] && filters['jobTitle'].toLowerCase() != 'select') {
        let filter = filters['jobTitle'].toLowerCase();
        let value = empObj['jobTitle'].toLowerCase();
        if(value != filter){
          isJobTitle = false;
        }
      }

      if(filters['startDate']) {
        let filter = filters['startDate'];
        let value = empObj['startDate'];
        if(filter && !(value.includes(filter))){
          isStartDate = false;
        }
      }

      if(filters['endDate']) {
        let filter = filters['endDate'];
        let value = empObj['endDate'];
        if(filter && !(value.includes(filter))){
          isEndDate = false;
        }
      }

      if(isName && isAge && isJobTitle && isStartDate && isEndDate) {
        filteredEmp.push(empObj);
      }
      
    });

    this.employees = filteredEmp;
  }

  clearFilter() {
    this.employees = data.Employees;
    this.empForm.get('filter').reset()
  }
  

  saveEmp(emp: Employee) {
    if(this.empForm.get('form')['valid']) {
      const formdata = this.empForm.get('form').value;
      formdata.empId = this.randomEmpIdGenerator();
      this.employees.shift();
      this.employees.unshift(formdata);
      this.empForm.get('form').reset();
    } else {
      alert("Please fill the form");
    }
    
  }

  addEmpAlert() {
    alert("Save or Cancel the row");
  }

  cancel() {
    this.employees.shift();
  }


  addEmp() {
    this.employees.map((empObj: Employee) => {
      empObj.edit = false;
    });
    this.empForm.get('form').reset();
    this.isUserBeingAdded = true;

    const newUser = {
      "empId": "",
      "jobTitle": "",
      "name": "",
      "age":  0,
      "startDate": '',
      "endDate": '',
      "isCurrentlyWorking": false,
      "edit": true
    }; 
    this.employees.unshift(newUser);
  }

  removeEmp(empdeleteUser: Employee) {
    if(this.employees.length>0)
    this.employees = this.employees.filter((emp: Employee) => emp.empId != empdeleteUser.empId)
    this.empForm.get('form').reset();
  }

  viewEmpDetails(empUser: Employee) {
    if(this.isUserBeingAdded) {
      alert("Please fill or Cancel the add Employee form")
      return;
    }
    
    this.employees.map((empObj: Employee) => {
      empObj.edit = false;
    });
    empUser.edit = true;
    this.empForm.get('form').patchValue(empUser);
  }

  reset(emp:Employee){
    this.empForm.get('form').reset();
    if(this.isUserBeingAdded) {
      this.employees.shift();
      this.isUserBeingAdded = false;
      return;
    }
    this.employees.forEach((empObj:Employee) => {
      if(emp.empId == empObj.empId) {
        empObj = emp;
        empObj.edit = false;
      }
    })
  }

  randomEmpIdGenerator() {
    return Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
  }


}
