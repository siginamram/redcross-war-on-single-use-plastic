// cluster-list.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CoreApiService } from '../../services/core-api.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../../../shared/components/alert-dialog/alert-dialog.component';
import { ClusterFormComponent } from '../cluster-form/cluster-form.component';

@Component({
  selector: 'app-cluster-list',
  standalone: false,
  templateUrl: './cluster-list.component.html',
  styleUrls: ['./cluster-list.component.scss']
})
export class ClusterListComponent implements OnInit {
  displayedColumns: string[] = ['sno', 'clusterName', 'volunteer1','mobile1','volunteer2','mobile2', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  districtID: number = Number(localStorage.getItem('districtID'));
  districtId: number = 0;
  districts: any[] = [];
  selectedDistrict: number = 0;
  stateId: number = 1;
  cities: any[] = [];
  zones: any[] = [];
  clusters: any[] = [];

  selectedCityId: number = 0;
  selectedZoneId: number = 0;

  constructor(private api: CoreApiService, private dialog: MatDialog) {}

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
    this.selectedCityId = 0;
    this.selectedZoneId = 0;
    this.cities = [];
    this.zones = [];
    if (this.districtId !== 0) {
      this.api.getCitiesByDistrict(this.districtId).subscribe((res: any[]) => {
        this.cities = [ ...res];
      });
    }
  }
  onCityChange(cityId: number): void {
    this.selectedZoneId = 0;
    this.zones = [];
    this.clusters = [];
    this.dataSource.data = [];

    this.api.getZones(cityId).subscribe({
      next: (res) => this.zones =res || [],
      error: () => this.zones = []
    });
  }

  onZoneChange(zoneId: number): void {
    this.api.getClustersByZone(zoneId).subscribe({
      next: (res) => {
        this.clusters = res;
        this.dataSource.data = res;
        this.dataSource.paginator = this.paginator;
      },
      error: () => {
        this.dataSource.data = [];
        this.openAlertDialog('Error', 'Failed to fetch clusters.', 'error');
      }
    });
  }

editCluster(cluster: any): void {
  const dialogRef = this.dialog.open(ClusterFormComponent, {
    width: '500px',
    data: cluster,
    disableClose: true
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result === 'updated') {
      this.onZoneChange(this.selectedZoneId);
    }
  });
}


  openAlertDialog(title: string, message: string, type: string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: { title, message, type }
    });
  }
}
