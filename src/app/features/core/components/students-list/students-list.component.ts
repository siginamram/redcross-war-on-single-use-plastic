import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CoreApiService } from '../../services/core-api.service';
import { MatDialog } from '@angular/material/dialog';
import { StudentsFormComponent } from '../students-form/students-form.component';

@Component({
  selector: 'app-students-list',
  standalone: false,
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.scss']
})
export class StudentsListComponent implements OnInit {
  displayedColumns: string[] = [
    'sno',
    'studentName',
    'classID',
    'sectionID',
    'rollNumber',
    'gender',
    'photoLink',
    'actions'
  ];

  dataSource = new MatTableDataSource<any>([]);
  zones: any[] = [];
  clusters: any[] = [];
  schools: any[] = [];

  selectedZone: number = 0;
  selectedCluster: number = 0;
  selectedSchool: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private api: CoreApiService,
              private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.api.getZones(1).subscribe(res => {
      this.zones = res;
    });
  }

ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
}
  onZoneChange() {
    this.api.getClustersByZone(this.selectedZone).subscribe(res => {
      this.clusters = res;
      this.schools = [];
      this.dataSource.data = [];
    });
  }

  onClusterChange() {
    this.api.getSchoolsByCluster(this.selectedCluster).subscribe(res => {
      this.schools = res;
      this.dataSource.data = [];
    });
  }

  onSchoolChange(): void {
    if (!this.selectedSchool) {
      console.warn('No school selected');
      return;
    }

    this.api.getStudentsBySchool(this.selectedSchool).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource<any>(res);
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.error('Error fetching students:', err);
      }
    });
  }
   editStudent(student: any): void {
      const dialogRef = this.dialog.open(StudentsFormComponent, {
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
