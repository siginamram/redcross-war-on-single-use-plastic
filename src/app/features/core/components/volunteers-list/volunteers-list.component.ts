import { Component, OnInit, ViewChild } from '@angular/core';
import { CoreApiService } from '../../services/core-api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-volunteers-list',
  standalone: false,
  templateUrl: './volunteers-list.component.html',
  styleUrls: ['./volunteers-list.component.scss']
})
export class VolunteersListComponent implements OnInit {
  displayedColumns: string[] = ['sno', 'volunteerName', 'mobileNo', 'email', 'address', 'organization'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private api: CoreApiService) {}

  ngOnInit(): void {
    this.api.getVolunteers().subscribe(res => {
      this.dataSource = new MatTableDataSource(res);
      setTimeout(() => this.dataSource.paginator = this.paginator);
    });
  }

  getRowNumber(row: any): number {
    const index = this.dataSource.filteredData.indexOf(row);
    const pageIndex = this.dataSource.paginator?.pageIndex ?? 0;
    const pageSize = this.dataSource.paginator?.pageSize ?? 5;
    return (pageIndex * pageSize) + index + 1;
  }
}
