import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CoreApiService } from '../../services/core-api.service';
import { ZonesFormComponent } from '../zones-form/zones-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-zones-list',
  standalone: false,
  templateUrl: './zones-list.component.html',
  styleUrls: ['./zones-list.component.scss']
})
export class ZonesListComponent implements OnInit {
  displayedColumns: string[] = ['sno', 'zoneName', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  districtID: number = Number(localStorage.getItem('districtID'));
  districtId: number = 0;
  districts: any[] = [];
  selectedDistrict: number = 0;
  stateId: number = 1;
  cities: any[] = [];
  selectedCity: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private api: CoreApiService
              , private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getDistricts();
    this.districtId = this.districtID !== 0 ? this.districtID : 0;
    if (this.districtID !== 0) {
    this.onDistrictChange(); // Auto-trigger city load & fetch data
   }
  }
   getDistricts() {
    this.api.getDistrictsByState(this.stateId).subscribe((res: any[]) => {
      this.districts = [{ districtID: 0, districtName: 'Select' }, ...res];
    });
  }

  onDistrictChange() {
    this.selectedCity = 0;
    this.cities = [];
    if (this.districtId !== 0) {
      this.api.getCitiesByDistrict(this.districtId).subscribe((res: any[]) => {
        this.cities = [ ...res];
      });
    }
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
  const dialogRef = this.dialog.open(ZonesFormComponent, {
    width: '400px',
    data: row, // send selected zone
    disableClose: true
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result === 'updated') {
      this.onCityChange(); // reload updated list
    }
  });
}
}
