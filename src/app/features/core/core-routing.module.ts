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

const routes: Routes = [
  { 
    path: '', component: CoreComponent ,
    children: 
    [
      {path: 'zone-list', component: ZonesListComponent },
      {path: 'zone-form', component: ZonesFormComponent },

      {path: 'cluster-form', component: ClusterListComponent },
      {path: 'cluster-form', component: ClusterFormComponent },

      {path: 'schools-form', component: SchoolsFormComponent },
      {path: 'schools-list', component: SchoolsListComponent },
      {path: 'schools-bulk-upload', component: SchoolsBulkUploadComponent },

      {path: 'students-form', component: StudentsFormComponent },
      {path: 'students-list', component: StudentsListComponent },
      {path: 'students-bulk-upload', component: StudentsBulkUploadComponent },

      {path: 'plastic-collection', component: PlasticcollectionComponent }
    ]

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
