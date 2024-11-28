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
      { id: '1', name: 'Kathy Pacheco', position: 'Sales Representative',  type: 'Full Time', status: 'Active', location: 'New York', contact: 'patricia44@icloud.com' },
      { id: '2', name: 'Francis Seann', position: 'Accountant',  type: 'Part Time', status: 'Offboarding', location: 'Singapore', contact: '296-744-587' },
      { id: '3', name: 'Jake Rabago', position: 'Project Manager',  type: 'Full Time', status: 'Active', location: 'London', contact: '(289) 716-4240' },
      { id: '4', name: 'John Paul', position: 'Developer',  type: 'Part Time', status: 'Offboarding', location: 'Singapore', contact: '(888) 275-5489' },
      { id: '5', name: 'Patricia Cabal', position: 'SME Manager',  type: 'Full Time', status: 'Other', location: 'New York', contact: 'kv8l3@secureemail.com' },
      { id: '6', name: 'David De Luna', position: 'Developer',  type: 'Part Time', status: 'Active', location: 'London', contact: '(969) 784-0932' },
      { id: '7', name: 'Autumn Philips', position: 'Developer', type: 'Full Time', status: 'Offboarding', location: 'New York', contact: '(800) 119-1234' },
      { id: '8', name: 'Alice Walker', position: 'HR Manager',  type: 'Full Time', status: 'Active', location: 'Los Angeles', contact: 'alice.walker@example.com' },
      { id: '9', name: 'Ethan Hunt', position: 'Security Officer',  type: 'Part Time', status: 'Active', location: 'Paris', contact: 'ethan.hunt@securemail.com' },
      { id: '10', name: 'Sarah Grey', position: 'Marketing Director', type: 'Full Time', status: 'Active', location: 'Toronto', contact: 'sarah.grey@brand.com' },
      { id: '11', name: 'Brian Foster', position: 'Sales Manager', type: 'Full Time', status: 'Offboarding', location: 'Singapore', contact: 'brian.foster@outlook.com' },
      { id: '12', name: 'Grace Lee', position: 'Product Designer',  type: 'Full Time', status: 'Active', location: 'San Francisco', contact: 'grace.lee@designpro.com' },
      { id: '13', name: 'James Bond', position: 'Intelligence Officer',  type: 'Full Time', status: 'Active', location: 'London', contact: 'james.bond@mi6.co.uk' },
      { id: '14', name: 'Laura Stewart', position: 'Customer Support',  type: 'Part Time', status: 'Other', location: 'New York', contact: 'laura.stewart@helpdesk.com' },
      { id: '15', name: 'Robert Brown', position: 'Accountant',  type: 'Full Time', status: 'Active', location: 'Los Angeles', contact: 'robert.brown@accounting.com' },
      { id: '16', name: 'Natalie Green', position: 'Software Engineer',  type: 'Full Time', status: 'Active', location: 'London', contact: 'natalie.green@devteam.com' },
      { id: '17', name: 'Michael Knight', position: 'Marketing Specialist',  type: 'Full Time', status: 'Active', location: 'San Francisco', contact: 'michael.knight@marketing.com' },
      { id: '18', name: 'Sophia Turner', position: 'Business Analyst',  type: 'Part Time', status: 'Active', location: 'Toronto', contact: 'sophia.turner@analytics.com' },
      { id: '19', name: 'David Carter', position: 'Lead Developer', type: 'Full Time', status: 'Offboarding', location: 'New York', contact: 'david.carter@devteam.com' },
      { id: '20', name: 'Olivia Smith', position: 'Project Manager',  type: 'Full Time', status: 'Other', location: 'Los Angeles', contact: 'olivia.smith@company.com' },
      { id: '21', name: 'William Harris', position: 'Financial Analyst',  type: 'Part Time', status: 'Active', location: 'Chicago', contact: 'william.harris@finance.com' },
      { id: '22', name: 'Megan Roberts', position: 'HR Coordinator', type: 'Full Time', status: 'Active', location: 'Dallas', contact: 'megan.roberts@hrteam.com' },
      { id: '23', name: 'Isaac Adams', position: 'Network Engineer',  type: 'Full Time', status: 'Active', location: 'Austin', contact: 'isaac.adams@networking.com' },
      { id: '24', name: 'Ella Mitchell', position: 'Customer Success',   type: 'Part Time', status: 'Offboarding', location: 'Boston', contact: 'ella.mitchell@customersupport.com' },
      { id: '25', name: 'Alexander Harris', position: 'Developer',   type: 'Full Time', status: 'Active', location: 'London', contact: 'alexander.harris@devteam.com' },
      { id: '26', name: 'Charlotte Williams', position: 'Designer',   type: 'Full Time', status: 'Active', location: 'Chicago', contact: 'charlotte.williams@designpro.com' },
      { id: '27', name: 'George Taylor', position: 'Sales Director',   type: 'Part Time', status: 'Other', location: 'Singapore', contact: 'george.taylor@company.com' },
      { id: '28', name: 'Amelia King', position: 'Developer',   type: 'Full Time', status: 'Active', location: 'New York', contact: 'amelia.king@devteam.com' },
      { id: '29', name: 'Ethan Grey', position: 'Business Development Manager',  type: 'Part Time', status: 'Active', location: 'Los Angeles', contact: 'ethan.grey@bizdev.com' },
      { id: '30', name: 'Avery Scott', position: 'HR Specialist',  type: 'Full Time', status: 'Active', location: 'San Francisco', contact: 'avery.scott@hrteam.com' },
      { id: '31', name: 'Lucas Turner', position: 'Database Administrator',   type: 'Part Time', status: 'Active', location: 'Toronto', contact: 'lucas.turner@database.com' },
      { id: '32', name: 'Sophie Clark', position: 'Marketing Manager',   type: 'Full Time', status: 'Offboarding', location: 'London', contact: 'sophie.clark@marketing.com' },
      { id: '33', name: 'Nathan Moore', position: 'SEO Specialist',  type: 'Full Time', status: 'Active', location: 'New York', contact: 'nathan.moore@seo.com' },
      { id: '34', name: 'Zoe Harris', position: 'Sales Executive',  type: 'Full Time', status: 'Active', location: 'Chicago', contact: 'zoe.harris@company.com' },
      { id: '35', name: 'Daniel Parker', position: 'Quality Analyst',   type: 'Full Time', status: 'Active', location: 'Boston', contact: 'daniel.parker@qa.com' },
      { id: '36', name: 'Victoria Moore', position: 'Operations Manager', type: 'Part Time', status: 'Other', location: 'Los Angeles', contact: 'victoria.moore@operations.com' },
      { id: '37', name: 'Jackson White', position: 'Graphic Designer', type: 'Full Time', status: 'Active', location: 'Dallas', contact: 'jackson.white@graphicdesign.com' },
      { id: '38', name: 'Mason Mitchell', position: 'Content Writer', type: 'Full Time', status: 'Active', location: 'Austin', contact: 'mason.mitchell@writing.com' },
      { id: '39', name: 'Harper Lewis', position: 'Marketing Assistant',   type: 'Full Time', status: 'Active', location: 'San Francisco', contact: 'harper.lewis@company.com' },
      { id: '40', name: 'Benjamin Young', position: 'Web Developer',  type: 'Full Time', status: 'Active', location: 'London', contact: 'benjamin.young@webdev.com' },
      { id: '41', name: 'Lily King', position: 'Content Manager',  type: 'Full Time', status: 'Active', location: 'New York', contact: 'lily.king@content.com' },
      { id: '42', name: 'Henry Brown', position: 'Lead Designer',   type: 'Part Time', status: 'Offboarding', location: 'Los Angeles', contact: 'henry.brown@designpro.com' },
      { id: '43', name: 'Chloe Lee', position: 'Software Architect',  type: 'Full Time', status: 'Active', location: 'San Francisco', contact: 'chloe.lee@softwarearch.com' },
      { id: '44', name: 'Evan Wilson', position: 'Operations Specialist',  type: 'Full Time', status: 'Other', location: 'Chicago', contact: 'evan.wilson@operations.com' },
      { id: '45', name: 'Mila Taylor', position: 'Legal Advisor',  type: 'Full Time', status: 'Active', location: 'Toronto', contact: 'mila.taylor@legal.com' },
      { id: '46', name: 'Owen Mitchell', position: 'Project Coordinator',  type: 'Full Time', status: 'Active', location: 'London', contact: 'owen.mitchell@projects.com' },
      { id: '47', name: 'Jack Thompson', position: 'Content Strategist',  type: 'Full Time', status: 'Active', location: 'New York', contact: 'jack.thompson@content.com' },
      { id: '48', name: 'Eleanor Scott', position: 'Database Analyst',   type: 'Full Time', status: 'Active', location: 'San Francisco', contact: 'eleanor.scott@database.com' },
      { id: '49', name: 'Christopher King', position: 'VP of Sales',  type: 'Full Time', status: 'Active', location: 'Chicago', contact: 'christopher.king@company.com' },
      { id: '50', name: 'Emily Harris', position: 'Digital Marketing Specialist', type: 'Full Time', status: 'Offboarding', location: 'Boston', contact: 'emily.harris@marketing.com' }
    ];

    exportToExcel(): void {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.employees);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Employees');
      XLSX.writeFile(wb, 'Employees.xlsx');
    }

    // Filter function to search employees
    filteredEmployees() {
      const lowerFilter = this.filterValue.toLowerCase(); // Convert search term to lowercase
      const filtered = this.employees.filter(employee =>
        employee.id.toLowerCase().includes(lowerFilter) ||
        employee.name.toLowerCase().includes(lowerFilter) ||
        employee.position.toLowerCase().includes(lowerFilter) ||
        employee.type.toLowerCase().includes(lowerFilter) ||
        employee.status.toLowerCase().includes(lowerFilter) ||
        employee.location.toLowerCase().includes(lowerFilter) ||
        employee.contact.toLowerCase().includes(lowerFilter)
      );

      return this.sortEmployees(filtered);
    }

    // Sort function
    sortEmployees(employees: any[]) {
      if (!this.sortField) return employees;
    
      return employees.sort((a, b) => {
        let fieldA = a[this.sortField];
        let fieldB = b[this.sortField];
    
        // Handle the case where sorting is done by the "id" field
        if (this.sortField === 'id') {
          fieldA = +fieldA; // Convert to number
          fieldB = +fieldB; // Convert to number
        } else {
          fieldA = fieldA.toLowerCase();
          fieldB = fieldB.toLowerCase();
        }
    
        if (fieldA < fieldB) return this.sortDirection === 'asc' ? -1 : 1;
        if (fieldA > fieldB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Toggle sorting
    sortBy(field: string) {
      if (this.sortField === field) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortField = field;
        this.sortDirection = 'asc';
      }
    }
  }
