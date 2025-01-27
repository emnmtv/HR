import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicalService {

  private apiUrl = 'http://localhost/integapi/main/routes.php';  // Adjust this URL as needed

  constructor(private http: HttpClient) { }

  getMedicalDocuments(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?route=fetchAllMedicalDocuments`);
  }

  updateMedicalStatus(medicalId: number, status: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}?route=updateMedicalStatus`, { medical_id: medicalId, status });
  }
}
