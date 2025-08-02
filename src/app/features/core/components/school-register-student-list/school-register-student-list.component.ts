import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CoreApiService } from '../../services/core-api.service';
import { MatDialog } from '@angular/material/dialog';
import { SchoolRegisterStudentFormComponent } from '../school-register-student-form/school-register-student-form.component';

@Component({
  selector: 'app-school-register-student-list',
  standalone: false,
  templateUrl: './school-register-student-list.component.html',
  styleUrls: ['./school-register-student-list.component.scss']
})
export class SchoolRegisterStudentListComponent implements OnInit, AfterViewInit {
  classList: any[] = [];
  sectionList: any[] = [];

  displayedColumns: string[] = [
    'sno',
    'studentName',
    'classID',
    'sectionID',
    'rollNumber',
    'gender',
    'photoLink',
    'rewardPoint',
    'actions'
  ];

  dataSource = new MatTableDataSource<any>([]);
  selectedClass: number | null = null;
  selectedSection: number | null = null;
  schoolId: number = Number(localStorage.getItem('schoolID'));

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private api: CoreApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadClassSectionData();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadClassSectionData(): void {
    this.api.getClasses().subscribe(res => this.classList = res || []);
    this.api.getSections().subscribe(res => this.sectionList = res || []);
  }

  onSchoolChange(): void {
    if (!this.schoolId || !this.selectedClass || !this.selectedSection) {
      this.dataSource.data = [];
      return;
    }

    this.api.getStudentsBySchool(this.schoolId, this.selectedClass, this.selectedSection).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource<any>(res || []);
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.error('Error fetching students:', err);
      }
    });
  }

  editStudent(student: any): void {
    const dialogRef = this.dialog.open(SchoolRegisterStudentFormComponent, {
      width: '900px',
      data: student
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'refresh') {
        this.onSchoolChange();
      }
    });
  }
}
