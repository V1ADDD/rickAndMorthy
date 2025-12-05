import { ChangeDetectionStrategy, Component, inject, OnInit, DestroyRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { Character } from '../../shared/models/character';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

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
  private dialogRef = inject(MatDialogRef<EditCharacterModal>);
  private destroyRef = inject(DestroyRef);
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

    this.dialogRef
      .backdropClick()
      .pipe(
        tap(() => this.onCancel()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    this.dialogRef
      .keydownEvents()
      .pipe(
        tap((event) => {
          if (event.key === 'Escape') {
            this.onCancel();
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  public onCancel(): void {
    this.dialogRef.close(this.data);
  }

  public onSave(): void {
    if (this.editForm.valid) {
      this.dialogRef.close({
        ...this.data,
        ...this.editForm.value,
        origin: {
          name: this.editForm.get('originName')?.value,
        },
        location: {
          name: this.editForm.get('locationName')?.value,
        },
      });
    }
  }
}
