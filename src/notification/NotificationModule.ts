import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LanguageService } from '@ts-core/frontend';
import { LanguageModule } from '@ts-core/angular';
import { NotificationBaseComponent } from './component/NotificationBaseComponent';
import { NotificationComponent } from './component/notification/notification.component';
import { NotificationFactory } from './NotificationFactory';
import { NotificationService } from './NotificationService';

const IMPORTS = [CommonModule, FormsModule, MatDialogModule, MatButtonModule, LanguageModule];
const DECLARATIONS = [NotificationComponent];

const EXPORTS = [...DECLARATIONS];
@NgModule({
    imports: IMPORTS,
    declarations: DECLARATIONS,
    exports: EXPORTS,
    providers: [
        {
            provide: NotificationService,
            deps: [MatDialog, LanguageService],
            useFactory: notificationServiceFactory
        }
    ]
})
export class NotificationModule {}

export function notificationServiceFactory(dialog: MatDialog, language: LanguageService): NotificationService {
    let item = new NotificationService(dialog, language);
    item.factory = new NotificationFactory(NotificationBaseComponent);
    item.questionComponent = NotificationComponent;
    return item;
}
