import { MatDialogRef } from '@angular/material/dialog';
import { OverlayRef } from '@angular/cdk/overlay';
import { WindowConfig } from './WindowConfig';
import { IWindowContent } from '@ts-core/angular';

export interface WindowProperties<U = any> {
    reference?: MatDialogRef<IWindowContent<U>>;
    config?: WindowConfig;
    overlay?: OverlayRef;
}
