import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, Injector, TemplateRef } from '@angular/core';
import { DialogComponent } from '../Components/dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
private dialogRef: ComponentRef<DialogComponent> | null = null;

  constructor(
    private appRef: ApplicationRef,
    private injector: Injector,
    private resolver: ComponentFactoryResolver
  ) { }

  openWithComponent(component: any, data?: any) {
    this.close(); // close existing dialog if open
    const factory = this.resolver.resolveComponentFactory(DialogComponent);
    const compRef = factory.create(this.injector);
    compRef.instance.component = component;
    compRef.instance.data = data;
    compRef.instance.title = data?.title || '';

    this.appRef.attachView(compRef.hostView);
    document.body.appendChild((compRef.hostView as any).rootNodes[0]);
    this.dialogRef = compRef;
    return compRef;
  }

  openWithTemplate(templateRef: TemplateRef<any> | string, data?: any) {
    this.close(); // close existing dialog if open
    const factory = this.resolver.resolveComponentFactory(DialogComponent);
    const compRef = factory.create(this.injector);
    if (typeof templateRef === 'string') {
      compRef.instance.htmlContent = templateRef;
    } else {
      compRef.instance.templateRef = templateRef;
    }
    compRef.instance.data = data;
    compRef.instance.title = data?.title || '';

    this.appRef.attachView(compRef.hostView);
    document.body.appendChild((compRef.hostView as any).rootNodes[0]);
    this.dialogRef = compRef;
    return compRef;
  }

  openWithHtml(htmlContent: string, data?: any) {
    this.close();
    const factory = this.resolver.resolveComponentFactory(DialogComponent);
    const compRef = factory.create(this.injector);
    
    compRef.instance.htmlContent = htmlContent;
    compRef.instance.data = data;
    compRef.instance.title = data?.title || '';

    this.appRef.attachView(compRef.hostView);
    document.body.appendChild((compRef.hostView as any).rootNodes[0]);
    this.dialogRef = compRef;
    return compRef;
  }

  close() {
    if (this.dialogRef) {
      this.appRef.detachView(this.dialogRef.hostView);
      this.dialogRef.destroy();
      this.dialogRef = null;
    }
  }

  isOpen(): boolean {
    return this.dialogRef !== null;
  }
}
