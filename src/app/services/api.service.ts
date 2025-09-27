import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  // User stats
  getUserStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/stats/`, { headers: this.getHeaders() });
  }

  // Applications
  getApplications(): Observable<any> {
    return this.http.get(`${this.apiUrl}/applications/`, { headers: this.getHeaders() });
  }

  createApplication(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/applications/`, data, { headers: this.getHeaders() });
  }

  // Payments
  getPayments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/payments/`, { headers: this.getHeaders() });
  }

  createPayment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/payments/`, data, { headers: this.getHeaders() });
  }

  // Profile
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/profile/`, { headers: this.getHeaders() });
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/auth/profile/update/`, data, { headers: this.getHeaders() });
  }

  // Beneficiaries
  getBeneficiaries(): Observable<any> {
    return this.http.get(`${this.apiUrl}/beneficiaries/`, { headers: this.getHeaders() });
  }

  getBeneficiaryList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/beneficiaries/list/`);
  }

  createBeneficiaryChangeRequest(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/beneficiaries/request/`, data, { headers: this.getHeaders() });
  }
}