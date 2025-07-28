import { Component } from '@angular/core';

@Component({
  selector: 'app-schools-list',
  standalone: false,
  templateUrl: './schools-list.component.html',
  styleUrl: './schools-list.component.scss'
})
export class SchoolsListComponent {
  displayedColumns: string[] = ['name', 'contact', 'city', 'zone', 'status', 'actions'];

  schools = [
    { name: 'Sunrise Public School', contact: 'Mr. Sharma', city: 'City A1', zone: 'Zone A', status: 'Active' },
    { name: 'Riverdale High', contact: 'Ms. Gupta', city: 'City B1', zone: 'Zone B', status: 'Active' },
    { name: 'Green Valley High', contact: 'Mr. Khan', city: 'City A1', zone: 'Zone A', status: 'Pending' }
  ];
}
