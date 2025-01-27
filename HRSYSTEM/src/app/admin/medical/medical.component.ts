import { Component, OnInit } from '@angular/core';
import { MedicalService } from './medical.service';  // Your service
import { Router } from '@angular/router';

interface MedicalRequest {
  id: number;
  first_name: string;
  last_name: string;
  company: string;
  document_path: string;
  uploaded_at: string;
  status: string;
  document_name?: string;  // Added this as an optional field
}

@Component({
  selector: 'app-medical',
  templateUrl: './medical.component.html',
  styleUrls: ['./medical.component.scss']
})
export class MedicalComponent implements OnInit {
  filteredRequests: MedicalRequest[] = [];

  constructor(private medicalService: MedicalService, private router: Router) { }

  ngOnInit(): void {
    this.fetchMedicalRequests();
  }

  fetchMedicalRequests() {
    this.medicalService.getMedicalDocuments().subscribe(response => {
      if (response.status === 'success') {
        this.filteredRequests = response.data.map((document: any) => {
          // Extract document name from the document_path
          const lastSlashIndex = document.document_path.lastIndexOf('/');
          document.document_name = lastSlashIndex > -1 ? document.document_path.slice(lastSlashIndex + 1) : '';
          // Update the document_path with the full URL
          document.document_path = `http://localhost/integapi/main/${document.document_path}`;
          return document;
        });
      } else {
        console.error('Failed to fetch medical requests');
      }
    }, error => {
      console.error('Error fetching medical requests:', error);
    });
  }

  filterRequests(status: string) {
    this.filteredRequests = this.filteredRequests.filter(request => request.status === status || status === 'all');
  }

  updateMedicalStatus(id: number, status: string) {
    this.medicalService.updateMedicalStatus(id, status).subscribe(response => {
      if (response.status === 'success') {
        this.fetchMedicalRequests();  // Refresh the requests
      } else {
        console.error('Failed to update medical status');
      }
    });
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'Approved': return 'approved';
      case 'Rejected': return 'rejected';
      default: return '';
    }
  }
}
