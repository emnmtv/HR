import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { SidenavComponent } from '../../sidenav/sidenav.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent {
  filterValue: string = ''; // Property for search input
  sortField: string = ''; // The current field to sort by
  sortDirection: string = 'asc'; // 'asc' or 'desc'
  showModal = false; // Variable to control modal visibility

  employees = [
    { id: '1', name: 'Knowell Lucky Versoza', sex: 'Female' , address: 'East Tapinac, Olongapo City', vaccinationstatus: 'Yes', company: 'Apple', phone: '295-829-032', selected: false },
    { id: '2', name: 'Jush  De Guzman', sex: 'Male' ,address: 'Gordon Heights, Olongapo City', vaccinationstatus: 'No', company: 'Apple', phone: '296-744-587', selected: false },
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

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  deleteSelected() {
    this.employees = this.employees.filter(employee => !employee.selected);
    this.showModal = false; // Close the modal after deletion
  }

  stopEventPropagation(event: Event) {
    event.stopPropagation();
  }
}