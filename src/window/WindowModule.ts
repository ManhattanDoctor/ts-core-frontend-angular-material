import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { LanguageModule, CookieModule } from '@ts-core/angular';
import { WindowService } from './WindowService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WindowDragAreaDirective } from './component/WindowDragAreaDirective';
import { WindowQuestionComponent } from './component/window-question/window-question.component';
import { WindowCloseElementComponent } from './component/window-close-element/window-close-element.component';
import { WindowExpandElementComponent } from './component/window-expand-element/window-expand-element.component';
import { WindowResizeElementComponent } from './component/window-resize-element/window-resize-element.component';
import { WindowMinimizeElementComponent } from './component/window-minimize-element/window-minimize-element.component';
import { MatButtonModule } from '@angular/material/button';

const IMPORTS = [CommonModule, FormsModule, MatButtonModule, MatDialogModule, CookieModule, LanguageModule];
const DECLARATIONS = [
    WindowDragAreaDirective,
    WindowQuestionComponent,
    WindowCloseElementComponent,
    WindowExpandElementComponent,
    WindowResizeElementComponent,
    WindowMinimizeElementComponent
];
const EXPORTS = [...DECLARATIONS];

@NgModule({
    imports: IMPORTS,
    declarations: DECLARATIONS,
    exports: EXPORTS
})
export class WindowModule {}
