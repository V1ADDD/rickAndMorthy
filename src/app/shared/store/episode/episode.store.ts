import { Episode } from '../../models/episode';
import { EntityState } from '@ngrx/entity';
import { HttpErrorResponse } from '@angular/common/http';

export interface EpisodesState extends EntityState<Episode> {
  isLoading: boolean;
  pages: number;
  currentPage: number;
  error: HttpErrorResponse | null;
}
