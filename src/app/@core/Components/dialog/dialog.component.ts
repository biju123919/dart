import { Component, ComponentFactoryResolver, ComponentRef, ElementRef, Injector, Input, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-dialog',
  standalone: false,
  templateUrl: './dialog.component.html'
})
export class DialogComponent {
  @Input() component: any;
  @Input() templateRef: TemplateRef<any> | null = null;
  @Input() htmlContent: string = '';
  @Input() data: any;
  @Input() title: string = '';

  @ViewChild('htmlContainer', { static: false }) htmlContainer!: ElementRef;
  @ViewChild('vc', { read: ViewContainerRef, static: false }) viewContainer!: ViewContainerRef;

  sanitizedHtmlContent: SafeHtml = '';
  private componentRef: ComponentRef<any> | null = null;

  constructor(
    private sanitizer: DomSanitizer,
    private elementRef: ElementRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector
  ) { }

  ngOnInit() {

    if (this.htmlContent) {
      this.sanitizedHtmlContent = this.sanitizer.bypassSecurityTrustHtml(this.htmlContent);

      setTimeout(() => {
        this.attachEventListeners();
      }, 0);
    }

    if (this.component && this.viewContainer) {
      this.loadDynamicComponent();
    }
  }

  ngAfterViewInit() {

    if (this.htmlContent) {
      setTimeout(() => {
        this.attachEventListeners();
      }, 100);
    }
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  private loadDynamicComponent() {
    if (this.component && this.viewContainer) {
      const factory = this.componentFactoryResolver.resolveComponentFactory(this.component);
      this.viewContainer.clear();
      this.componentRef = this.viewContainer.createComponent(factory);

      if (this.componentRef.instance && this.data) {
        Object.keys(this.data).forEach(key => {
          if (this.componentRef!.instance.hasOwnProperty(key)) {
            this.componentRef!.instance[key] = this.data[key];
          }
        });
      }
    }
  }

  private attachEventListeners() {
    if (this.htmlContainer?.nativeElement) {
      const container = this.htmlContainer.nativeElement;
      const buttons = container.querySelectorAll('button[id]');
      buttons.forEach((button: HTMLButtonElement) => {
        button.addEventListener('click', (event) => {
          this.handleButtonClick(event, button.id);
        });
      });

      if (this.data?.onConfirm || this.data?.onCancel) {
        const confirmButtons = container.querySelectorAll('[data-action="confirm"], .btn-confirm, #sessionExpiredConfirmBtn');
        confirmButtons.forEach((btn: HTMLElement) => {
          btn.addEventListener('click', () => {
            if (this.data?.onConfirm) {
              this.data.onConfirm();
            }
          });
        });

        const cancelButtons = container.querySelectorAll('[data-action="cancel"], .btn-cancel');
        cancelButtons.forEach((btn: HTMLElement) => {
          btn.addEventListener('click', () => {
            if (this.data?.onCancel) {
              this.data.onCancel();
            }
          });
        });
      }
    }
  }

  private handleButtonClick(event: Event, buttonId: string) {
    event.preventDefault();

    switch (buttonId) {
      case 'sessionExpiredConfirmBtn':
        if (this.data?.onConfirm) {
          this.data.onConfirm();
        }
        break;
      default:
        if (this.data?.onButtonClick) {
          this.data.onButtonClick(buttonId);
        }
        break;
    }
  }

}
