import { Component, OnInit } from '@angular/core';
import { CoreApiService } from '../../services/core-api.service';
import { MatDialog } from '@angular/material/dialog';
import { UserUpdatePopupComponent } from '../user-update-popup/user-update-popup.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  districtID: number = Number(localStorage.getItem('districtID'));
  districtId: number = 0;
  stateId: number = 1; // Assuming state ID is fixed for this example
  districts: any[] = [];
  cityList: any[] = [];
  zoneList: any[] = [];
  clusterList: any[] = [];
  userList: any[] = [];

  selectedCity: number = 0;
  selectedZone: number = 0;
  selectedCluster: number = 0;
  displayedColumns: string[] = ['sno', 'username', 'password', 'roleName', 'fullName', 'city', 'zone', 'cluster', 'schoolName', 'action'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private api: CoreApiService, private dialog: MatDialog) {}

  ngOnInit(): void {
     this.getDistricts();
  this.districtId = this.districtID !== 0 ? this.districtID : 0;
    if (this.districtID !== 0) {
    this.onDistrictChange(); // Auto-trigger city load & fetch data
  }
    this.getUserData(); // Load all users by default
  }

    ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  getDistricts() {
    this.api.getDistrictsByState(this.stateId).subscribe((res: any[]) => {
      this.districts = [{ districtID: 0, districtName: 'All' }, ...res];
    });
    
  }
    onDistrictChange() {
    this.selectedCity = 0;
    this.selectedZone = 0;
    this.cityList = [];
    this.zoneList = [];
    if (this.districtId !== 0) {
      this.api.getCitiesByDistrict(this.districtId).subscribe((res: any[]) => {
        this.cityList = [ ...res];
      });
    }
  }

  onCityChange() {
    this.zoneList = [];
    this.clusterList = [];
    this.selectedZone = 0;
    this.selectedCluster = 0;

    if (this.selectedCity) {
      this.api.getZones(this.selectedCity).subscribe((res: any[]) => {
        this.zoneList = res;
      });
    }

    this.getUserData();
  }

  onZoneChange() {
    this.clusterList = [];
    this.selectedCluster = 0;

    if (this.selectedZone) {
      this.api.getClustersByZone(this.selectedZone).subscribe((res: any[]) => {
        this.clusterList = res;
      });
    }

    this.getUserData();
  }

  onClusterChange() {
    this.getUserData();
  }

  getUserData() {
    this.api.GetUsersByCity(this.stateId,this.districtID,this.selectedCity, this.selectedZone, this.selectedCluster).subscribe(res => {
       this.dataSource.data = res || [];
    });
  }

  openEditPopup(user: any) {
    const dialogRef = this.dialog.open(UserUpdatePopupComponent, {
      width: '700px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.getUserData();
      }
    });
  }
}
