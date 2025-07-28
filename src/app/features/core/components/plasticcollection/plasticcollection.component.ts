import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-plasticcollection',
  standalone: false,
  templateUrl: './plasticcollection.component.html',
  styleUrls: ['./plasticcollection.component.scss']
})
export class PlasticcollectionComponent implements OnInit {
  selectedClass = '9th A';
  classList = ['8th A', '8th B', '9th A'];
  collectionDate: Date = new Date();
  collectionForm: FormGroup;

  students = [
    { name: 'Eshan Jain', rollNo: '01' },
    { name: 'Falguni Shah', rollNo: '02' },
    { name: 'Gaurav Mehta', rollNo: '03' }
  ];

  constructor(private fb: FormBuilder) {
    this.collectionForm = this.fb.group({
      students: this.fb.array([])
    });
  }

  ngOnInit() {
    const studentControls = this.students.map(student =>
      this.fb.group({
        name: [student.name],
        rollNo: [student.rollNo],
        date: [new Date()],
        weight: ['']
      })
    );
    this.collectionForm.setControl('students', this.fb.array(studentControls));
  }

  get studentsArray(): FormArray {
    return this.collectionForm.get('students') as FormArray;
  }

  onSubmit() {
    console.log('Submitted:', this.collectionForm.value);
  }
}
