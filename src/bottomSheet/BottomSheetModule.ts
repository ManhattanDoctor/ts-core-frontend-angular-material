import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LanguageModule } from '@ts-core/angular';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

const IMPORTS = [CommonModule, FormsModule, MatBottomSheetModule, MatButtonModule, LanguageModule];
const DECLARATIONS = [];
const EXPORTS = [...DECLARATIONS];
@NgModule({
    imports: IMPORTS,
    declarations: DECLARATIONS,
    exports: EXPORTS
})
export class BottomSheetModule {}
