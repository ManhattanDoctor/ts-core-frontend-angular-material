import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { BottomSheetService, LanguageModule } from '@ts-core/angular';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { BottomSheetServiceImpl } from './BottomSheetServiceImpl';
import { LanguageService } from '@ts-core/frontend';

let declarations = [];
@NgModule({
    imports: [CommonModule, FormsModule, MatBottomSheetModule, MatButtonModule, LanguageModule],
    exports: declarations,
    declarations
})
export class BottomSheetModule {
    // --------------------------------------------------------------------------
    //
    // 	Static Methods
    //
    // --------------------------------------------------------------------------

    public static forRoot(): ModuleWithProviders<BottomSheetModule> {
        return {
            ngModule: BottomSheetModule,
            providers: [
                {
                    provide: BottomSheetService,
                    deps: [LanguageService, MatBottomSheet],
                    useFactory: bottomSheetServiceFactory
                }
            ]
        };
    }
}
export function bottomSheetServiceFactory(language: LanguageService, dialog: MatBottomSheet): BottomSheetService {
    return new BottomSheetServiceImpl(language, dialog);
}
