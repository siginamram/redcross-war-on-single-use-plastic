import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CoreApiService } from '../../services/core-api.service';

@Component({
  selector: 'app-schools-list',
  standalone: false,
  templateUrl: './schools-list.component.html',
  styleUrls: ['./schools-list.component.scss']
})
export class SchoolsListComponent implements OnInit, AfterViewInit {
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

  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  cities: any[] = [];
  zones: any[] = [];
  clusters: any[] = [];

  selectedCityId: number = 0;
  selectedZoneId: number = 0;
  selectedClusterId: number | null = null;

  constructor(private api: CoreApiService) {}

  ngOnInit(): void {
    const districtId = 1; // Default district ID
    this.fetchCities(districtId);
  }

  ngAfterViewInit(): void {
    // Attach paginator after view init
    this.dataSource.paginator = this.paginator;
  }

  fetchCities(districtId: number): void {
    this.api.getCitiesByDistrict(districtId).subscribe({
      next: (res) => {
        this.cities = res || [];
       // console.log('Cities loaded:', this.cities);
      },
      error: () => this.cities = []
    });
  }

  onCityChange(cityId: number): void {
    this.selectedZoneId = 0;
    this.selectedClusterId = 0;
    this.zones = [];
    this.clusters = [];
    this.dataSource.data = [];

    this.api.getZones(cityId).subscribe({
      next: (res) => {
        this.zones = res || [];
       // console.log('Zones loaded:', this.zones);
      },
      error: () => this.zones = []
    });
  }

  onZoneChange(zoneId: number): void {
    this.selectedClusterId = 0;
    this.clusters = [];
    this.dataSource.data = [];

    this.api.getClustersByZone(zoneId).subscribe({
      next: (res) => {
        //console.log('Clusters loaded:', res);
        this.clusters = res || [];
      },
      error: () => this.clusters = []
    });
  }

  onClusterChange(clusterId: number): void {
    if (!clusterId) return;

   // console.log('Selected Cluster ID:', clusterId);

    this.api.getSchoolsByCluster(clusterId).subscribe({
      next: (res) => {
        //console.log('Schools loaded:', res);
        this.dataSource = new MatTableDataSource<any>(res || []);
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.error('Failed to load schools:', err);
        this.dataSource = new MatTableDataSource<any>([]);
      }
    });
  }
getRowNumber(row: any): number {
  const data = this.dataSource.filteredData;
  const index = data.indexOf(row);
  const pageIndex = this.dataSource.paginator?.pageIndex ?? 0;
  const pageSize = this.dataSource.paginator?.pageSize ?? 5;
  return (pageIndex * pageSize) + index + 1;
}

 
  editSchool(school: any): void {
    console.log('Editing school:', school);
    // Add navigation or popup logic here
  }
}
