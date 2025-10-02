import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  // User membership info
  getMembershipInfo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/applications/my-applications/`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // User stats (fallback to applications count)
  getUserStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/applications/my-applications/`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Applications
  getApplications(): Observable<any> {
    return this.http.get(`${this.apiUrl}/applications/my-applications/`, { headers: this.getHeaders() })
      .pipe(retry(1), catchError(this.handleError));
  }

  createApplication(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/applications/submit/`, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Payments
  getPayments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/payments/`, { headers: this.getHeaders() });
  }

  createPayment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/payments/`, data, { headers: this.getHeaders() });
  }

  // Profile (using applications as fallback)
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/applications/my-applications/`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateProfile(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/contact/`, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Beneficiaries
  getBeneficiaries(): Observable<any> {
    return this.http.get(`${this.apiUrl}/beneficiaries/`, { headers: this.getHeaders() })
      .pipe(retry(1), catchError(this.handleError));
  }

  getBeneficiaryList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/beneficiaries/list/`)
      .pipe(retry(1), catchError(this.handleError));
  }

  createBeneficiaryChangeRequest(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/beneficiaries/request/`, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Events
  getEvents(): Observable<any> {
    return this.http.get(`${this.apiUrl}/notifications/events/`, { headers: this.getHeaders() })
      .pipe(retry(1), catchError(this.handleError));
  }

  // Auth
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login/`, credentials)
      .pipe(catchError(this.handleError));
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register/`, userData)
      .pipe(catchError(this.handleError));
  }

  registerForEvent(eventId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/events/${eventId}/register/`, {}, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Admin endpoints (using users count as stats)
  getAdminStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/users/`, { headers: this.getHeaders() })
      .pipe(retry(1), catchError(this.handleError));
  }

  // Announcements
  getAnnouncements(): Observable<any> {
    return this.http.get(`${this.apiUrl}/notifications/announcements/`, { headers: this.getHeaders() })
      .pipe(retry(1), catchError(this.handleError));
  }

  // Clear all cached data
  clearCache(): void {
    if (typeof window !== 'undefined') {
      // Only clear non-auth data
      const keysToKeep = ['authToken', 'refreshToken', 'userName', 'userRole', 'userId', 'userEmail'];
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !keysToKeep.includes(key)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
    }
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/users/`, { headers: this.getHeaders() })
      .pipe(retry(1), catchError(this.handleError));
  }

  updateUserStatus(userId: number, isActive: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrl}/admin/users/${userId}/`, { is_active: isActive }, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/users/${userId}/`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Claims
  getClaims(): Observable<any> {
    return this.http.get(`${this.apiUrl}/claims/`, { headers: this.getHeaders() })
      .pipe(retry(1), catchError(this.handleError));
  }

  createClaim(formData: FormData): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
    return this.http.post(`${this.apiUrl}/claims/submit/`, formData, { headers })
      .pipe(catchError(this.handleError));
  }

  // User Dashboard Data
  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/stats/`, { headers: this.getHeaders() })
      .pipe(retry(1), catchError(this.handleError));
  }

  getUserActivities(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/activities/`, { headers: this.getHeaders() })
      .pipe(retry(1), catchError(this.handleError));
  }

  // Notifications
  getNotifications(): Observable<any> {
    return this.http.get(`${this.apiUrl}/notifications/`, { headers: this.getHeaders() })
      .pipe(retry(1), catchError(this.handleError));
  }

  markNotificationRead(notificationId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/notifications/${notificationId}/`, 
      { is_read: true }, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Admin Content Management
  createAnnouncement(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/announcements/create/`, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  createEvent(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/events/create/`, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  createMeeting(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/meetings/create/`, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Admin Stats
  getAdminDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/stats/`, { headers: this.getHeaders() })
      .pipe(retry(1), catchError(this.handleError));
  }

  getAllClaims(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/claims/`, { headers: this.getHeaders() })
      .pipe(retry(1), catchError(this.handleError));
  }

  updateClaimStatus(claimId: number, status: string, notes?: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/admin/claims/${claimId}/`, 
      { status, admin_notes: notes }, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Test backend connection
  testConnection(): Observable<any> {
    return this.http.get(`${this.apiUrl}/applications/my-applications/`)
      .pipe(catchError(this.handleError));
  }

  private handleError = (error: HttpErrorResponse) => {
    console.error('API Error:', error);
    
    if (error.status === 401) {
      // Token expired or invalid - redirect to login
      this.authService.clearAuthState();
      this.router.navigate(['/login']);
    }
    
    // Return the full error object to preserve response body
    return throwError(() => error);
  }
}