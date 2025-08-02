import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreApiService } from '../../services/core-api.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlertDialogComponent } from '../../../../shared/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-cluster-form',
  standalone: false,
  templateUrl: './cluster-form.component.html',
  styleUrls: ['./cluster-form.component.scss']
})
export class ClusterFormComponent implements OnInit {
  clusterForm!: FormGroup;
  cities: any[] = [];
  zones: any[] = [];
  volunteers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private api: CoreApiService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
  this.clusterForm = this.fb.group({
  clusterName: ['', Validators.required],
  cityID: ['', Validators.required],
  zoneID: ['', Validators.required],
  volunteerID: ['', Validators.required] // 👈 This is correct
});

    this.api.getCitiesByDistrict(1).subscribe({
      next: (res) => this.cities = res || [],
      error: () => this.cities = []
    });

    this.api.getVolunteers().subscribe({
      next: (res) => this.volunteers = res || [],
      error: () => this.volunteers = []
    });
  }

  onCityChange(cityId: number): void {
    this.zones = [];
    this.clusterForm.patchValue({ zoneID: null });
    this.api.getZones(cityId).subscribe({
      next: (res) => this.zones = res || [],
      error: () => this.zones = []
    });
  }

  onSubmit(): void {
    if (this.clusterForm.invalid) return;

    const payload = this.clusterForm.value;
    this.api.updateCluster(payload).subscribe({
      next: () => {
        this.openAlertDialog('Success', 'Cluster saved successfully.', 'success');
        this.router.navigate(['/home/core/cluster-list']);
        this.clusterForm.reset();
      },
      error: (err) => {
        this.openAlertDialog('Error', 'Failed to save cluster. Please try again.', 'error');
        console.error(err);
      }
    });
  }

  openAlertDialog(title: string, message: string, type: string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: { title, message, type },
    });
  }

    onCancel(): void {
    history.back();
  }
}
