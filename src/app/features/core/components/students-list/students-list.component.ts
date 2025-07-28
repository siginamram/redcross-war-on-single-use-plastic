import { Component } from '@angular/core';

@Component({
  selector: 'app-students-list',
 standalone: false,
  templateUrl: './students-list.component.html',
  styleUrl: './students-list.component.scss'
})
export class StudentsListComponent {
  displayedColumns: string[] = ['studentName', 'schoolName', 'class', 'rollNo', 'zone', 'actions'];

  students = [
    { studentName: 'Aarav Sharma', schoolName: 'Sunrise Public School', class: '8-A', rollNo: '01', zone: 'Zone A' },
    { studentName: 'Dia Mirza', schoolName: 'Riverdale High', class: '9-B', rollNo: '02', zone: 'Zone B' },
    { studentName: 'Rohan Kumar', schoolName: 'Green Valley High', class: '7-A', rollNo: '03', zone: 'Zone A' },
    { studentName: 'Priya Singh', schoolName: 'City Central School', class: '8-C', rollNo: '15', zone: 'Zone C' }
  ];
}
