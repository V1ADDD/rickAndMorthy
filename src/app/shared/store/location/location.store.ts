import { EntityState } from '@ngrx/entity';
import { Location } from '../../models/location';
import { HttpErrorResponse } from '@angular/common/http';

export interface LocationsState extends EntityState<Location> {
  isLoading: boolean;
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
  error: HttpErrorResponse | null;
}
