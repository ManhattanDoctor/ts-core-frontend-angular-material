import { NgModule } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LanguageModule, CookieModule, CookieService, WindowService, BottomSheetService } from '@ts-core/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WindowDragAreaDirective } from './component/WindowDragAreaDirective';
import { WindowQuestionComponent } from './component/window-question/window-question.component';
import { WindowCloseElementComponent } from './component/window-close-element/window-close-element.component';
import { WindowExpandElementComponent } from './component/window-expand-element/window-expand-element.component';
import { WindowResizeElementComponent } from './component/window-resize-element/window-resize-element.component';
import { WindowMinimizeElementComponent } from './component/window-minimize-element/window-minimize-element.component';
import { MatButtonModule } from '@angular/material/button';
import { WindowServiceImpl } from './WindowServiceImpl';
import { LanguageService } from '@ts-core/frontend';
import { BottomSheetModule } from '../bottomSheet/BottomSheetModule';

const IMPORTS = [CommonModule, FormsModule, MatButtonModule, MatDialogModule, CookieModule, LanguageModule, BottomSheetModule];
const DECLARATIONS = [
    WindowDragAreaDirective,
    WindowQuestionComponent,
    WindowCloseElementComponent,
    WindowExpandElementComponent,
    WindowResizeElementComponent,
    WindowMinimizeElementComponent
];
const PROVIDERS = [
    {
        provide: WindowService,
        deps: [LanguageService, CookieService, MatDialog, BottomSheetService],
        useFactory: (language: LanguageService, cookies: CookieService, dialog: MatDialog, sheet: BottomSheetService) =>
            new WindowServiceImpl(language, cookies, dialog, sheet)
    }
];
const EXPORTS = [...DECLARATIONS];

@NgModule({
    imports: IMPORTS,
    providers: PROVIDERS,
    declarations: DECLARATIONS,
    exports: EXPORTS
})
export class WindowModule {}
