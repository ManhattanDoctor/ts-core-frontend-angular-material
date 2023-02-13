import { OverlayRef } from '@angular/cdk/overlay';
import { MatDialogRef } from '@angular/material/dialog';
import { INotificationContent, INotificationConfig } from '@ts-core/angular';

export interface NotificationProperties<T = any> {
    config?: INotificationConfig<T>;
    overlay?: OverlayRef;
    reference?: MatDialogRef<INotificationContent<T>>;
}
