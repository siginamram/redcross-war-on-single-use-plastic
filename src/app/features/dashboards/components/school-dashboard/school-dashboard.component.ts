import { Component } from '@angular/core';

@Component({
  selector: 'app-school-dashboard',
  standalone: false,
  templateUrl: './school-dashboard.component.html',
  styleUrls: ['./school-dashboard.component.scss']
})
export class SchoolDashboardComponent {
  fromDate = new Date();
  toDate = new Date();

 stats = [
  { title: 'Total Students', value: 560, sub: 'Across all classes', icon: 'groups' },
  { title: 'Total Participation', value: '410', sub: 'Last 4 weeks', icon: 'how_to_reg' },
  { title: 'Total Plastic Collected', value: '145.5 KG', sub: 'Across schools', icon: 'recycling' },
  { title: 'Average Participation', value: '73.2%', sub: 'School-wide', icon: 'leaderboard' }
];

overall = [
  { title: 'School Participation', value: '78%', sub: 'This month', icon: 'insights' },
  { title: 'Plastic Collected', value: '145 KG', sub: 'Last 4 weeks', icon: 'delete_outline' },
  { title: 'Active Classes', value: 18, sub: 'From 3rd to 10th', icon: 'school' },
  { title: 'Top Class', value: '8-A', sub: 'Highest contribution', icon: 'emoji_events' }
];


  displayedColumns = ['class', 'section', 'total', 'participated', 'rate', 'plastic'];
  classData = [
    { class: '10', section: 'A', total: 45, participated: 42, rate: '93.3%', plastic: 285.6 },
    { class: '10', section: 'B', total: 44, participated: 38, rate: '86.4%', plastic: 267.8 },
    { class: '9', section: 'A', total: 46, participated: 41, rate: '89.1%', plastic: 298.4 }
  ];

  topColumns = ['rank', 'name', 'roll', 'class', 'section', 'weeks', 'collected'];
  topPerformers = [
    { rank: '#1', name: 'Arjun Sharma', roll: '2023001', class: 10, section: 'A', weeks: '24/24', collected: 45.8 },
    { rank: '#2', name: 'Priya Patel', roll: '2023045', class: 9, section: 'B', weeks: '23/24', collected: 42.3 }
  ];
}
