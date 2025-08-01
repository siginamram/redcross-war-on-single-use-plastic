// cluster-list.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CoreApiService } from '../../services/core-api.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../../../shared/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-cluster-list',
  standalone: false,
  templateUrl: './cluster-list.component.html',
  styleUrls: ['./cluster-list.component.scss']
})
export class ClusterListComponent implements OnInit {
  displayedColumns: string[] = ['sno', 'clusterName', 'volunteer'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  cities: any[] = [];
  zones: any[] = [];
  clusters: any[] = [];

  selectedCityId: number = 0;
  selectedZoneId: number = 0;

  constructor(private api: CoreApiService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.api.getCitiesByDistrict(1).subscribe({
      next: (res) => this.cities = res || [],
      error: () => this.cities = []
    });
  }

  onCityChange(cityId: number): void {
    this.selectedZoneId = 0;
    this.zones = [];
    this.clusters = [];
    this.dataSource.data = [];

    this.api.getZones(cityId).subscribe({
      next: (res) => this.zones = res || [],
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

  openAlertDialog(title: string, message: string, type: string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: { title, message, type }
    });
  }
}
