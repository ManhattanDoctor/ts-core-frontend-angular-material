import { BottomSheetService, IQuestion, IQuestionOptions, IWindowConfig, IWindowContent, WindowConfigOptions, WindowId, WindowService } from '@ts-core/angular';
import { ClassType, DestroyableContainer } from '@ts-core/common';
import { BootstrapBreakpoint, BootstrapBreakpointService } from './BootstrapBreakpointService';
import * as _ from 'lodash';

export class PortalService extends DestroyableContainer {
    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(protected windows: WindowService, protected sheet: BottomSheetService, protected breakpoint: BootstrapBreakpointService) {
        super();
    }

    //--------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    //--------------------------------------------------------------------------

    protected isOpenAsWindow(): boolean {
        return this.breakpoint.isUp(BootstrapBreakpoint.SM);
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public open<U extends IWindowContent<T>, T>(component: ClassType<U>, config: IWindowConfig<T>): U {
        return this.isOpenAsWindow() ? this.windows.open(component, config) : this.sheet.open(component, config);
    }

    public info(translationId?: string, translation?: any, questionOptions?: IQuestionOptions, configOptions?: WindowConfigOptions): IQuestion {
        return this.isOpenAsWindow()
            ? this.windows.info(translationId, translation, questionOptions, configOptions)
            : this.sheet.info(translationId, translation, questionOptions, configOptions);
    }

    public question(translationId?: string, translation?: any, questionOptions?: IQuestionOptions, configOptions?: WindowConfigOptions): IQuestion {
        return this.isOpenAsWindow()
            ? this.windows.question(translationId, translation, questionOptions, configOptions)
            : this.sheet.question(translationId, translation, questionOptions, configOptions);
    }

    public setOnTop<T>(value: WindowId<T>): boolean {
        return this.isOpenAsWindow() ? this.windows.setOnTop(value) : false;
    }

    public close<T>(value: WindowId<T>): void {
        this.windows.close(value);
        this.sheet.close(value);
    }

    public closeAll(): void {
        this.windows.closeAll();
        this.sheet.closeAll();
    }
}
