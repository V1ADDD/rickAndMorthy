import { Directive, TemplateRef, ViewContainerRef, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectRole } from '../store/user/user.reducer';

@Directive({
  selector: '[appIsAdmin]',
})
export class IsAdmin implements OnInit {
  private viewContainer = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef);
  private store = inject(Store);

  private userRoleSig = this.store.selectSignal(selectRole);

  public ngOnInit(): void {
    if (this.userRoleSig() === 'admin') {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
