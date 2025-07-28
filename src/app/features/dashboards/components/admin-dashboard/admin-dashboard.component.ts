import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  Chart,
  registerables
} from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  @ViewChild('lineChartCanvas') lineChartCanvas!: ElementRef;
  @ViewChild('barChartCanvas') barChartCanvas!: ElementRef;
 fromDate = new Date();
  toDate = new Date();

  schoolDisplayedColumns: string[] = ['rank', 'school', 'zone', 'collected'];
  studentDisplayedColumns: string[] = ['rank', 'student', 'school', 'collected'];

  schoolLeaderboard = [
    { rank: 1, school: 'Sunrise Public School', zone: 'Zone A', collected: 1540.5 },
    { rank: 2, school: 'Riverdale High', zone: 'Zone B', collected: 1230.2 },
    { rank: 3, school: 'Green Valley High', zone: 'Zone A', collected: 1105.0 },
    { rank: 4, school: 'City Central School', zone: 'Zone C', collected: 980.7 },
    { rank: 5, school: 'Mountain View Academy', zone: 'Zone B', collected: 950.1 },
  ];

  studentLeaderboard = [
    { rank: 1, student: 'Aarav Sharma', school: 'Sunrise Public School', collected: 55.2 },
    { rank: 2, student: 'Dia Mirza', school: 'Riverdale High', collected: 51.8 },
    { rank: 3, student: 'Rohan Kumar', school: 'Green Valley School', collected: 48.1 },
    { rank: 4, student: 'Ananya Singh', school: 'City Central School', collected: 45.5 },
    { rank: 5, student: 'Arjun Patel', school: 'Mountain View Academy', collected: 42.3 },
  ];
  constructor() {}
  ngOnInit(): void {
    setTimeout(() => {
      this.renderLineChart();
      this.renderBarChart();
    }, 100); // delay for view init
  }

  renderLineChart(): void {
    const ctx = this.lineChartCanvas.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Plastic Collected (kg)',
          data: [180, 310, 245, 290, 220, 230],
          borderColor: '#2e7d32',
          backgroundColor: 'rgba(46, 125, 50, 0.2)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  renderBarChart(): void {
    const ctx = this.barChartCanvas.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Sunrise', 'Riverdale', 'Green Valley', 'City Central', 'Mountain View'],
        datasets: [{
          label: 'Plastic Collected (kg)',
          data: [1540.5, 1230.2, 1105.0, 980.7, 950.1],
          backgroundColor: '#43a047'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}
