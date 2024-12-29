import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-employee-tab',
  templateUrl: './employee-tab.component.html',
  styleUrls: ['./employee-tab.component.scss'],
})
export class EmployeeTabComponent implements OnInit {
  salaries = [
    {
      month: 'November 2024',
      gross: 50000,
      deductions: 5000,
      net: 45000,
      status: 'Paid',
    },
    {
      month: 'October 2024',
      gross: 50000,
      deductions: 4000,
      net: 46000,
      status: 'Paid',
    },
    {
      month: 'September 2024',
      gross: 50000,
      deductions: 6000,
      net: 44000,
      status: 'Unpaid',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
