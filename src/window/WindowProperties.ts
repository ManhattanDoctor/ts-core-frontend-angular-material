import { MatDialogRef } from '@angular/material/dialog';
import { OverlayRef } from '@angular/cdk/overlay';
import { IWindowConfig, IWindowContent } from '@ts-core/angular';

export interface WindowProperties<T = any> {
    config?: IWindowConfig<T>;
    overlay?: OverlayRef;
    reference?: MatDialogRef<IWindowContent<T>>;
}
