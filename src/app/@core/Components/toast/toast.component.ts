import { Component, OnInit } from '@angular/core';
import { SvgIcon } from '../../enums/svg-icon';
import { Toast } from '../../model/toast/toast';
import { ToastService } from '../../service/toast.service';


@Component({
  selector: 'app-toast',
  standalone: false,
  templateUrl: './toast.component.html'
})
export class ToastComponent {
toasts: Toast[] = [];
  svgIcon = SvgIcon;

  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    this.toastService.toast$.subscribe((toast: Toast) => {
      this.toasts.push(toast);
       setTimeout(() => this.removeToast(toast), toast.delay ?? 3000);
    });
  }

  removeToast(toast: Toast): void {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  getToastClass(type: Toast['type']): string {
    return {
      success: 'toast-success',
      error: 'toast-error',
      info: 'toast-info',
      warning: 'toast-warning'
    }[type];
  }

  getIconForToast(type: Toast['type']): SvgIcon {
    return {
      success: this.svgIcon.ToasterSuccess,
      error: this.svgIcon.ErrorToast,
      info: this.svgIcon.Info,
      warning: this.svgIcon.WarningSvg,
    }[type];
}
}
