import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LanguageService } from '@ts-core/frontend';
import { LanguageModule, NotificationService } from '@ts-core/angular';
import { NotificationComponent } from './component/notification/notification.component';
import { NotificationServiceImpl } from './NotificationServiceImpl';

let declarations = [NotificationComponent];
@NgModule({
    imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, LanguageModule],
    exports: declarations,
    declarations
})
export class NotificationModule {
    // --------------------------------------------------------------------------
    //
    // 	Static Methods
    //
    // --------------------------------------------------------------------------

    public static forRoot(): ModuleWithProviders<NotificationModule> {
        return {
            ngModule: NotificationModule,
            providers: [
                {
                    provide: NotificationService,
                    deps: [LanguageService, MatDialog],
                    useFactory: notificationServiceFactory
                }
            ]
        };
    }
}
export function notificationServiceFactory(language: LanguageService, dialog: MatDialog): NotificationService {
    return new NotificationServiceImpl(language, dialog);
}
