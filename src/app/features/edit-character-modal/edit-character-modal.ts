import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { Character } from '../../shared/models/character';

@Component({
  selector: 'app-edit-character-modal',
  imports: [MatDialogActions, ReactiveFormsModule, MatDialogContent],
  templateUrl: './edit-character-modal.html',
  styleUrl: './edit-character-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditCharacterModal implements OnInit {
  public editForm!: FormGroup;

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef);
  public data: Character = inject(MAT_DIALOG_DATA);

  public ngOnInit(): void {
    this.editForm = this.fb.group({
      species: [this.data.species, Validators.required],
      type: [this.data.type || ''],
      gender: [this.data.gender, Validators.required],
      status: [this.data.status, Validators.required],
      originName: [this.data.origin.name, Validators.required],
      locationName: [this.data.location.name, Validators.required],
    });
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public onSave(): void {
    if (this.editForm.valid) {
      this.dialogRef.close({ ...this.data, ...this.editForm.value });
    }
  }
}
