import { ModuleWithProviders, NgModule } from '@angular/core';
import { BottomSheetService, IVIOptions, VIModule, WindowService } from '@ts-core/angular';
import { BottomSheetModule } from './bottomSheet/BottomSheetModule';
import { NotificationModule } from './notification/NotificationModule';
import { WindowModule } from './window/WindowModule';
import { MenuTriggerForDirective } from './directive/MenuTriggerForDirective';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageSelectorComponent } from './component/language/language-selector/language-selector.component';
import { MenuListComponent } from './component/menu-list/menu-list.component';
import { SelectListComponent } from './component/select-list/select-list.component';
import { TabGroupComponent } from './component/tab-group/tab-group.component';

import { CdkTablePaginableComponent } from './component/cdk-table/cdk-table-paginable/cdk-table-paginable.component';
import { CdkTableFilterableComponent } from './component/cdk-table/cdk-table-filterable/cdk-table-filterable.component';
import { CdkTablePaginableBookmarkComponent } from './component/cdk-table/cdk-table-paginable-bookmark/cdk-table-paginable-bookmark.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { CdkTableCellValuePipe } from './component/cdk-table/cell/CdkTableCellValuePipe';
import { CdkTableCellValuePipePure } from './component/cdk-table/cell/CdkTableCellValuePipePure';
import { CdkTableCellClassNamePipe } from './component/cdk-table/cell/CdkTableCellClassNamePipe';
import { CdkTableCellStyleNamePipe } from './component/cdk-table/cell/CdkTableCellStyleNamePipe';
import { CdkTableColumnStyleNamePipe } from './component/cdk-table/column/CdkTableColumnStyleNamePipe';
import { CdkTableColumnClassNamePipe } from './component/cdk-table/column/CdkTableColumnClassNamePipe';
import { CdkTableRowClassNamePipe } from './component/cdk-table/row/CdkTableRowClassNamePipe';
import { CdkTableRowStyleNamePipe } from './component/cdk-table/row/CdkTableRowStyleNamePipe';
import { LanguageMatPaginatorIntl } from './language/LanguageMatPaginatorIntl';
import { BootstrapBreakpointService } from './service/BootstrapBreakpointService';
import { PortalService } from './service/PortalService';
import { LanguageService } from '@ts-core/frontend';
import * as _ from 'lodash';

let declarations = [
    CdkTableCellValuePipe,
    CdkTableCellValuePipePure,
    CdkTableCellClassNamePipe,
    CdkTableCellStyleNamePipe,
    CdkTableColumnClassNamePipe,
    CdkTableColumnStyleNamePipe,
    CdkTableRowStyleNamePipe,
    CdkTableRowClassNamePipe,

    TabGroupComponent,
    MenuListComponent,
    SelectListComponent,
    LanguageSelectorComponent,

    CdkTablePaginableComponent,
    CdkTableFilterableComponent,
    CdkTablePaginableBookmarkComponent,

    MenuTriggerForDirective
];

@NgModule({
    imports: [
        VIModule,
        WindowModule,
        BottomSheetModule,
        NotificationModule,

        CommonModule,
        FormsModule,
        MatTabsModule,
        MatListModule,
        MatMenuModule,
        MatSelectModule,
        MatButtonModule,
        MatSortModule,
        MatTableModule,
        MatPaginatorModule,
        MatProgressBarModule
    ],
    exports: [VIModule, WindowModule, BottomSheetModule, NotificationModule, ...declarations],
    declarations
})
export class VIMatModule {
    // --------------------------------------------------------------------------
    //
    // 	Static Methods
    //
    // --------------------------------------------------------------------------

    public static forRoot(options?: IVIOptions): ModuleWithProviders<VIMatModule> {
        return {
            ngModule: VIMatModule,
            providers: [
                {
                    provide: MatPaginatorIntl,
                    deps: [LanguageService],
                    useClass: LanguageMatPaginatorIntl
                },
                {
                    provide: PortalService,
                    deps: [WindowService, BottomSheetService, BootstrapBreakpointService],
                    useClass: PortalService
                },

                ...VIModule.forRoot(options).providers,

                ...WindowModule.forRoot().providers,
                ...BottomSheetModule.forRoot().providers,
                ...NotificationModule.forRoot().providers
            ]
        };
    }
}
