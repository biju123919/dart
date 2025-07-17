import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import iconsData from 'src/assets/icons/icons.json';

@Component({
  selector: 'icon',
  standalone: false,
  template: `<span *ngIf="svgContent" [innerHTML]="svgContent"></span>`,
})
export class IconComponent implements OnChanges {
  @Input() icon!: string;
  svgContent: SafeHtml | null = null;
  private icons: { [key: string]: string } = iconsData;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['icon'] && changes['icon'].currentValue) {
      this.updateSvgContent(this.icon);
    }
  }

  private updateSvgContent(iconName: string): void {
    const svg = this.getIcon(iconName);
    this.svgContent = svg ? this.sanitizer.bypassSecurityTrustHtml(svg) : null;
  }

  private getIcon(name: string): string | null {
    return this.icons[name] || null;
  }
}
