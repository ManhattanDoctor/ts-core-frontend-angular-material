import { ComponentType } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';
import { ClassType } from '@ts-core/common';
import { LanguageService } from '@ts-core/frontend';
import * as _ from 'lodash';
import { BottomSheetService, CookieService, IQuestion, IWindowConfig } from '@ts-core/angular';
import { WindowQuestionComponent } from './component/window-question/window-question.component';
import { WindowBaseComponent } from './component/WindowBaseComponent';
import { IWindowContent, IWindow } from '@ts-core/angular';
import { WindowFactory } from './WindowFactory';
import { IWindowInfo, WindowServiceBase } from './WindowServiceBase';

export class WindowServiceImpl extends WindowServiceBase {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    public factory: WindowFactory<IWindow>;
    public questionComponent: ComponentType<IWindowContent>;

    protected sheet: BottomSheetService;
    protected dialog: MatDialog;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(language: LanguageService, cookies: CookieService, dialog: MatDialog, sheet: BottomSheetService) {
        super(language, cookies);
        this.sheet = sheet;
        this.dialog = dialog;
        this.factory = new WindowFactory(WindowBaseComponent);
        this.questionComponent = WindowQuestionComponent;
    }

    // --------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected windowsGet(): Array<IWindow> {
        return [...super.windowsGet(), this.sheet.window];
    }

    protected openWindow<U extends IWindowContent<T>, T>(component: ClassType<U>, config: IWindowConfig<T>): IWindowInfo<T> {
        let reference = this.dialog.open<IWindowContent>(component, config);
        let window = this.factory.create({ config: config, reference, overlay: reference['_ref'].overlayRef });
        return { window, content: reference.componentInstance };
    }

    protected openInfo<T>(config: IWindowConfig<T>): IQuestion {
        return this.openQuestion(config);
    }

    protected openQuestion<T>(config: IWindowConfig<T>): IQuestion {
        return this.open(this.questionComponent, config).config.data;
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.dialog = null;
        this.factory = null;
        this.questionComponent = null;
    }
}
