import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';

@Directive({
  selector: '[appToggleStatus]',
})
export class ToggleStatus {
  public appToggleStatus = input<string>();

  private el = inject(ElementRef);
  private isHidden = true;
  private hiddenText = 'See status';

  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent): void {
    event.stopPropagation();
    this.isHidden = !this.isHidden;
    this.updateText();
  }

  private updateText(): void {
    this.el.nativeElement.textContent = this.isHidden
      ? this.hiddenText
      : `Status: ${this.appToggleStatus()}`;
  }

  public ngOnInit(): void {
    this.updateText();
  }
}
