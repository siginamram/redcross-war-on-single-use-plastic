import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { CoreComponent } from './core.component';
import { SchoolsFormComponent } from './components/schools-form/schools-form.component';
import { SchoolsListComponent } from './components/schools-list/schools-list.component';
import { StudentsFormComponent } from './components/students-form/students-form.component';
import { StudentsListComponent } from './components/students-list/students-list.component';
import { PlasticcollectionComponent } from './components/plasticcollection/plasticcollection.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; 
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox'; 
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; 
import { MatSnackBarModule } from '@angular/material/snack-bar';  
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTreeModule } from '@angular/material/tree';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';  
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { SchoolsBulkUploadComponent } from './components/schools-bulk-upload/schools-bulk-upload.component';
import { StudentsBulkUploadComponent } from './components/students-bulk-upload/students-bulk-upload.component';
import { ZonesListComponent } from './components/zones-list/zones-list.component';
import { ZonesFormComponent } from './components/zones-form/zones-form.component';
import { ClusterListComponent } from './components/cluster-list/cluster-list.component';
import { ClusterFormComponent } from './components/cluster-form/cluster-form.component';
import { HttpClientModule } from '@angular/common/http';
import { VolunteersAddComponent } from './components/volunteers-add/volunteers-add.component';
import { VolunteersListComponent } from './components/volunteers-list/volunteers-list.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserUpdatePopupComponent } from './components/user-update-popup/user-update-popup.component';
import { VolunteersBulkUploadComponent } from './components/volunteers-bulk-upload/volunteers-bulk-upload.component';
import { SchoolRegisterStudentFormComponent } from './components/school-register-student-form/school-register-student-form.component';
import { SchoolRegisterStudentListComponent } from './components/school-register-student-list/school-register-student-list.component';
import { SchoolRegisterStudentBulkUploadComponent } from './components/school-register-student-bulk-upload/school-register-student-bulk-upload.component';
import { StudentsRewardTransactionsComponent } from './components/students-reward-transactions/students-reward-transactions.component';
import { UserAddComponent } from './components/user-add/user-add.component';


@NgModule({
  declarations: [
    CoreComponent,
    SchoolsFormComponent,
    SchoolsListComponent,
    StudentsFormComponent,
    StudentsListComponent,
    PlasticcollectionComponent,
    SchoolsBulkUploadComponent,
    StudentsBulkUploadComponent,
    ZonesListComponent,
    ZonesFormComponent,
    ClusterListComponent,
    ClusterFormComponent,
    VolunteersAddComponent,
    VolunteersListComponent,
    UserListComponent,
    UserUpdatePopupComponent,
    VolunteersBulkUploadComponent,
    SchoolRegisterStudentFormComponent,
    SchoolRegisterStudentListComponent,
    SchoolRegisterStudentBulkUploadComponent,
    StudentsRewardTransactionsComponent,
    UserAddComponent,
    
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule, 
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatDialogModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatTooltipModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatTabsModule,
    MatPaginatorModule,
    MatSortModule,
    MatExpansionModule,
    MatTreeModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatProgressBarModule,
    MatBottomSheetModule,
    HttpClientModule,
  
  ]
})
export class CoreModule { }
