import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'app-school-dashboard',
  standalone: false,
  templateUrl: './school-dashboard.component.html',
  styleUrls: ['./school-dashboard.component.scss']
})
export class SchoolDashboardComponent implements OnInit {
  fromDate: Date;
  toDate: Date;
  today = new Date();
 loading = false;
  schoolId: number = Number(localStorage.getItem('schoolID'));
  stats: any[] = [];
  overall: any[] = [];
  displayedColumns = ['class', 'section', 'total', 'participated', 'rate', 'plastic'];
  classData: any[] = [];

  topColumns = ['rank', 'name', 'roll', 'class', 'section',  'collected'];
  topPerformers: any[] = [];

  constructor(private api: DashboardService) {
    this.today = new Date();

    // Set default fromDate as 1st day of current month
    this.fromDate = new Date(this.today.getFullYear(), this.today.getMonth(), 1);

    // Set default toDate as last day of current month
    this.toDate = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0);
  }

  ngOnInit(): void {
    this.getDashboardData();
  }

  getDashboardData(): void {
      this.loading = true;
    const fdate = this.fromDate.toISOString().split('T')[0];
    const tdate = this.toDate.toISOString().split('T')[0];

    this.api.GetSchoolDashboard(fdate, tdate, this.schoolId).subscribe({
      next: (res) => {
          this.loading = false;
        this.stats = [
          { title: 'Total Students', value: res.totalStudents, icon: 'groups' },
          { title: 'Participated', value: res.participatingStudents, icon: 'check_circle' },
          { title: 'Participation %', value: res.participationPercent + '%', icon: 'percent' },
          { title: 'Plastic Collected', value: res.totalKgsCollected + ' KG', icon: 'recycling' },
          { title: 'Top Performing Class', value: res.topClass, icon: 'emoji_events' },
        ];


        this.classData = (res.sectionWiseCollection || []).map((item: any, index: number)=> ({
          class: item.className,
          section: item.sectionName,
          total: item.totalStudents,
          participated: item.participatedCount,
          rate: item.participationPercent + '%',
          plastic: item.totalWeightKG + ' KG',
        }));

          this.topPerformers = (res.topStudents || []).map((item:any, index: number) => ({
          rank: index + 1,
          name: item.studentName,
          roll: item.rollNumber,
          class: item.className,
          section: item.sectionName,
          weeks: '-', // Placeholder if not available
          collected: item.totalWasteKG + ' KG',
        }));
      },
      error: (err) => {
          this.loading = false;
        console.error('Error fetching dashboard data:', err);
      }
    });
  }
}
