import { ComponentType } from '@angular/cdk/portal';
import { MatBottomSheet, MatBottomSheetConfig, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ClassType } from '@ts-core/common';
import { ObservableData } from '@ts-core/common';
import { LanguageService } from '@ts-core/frontend';
import * as _ from 'lodash';
import { Observable, Subject } from 'rxjs';
import { WindowFactory } from '../window/WindowFactory';
import {
    QuestionManager,
    IQuestion,
    IQuestionOptions,
    QuestionMode,
    IWindowContent,
    IWindow,
    WindowServiceEvent,
    IWindowConfig,
    WindowConfig,
    WindowConfigOptions,
    BottomSheetService,
    WindowEvent,
    WindowId
} from '@ts-core/angular';
import { WindowQuestionComponent } from '../window/component/window-question/window-question.component';
import { BottomSheetBaseComponent } from './component/BottomSheetBaseComponent';
import { IWindowInfo } from '../window/WindowServiceBase';

export class BottomSheetServiceImpl extends BottomSheetService {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    public factory: WindowFactory<IWindow>;
    public questionComponent: ComponentType<IWindowContent>;

    protected _window: IWindow;

    protected dialog: MatBottomSheet;
    protected language: LanguageService;

    private observer: Subject<ObservableData<WindowServiceEvent, IWindow>>;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(language: LanguageService, dialog: MatBottomSheet) {
        super();
        this.dialog = dialog;
        this.language = language;
        this.observer = new Subject();

        this.factory = new WindowFactory(BottomSheetBaseComponent);
        this.questionComponent = WindowQuestionComponent;
    }

    // --------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected setDefaultProperties<T>(config: IWindowConfig<T>): void {
        config['hasBackdrop'] = config.isModal;
        config['disableClose'] = config.isDisableClose;
    }

    protected openWindow<U extends IWindowContent<T>, T>(component: ClassType<U>, config: IWindowConfig<T>): IWindowInfo<T> {
        let reference: MatBottomSheetRef<U> = this.dialog.open(component, config as MatBottomSheetConfig<T>);
        let window = this.factory.create({ config, reference: reference as any, overlay: reference['_ref'].overlayRef });
        return { window, content: reference.instance };
    }

    protected getById<T>(id: string): IWindow<T> {
        return !_.isNil(this.window) && this.window.config.id === id ? this.window : null;
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public open<U extends IWindowContent<T>, T>(component: ClassType<U>, config: IWindowConfig<T>): U {
        let window: IWindow<T> = null;
        let content: IWindowContent<T> = null;

        this.setDefaultProperties(config);

        let info = this.openWindow<U, T>(component, config);
        window = info.window;
        content = info.content;

        this.observer.next(new ObservableData(WindowServiceEvent.OPEN_STARTED, window));
        let subscription = window.events.subscribe(event => {
            switch (event) {
                case WindowEvent.OPENED:
                    this._window = window;
                    this.observer.next(new ObservableData(WindowServiceEvent.OPENED, window));
                    this.observer.next(new ObservableData(WindowServiceEvent.OPEN_FINISHED, window));
                    break;

                case WindowEvent.CLOSED:
                    subscription.unsubscribe();
                    this._window = null;
                    this.observer.next(new ObservableData(WindowServiceEvent.CLOSED, window));
                    break;
            }
        });
        return content as U;
    }

    public get<T>(value: WindowId<T>): IWindowContent<T> {
        let id = value.toString();
        if (_.isObject(value)) {
            id = value.id;
        }
        if (_.isNil(id)) {
            return null;
        }
        let window = this.getById<T>(id);
        return !_.isNil(window) ? window.content : null;
    }

    public has<T>(value: WindowId<T>): boolean {
        return !_.isNil(this.get(value));
    }

    public setOnTop<T>(value: WindowId<T>): boolean {
        let content = this.get(value);
        if (_.isNil(content)) {
            return false;
        }
        content.window.setOnTop();
        return true;
    }

    public close(): void {
        if (!_.isNil(this.window)) {
            this.window.close();
        }
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.close();

        if (!_.isNil(this.observer)) {
            this.observer.complete();
            this.observer = null;
        }

        this._window = null;

        this.dialog = null;
        this.factory = null;
        this.language = null;
        this.questionComponent = null;
    }

    // --------------------------------------------------------------------------
    //
    // 	Additional Methods
    //
    // --------------------------------------------------------------------------

    public info(translationId?: string, translation?: any, questionOptions?: IQuestionOptions, configOptions?: WindowConfigOptions): IQuestion {
        let text = this.language.translate(translationId, translation);
        let config: IWindowConfig<QuestionManager> = _.assign(new WindowConfig(true, false, 450), configOptions);
        config.data = new QuestionManager(_.assign(questionOptions, { mode: QuestionMode.INFO, text }));
        return this.open(this.questionComponent, config).config.data;
    }

    public question(translationId?: string, translation?: any, questionOptions?: IQuestionOptions, configOptions?: WindowConfigOptions): IQuestion {
        let text = this.language.translate(translationId, translation);
        let config: WindowConfig<QuestionManager> = _.assign(new WindowConfig(true, false, 450), configOptions);
        config.data = new QuestionManager(_.assign(questionOptions, { mode: QuestionMode.QUESTION, text }));
        return this.open(this.questionComponent, config).config.data;
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public get window(): IWindow {
        return this._window;
    }

    public get events(): Observable<ObservableData<WindowServiceEvent, IWindow>> {
        return this.observer.asObservable();
    }
}
