import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreComponent } from './core.component';
import { SchoolsFormComponent } from './components/schools-form/schools-form.component';
import { SchoolsListComponent } from './components/schools-list/schools-list.component';
import { StudentsFormComponent } from './components/students-form/students-form.component';
import { StudentsListComponent } from './components/students-list/students-list.component';
import { PlasticcollectionComponent } from './components/plasticcollection/plasticcollection.component';
import { SchoolsBulkUploadComponent } from './components/schools-bulk-upload/schools-bulk-upload.component';
import { StudentsBulkUploadComponent } from './components/students-bulk-upload/students-bulk-upload.component';
import { ZonesListComponent } from './components/zones-list/zones-list.component';
import { ZonesFormComponent } from './components/zones-form/zones-form.component';
import { ClusterListComponent } from './components/cluster-list/cluster-list.component';
import { ClusterFormComponent } from './components/cluster-form/cluster-form.component';
import { VolunteersListComponent } from './components/volunteers-list/volunteers-list.component';
import { VolunteersAddComponent } from './components/volunteers-add/volunteers-add.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserUpdatePopupComponent } from './components/user-update-popup/user-update-popup.component';
import { VolunteersBulkUploadComponent } from './components/volunteers-bulk-upload/volunteers-bulk-upload.component';
import { SchoolRegisterStudentFormComponent } from './components/school-register-student-form/school-register-student-form.component';
import { SchoolRegisterStudentListComponent } from './components/school-register-student-list/school-register-student-list.component';
import { SchoolRegisterStudentBulkUploadComponent } from './components/school-register-student-bulk-upload/school-register-student-bulk-upload.component';
import { UserAddComponent } from './components/user-add/user-add.component';

const routes: Routes = [
  { 
    path: '', component: CoreComponent ,
    children: 
    [
      {path: 'users-list', component: UserListComponent },
      {path: 'users-form', component: UserUpdatePopupComponent },
      {path: 'users-add', component: UserAddComponent },

      {path: 'zone-list', component: ZonesListComponent },
      {path: 'zone-form', component: ZonesFormComponent },

      {path: 'cluster-list', component: ClusterListComponent },
      {path: 'cluster-form', component: ClusterFormComponent },

      {path: 'Volunteers-list', component: VolunteersListComponent },
      {path: 'Volunteers-form', component: VolunteersAddComponent },
      {path: 'Volunteers-bulk-upload', component: VolunteersBulkUploadComponent },

      {path: 'schools-form', component: SchoolsFormComponent },
      {path: 'schools-list', component: SchoolsListComponent },
      {path: 'schools-bulk-upload', component: SchoolsBulkUploadComponent },

      {path: 'students-form', component: StudentsFormComponent },
      {path: 'students-list', component: StudentsListComponent },
      {path: 'students-bulk-upload', component: StudentsBulkUploadComponent },

      {path: 'school-students-form', component: SchoolRegisterStudentFormComponent },
      {path: 'school-students-list', component: SchoolRegisterStudentListComponent },
      {path: 'school-students-bulk-upload', component: SchoolRegisterStudentBulkUploadComponent },

      {path: 'plastic-collection', component: PlasticcollectionComponent }
    ]

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
