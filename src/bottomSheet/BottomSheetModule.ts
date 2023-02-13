import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BottomSheetService, LanguageModule } from '@ts-core/angular';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { BottomSheetServiceImpl } from './BottomSheetServiceImpl';
import { LanguageService } from '@ts-core/frontend';

const IMPORTS = [CommonModule, FormsModule, MatBottomSheetModule, MatButtonModule, LanguageModule];
const DECLARATIONS = [];
const PROVIDERS = [
    {
        provide: BottomSheetService,
        deps: [LanguageService, MatBottomSheet],
        useFactory: (language: LanguageService, dialog: MatBottomSheet) => new BottomSheetServiceImpl(language, dialog)
    }
];
const EXPORTS = [...DECLARATIONS];
@NgModule({
    imports: IMPORTS,
    declarations: DECLARATIONS,
    providers: PROVIDERS,
    exports: EXPORTS
})
export class BottomSheetModule {}
