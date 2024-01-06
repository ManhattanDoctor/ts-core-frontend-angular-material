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

    protected isOpenAsWindow(isOpenAsWindowIfBottomOccupied?: boolean): boolean {
        if (this.breakpoint.isUp(BootstrapBreakpoint.SM)) {
            return true;
        }
        return isOpenAsWindowIfBottomOccupied ? !_.isNil(this.sheet.window) : false;
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public open<U extends IWindowContent<T>, T>(component: ClassType<U>, config: IWindowConfig<T>, isOpenAsWindowIfBottomOccupied?: boolean): U {
        return this.isOpenAsWindow(isOpenAsWindowIfBottomOccupied) ? this.windows.open(component, config) : this.sheet.open(component, config);
    }

    public info(
        translationId?: string,
        translation?: any,
        questionOptions?: IQuestionOptions,
        configOptions?: WindowConfigOptions,
        isOpenAsWindowIfBottomOccupied?: boolean
    ): IQuestion {
        return this.isOpenAsWindow(isOpenAsWindowIfBottomOccupied)
            ? this.windows.info(translationId, translation, questionOptions, configOptions)
            : this.sheet.info(translationId, translation, questionOptions, configOptions);
    }

    public question(
        translationId?: string,
        translation?: any,
        questionOptions?: IQuestionOptions,
        configOptions?: WindowConfigOptions,
        isOpenAsWindowIfBottomOccupied?: boolean
    ): IQuestion {
        return this.isOpenAsWindow(isOpenAsWindowIfBottomOccupied)
            ? this.windows.question(translationId, translation, questionOptions, configOptions)
            : this.sheet.question(translationId, translation, questionOptions, configOptions);
    }

    public setOnTop<T>(value: WindowId<T>, isOpenAsWindowIfBottomOccupied?: boolean): boolean {
        return this.isOpenAsWindow(isOpenAsWindowIfBottomOccupied) ? this.windows.setOnTop(value) : false;
    }

    public get<T>(value: WindowId<T>): IWindowContent<T> {
        let item = this.windows.get(value);
        return !_.isNil(item) ? item : this.sheet.get(value);
    }

    public has<T>(value: WindowId<T>): boolean {
        return !_.isNil(this.get(value));
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
