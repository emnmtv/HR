  import { Component } from '@angular/core';
  import * as XLSX from 'xlsx';
  import { SidenavComponent } from '../sidenav/sidenav.component';

  @Component({
    selector: 'app-employees',
    templateUrl: './employees.component.html',
    styleUrls: ['./employees.component.scss']
  })
  export class EmployeesComponent {
    filterValue: string = ''; // Property for search input
    sortField: string = ''; // The current field to sort by
    sortDirection: string = 'asc'; // 'asc' or 'desc'

    employees = [
      { id: '1', name: 'Kathy Pacheco', sex: 'Female' , address: 'Sales Representative', vaccinationstatus: 'Yes', company: 'New York', phone: 'patricia44@icloud.com', selected: false },
      { id: '2', name: 'Francis Seann', sex: 'Male' ,address: 'Accountant', vaccinationstatus: 'No', company: 'Singapore', phone: '296-744-587', selected: false },
      { id: '3', name: 'Jake Rabago', sex: 'Male' ,address: 'Project Manager', vaccinationstatus: 'Yes', company: 'London', phone: '(289) 716-4240', selected: false },
      { id: '4', name: 'John Paul', sex: 'Male',address: 'Developer', vaccinationstatus: 'No', company: 'Singapore', phone: '(888) 275-5489', selected: false },
      // Add other employees as per your list...
    ];

    filteredEmployees() {
      return this.employees.filter(employee => employee.name.toLowerCase().includes(this.filterValue.toLowerCase()));
    }

    sortBy(field: string) {
      this.sortField = field;
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    }

    exportToExcel() {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.employees);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Employees');
      XLSX.writeFile(wb, 'employees.xlsx');
    }

    selectAll(event: any) {
      const isChecked = event.target.checked;
      this.employees.forEach(employee => employee.selected = isChecked);
      // Update the filteredEmployees array as well
      this.filteredEmployees().forEach(employee => employee.selected = isChecked); 
    }

    deleteSelected() {
      this.employees = this.employees.filter(employee => !employee.selected);
    }
  }
