import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CoreApiService } from '../../services/core-api.service';

@Component({
  selector: 'app-zones-list',
  standalone: false,
  templateUrl: './zones-list.component.html',
  styleUrls: ['./zones-list.component.scss']
})
export class ZonesListComponent implements OnInit {
  displayedColumns: string[] = ['sno', 'zoneName', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  cities: any[] = [];
  selectedCity: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private api: CoreApiService) {}

  ngOnInit(): void {
    this.api.getCitiesByDistrict(1).subscribe(res => this.cities = res);
  }

  onCityChange(): void {
    if (!this.selectedCity) {
      this.dataSource.data = [];
      return;
    }

    this.api.getZones(this.selectedCity).subscribe(res => {
      this.dataSource = new MatTableDataSource<any>(res);
      setTimeout(() => this.dataSource.paginator = this.paginator);
    });
  }

  getRowNumber(row: any): number {
    const index = this.dataSource.filteredData.indexOf(row);
    const pageIndex = this.dataSource.paginator?.pageIndex ?? 0;
    const pageSize = this.dataSource.paginator?.pageSize ?? 5;
    return (pageIndex * pageSize) + index + 1;
  }

  editZone(row: any): void {
    console.log('Edit Zone:', row);
    // Navigate to form or open dialog
  }
}
