import { EntityState } from '@ngrx/entity';
import { Location } from '../../models/location';
import { HttpErrorResponse } from '@angular/common/http';

export interface LocationsState extends EntityState<Location> {
  isLoading: boolean;
  pages: number;
  currentPage: number;
  error: HttpErrorResponse | null;
}
