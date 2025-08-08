import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { CoreApiService } from '../../services/core-api.service';
import { SchoolsFormComponent } from '../schools-form/schools-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-schools-list',
  standalone: false,
  templateUrl: './schools-list.component.html',
  styleUrls: ['./schools-list.component.scss']
})
export class SchoolsListComponent implements OnInit {
    displayedColumns: string[] = [
    'sno',
    'schoolName',
    'hodName',
    'hodPhone',
    'contactPersonName',
    'contactPersonPhone',
    'contactPersonDesignation',
    'schoolTypeId',
    'schoolAddress',
    'actions'
  ];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  districts: any[] = [];
  cities: any[] = [];
  zones: any[] = [];

  selectedDistrictId: number = 0;
  selectedCityId: number = 0;
  selectedZoneId: number = 0;

  storedDistrictId: number = Number(localStorage.getItem('districtID')) || 0;
  storedCityId: number = Number(localStorage.getItem('cityID')) || 0;
  storedZoneId: number = Number(localStorage.getItem('zoneID')) || 0;

  constructor(
    private api: CoreApiService,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getDistricts();
  }

  // Load districts & proceed with logic
  getDistricts(): void {
    const stateId = 1;
    this.api.getDistrictsByState(stateId).subscribe((res) => {
      this.districts = res || [];

      if (this.storedDistrictId !== 0) {
        this.selectedDistrictId = this.storedDistrictId;
        this.onDistrictChange(true);
      } else {
        this.getFilteredSchools(); // Show default data
      }
    });
  }

  onDistrictChange(fromInit: boolean = false): void {
    this.selectedCityId = 0;
    this.selectedZoneId = 0;
    this.cities = [];
    this.zones = [];
    this.dataSource.data = [];

    if (this.selectedDistrictId) {
      this.api.getCitiesByDistrict(this.selectedDistrictId).subscribe((res) => {
        this.cities = res || [];

        if (fromInit && this.storedCityId !== 0) {
          this.selectedCityId = this.storedCityId;
          this.onCityChange(this.selectedCityId, true);
        } else {
          this.getFilteredSchools(); // In case of dropdown reset
        }
      });
    } else {
      this.getFilteredSchools();
    }
  }

  onCityChange(cityId: number, fromInit: boolean = false): void {
    this.selectedZoneId = 0;
    this.zones = [];
    this.dataSource.data = [];

    if (cityId) {
      this.api.getZones(cityId).subscribe((res) => {
        this.zones = res || [];

        if (fromInit && this.storedZoneId !== 0) {
          this.selectedZoneId = this.storedZoneId;
          this.getFilteredSchools();
        } else {
          this.getFilteredSchools();
        }
      });
    } else {
      this.getFilteredSchools();
    }
  }

  onZoneChange(): void {
    this.getFilteredSchools();
  }

  getFilteredSchools(): void {
    const district = this.selectedDistrictId || 0;
    const city = this.selectedCityId || 0;
    const zone = this.selectedZoneId || 0;

    this.api.getSchoolsByZone(1, district, city, zone).subscribe((res) => {
      this.dataSource = new MatTableDataSource<any>(res || []);
      this.dataSource.paginator = this.paginator;
    });
  }

  getRowNumber(row: any): number {
    const pageIndex = this.paginator?.pageIndex ?? 0;
    const pageSize = this.paginator?.pageSize ?? 5;
    const data = this.dataSource.filteredData;
    const index = data.indexOf(row);
    return pageIndex * pageSize + index + 1;
  }

  editSchool(school: any): void {
    const dialogRef = this.dialog.open(SchoolsFormComponent, {
      width: '900px',
      data: school
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'refresh') {
        this.getFilteredSchools();
      }
    });
  }

  get disableDistrict(): boolean {
    return this.storedDistrictId !== 0;
  }

  get disableCity(): boolean {
    return this.storedCityId !== 0;
  }

  get disableZone(): boolean {
    return this.storedZoneId !== 0;
  }
}
