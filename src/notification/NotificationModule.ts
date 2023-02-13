import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LanguageService } from '@ts-core/frontend';
import { LanguageModule, NotificationService } from '@ts-core/angular';
import { NotificationComponent } from './component/notification/notification.component';
import { NotificationServiceImpl } from './NotificationServiceImpl';

const IMPORTS = [CommonModule, FormsModule, MatDialogModule, MatButtonModule, LanguageModule];
const DECLARATIONS = [NotificationComponent];
const PROVIDERS = [
    {
        provide: NotificationService,
        deps: [LanguageService, MatDialog],
        useFactory: (language: LanguageService, dialog: MatDialog) => new NotificationServiceImpl(language, dialog)
    }
];
const EXPORTS = [...DECLARATIONS];
@NgModule({
    imports: IMPORTS,
    declarations: DECLARATIONS,
    exports: EXPORTS,
    providers: PROVIDERS
})
export class NotificationModule {}
