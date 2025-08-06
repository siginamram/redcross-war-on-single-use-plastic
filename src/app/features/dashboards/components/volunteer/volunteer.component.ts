import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../../dashboard.service';

Chart.register(...registerables);

@Component({
  selector: 'app-volunteer-dashboard',
  standalone: false,
  templateUrl: './volunteer.component.html',
  styleUrls: ['./volunteer.component.scss']
})
export class VolunteerComponent implements OnInit {
  @ViewChild('lineChartCanvas') lineChartCanvas!: ElementRef;
  @ViewChild('barChartCanvas') barChartCanvas!: ElementRef;

  fromDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  toDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

  totalWasteCollected = 0;
  activeSchools = 0;
  participatingStudents = 0;
  topPerformingZone = '-';
  topPerformingCity = '-';

  schoolLeaderboard: any[] = [];
  studentLeaderboard: any[] = [];

  schoolDisplayedColumns = ['rank', 'school', 'collected'];
  studentDisplayedColumns = ['rank', 'student', 'school', 'collected'];

  loading = false;
  zoneID = Number(localStorage.getItem('zoneID'));
  volunteerId = Number(localStorage.getItem('volunteerId'));

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  onDateChange(): void {
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    this.loading = true;
    const fdate = this.fromDate.toISOString().split('T')[0];
    const tdate = this.toDate.toISOString().split('T')[0];

    this.dashboardService.GetVolunteerDashboard(fdate, tdate, this.zoneID, this.volunteerId)
      .subscribe({
        next: (res) => {
          this.totalWasteCollected = res.totalWasteCollectedKG || 0;
          this.activeSchools = res.activeSchools || 0;
          this.participatingStudents = res.participatingStudents || 0;
          this.topPerformingZone = res.topPerformingSchool || '-';
          this.topPerformingCity = res.topPerformingCity || '-';

          this.schoolLeaderboard = (res.topSchools || []).map((s: any, i: number) => ({
            rank: i + 1,
            school: s.schoolName,
            collected: s.totalWasteKG
          }));

          this.studentLeaderboard = (res.topStudents || []).map((s: any, i: number) => ({
            rank: i + 1,
            student: s.studentName,
            school: s.schoolName,
            collected: s.totalWasteKG
          }));

          setTimeout(() => {
            this.renderLineChart(res.monthWiseCollections || []);
            this.renderBarChart(this.schoolLeaderboard);
          }, 100);
        },
        complete: () => this.loading = false,
        error: () => this.loading = false
      });
  }

  renderLineChart(data: any[]): void {
    const ctx = this.lineChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(d => d.collectionMonthYear),
        datasets: [{
          label: 'Plastic Collected (kg)',
          data: data.map(d => d.totalWasteKG),
          borderColor: '#2e7d32',
          backgroundColor: 'rgba(46, 125, 50, 0.2)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  renderBarChart(data: any[]): void {
    const ctx = this.barChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.school),
        datasets: [{
          label: 'Plastic Collected (kg)',
          data: data.map(d => d.collected),
          backgroundColor: '#43a047'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }
}
