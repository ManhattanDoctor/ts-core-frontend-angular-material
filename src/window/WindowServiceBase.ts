import { ObservableData, ClassType, Destroyable } from '@ts-core/common';
import { LanguageService } from '@ts-core/frontend';
import { Observable, Subject } from 'rxjs';
import {
    CookieService,
    IQuestion,
    IQuestionOptions,
    IWindow,
    IWindowConfig,
    IWindowContent,
    QuestionManager,
    QuestionMode,
    ViewUtil,
    WindowAlign,
    WindowConfig,
    WindowConfigOptions,
    WindowEvent,
    WindowId,
    WindowService,
    WindowServiceEvent
} from '@ts-core/angular';
import * as _ from 'lodash';

export abstract class WindowServiceBase extends WindowService {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // ---------------------------------------------------------------------------

    public gapX: number;
    public gapY: number;

    public minWidth: number;
    public minHeight: number;

    public paddingTop: number;
    public paddingLeft: number;
    public paddingRight: number;
    public paddingBottom: number;

    public autoFocus: string;
    public delayFocusTrap: boolean;

    public verticalAlign: WindowAlign;
    public horizontalAlign: WindowAlign;

    public topZIndex: number;
    public isNeedCheckPositionAfterOpen: boolean;

    protected language: LanguageService;
    protected observer: Subject<ObservableData<WindowServiceEvent, IWindow>>;
    protected properties: WindowPropertiesManager;

    protected _windows: Map<IWindowConfig, IWindowContent>;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(language: LanguageService, cookies: CookieService) {
        super();
        this.language = language;

        this._windows = new Map();
        this.observer = new Subject();
        this.properties = new WindowPropertiesManager(cookies);

        this.topZIndex = 1000;
        this.autoFocus = 'dialog';
        this.verticalAlign = this.horizontalAlign = WindowAlign.CENTER;
        this.delayFocusTrap = true;
        this.isNeedCheckPositionAfterOpen = true;

        this.gapX = this.gapY = 25;
        this.minWidth = this.minHeight = 100;
        this.paddingTop = this.paddingLeft = this.paddingRight = this.paddingBottom = 25;
    }

    // --------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    // --------------------------------------------------------------------------

    protected updateTop(): void {
        let zIndex = 0;
        let topWindow: IWindow = null;

        let windows = this.windowsGet();
        for (let window of windows) {
            if (_.isNil(window) || _.isNil(window.container)) {
                continue;
            }
            let index = this.zIndexGet(window);
            if (zIndex >= index) {
                continue;
            }
            zIndex = index;
            topWindow = window;
        }

        if (_.isNil(topWindow) || topWindow.isOnTop) {
            return;
        }
        topWindow.isOnTop = true;
        this.observer.next(new ObservableData(WindowServiceEvent.SETTED_ON_TOP, topWindow));
    }

    protected setWindowOnTop(topWindow: IWindow): void {
        let currentIndex = this.topZIndex - 2;
        let windows = this.windowsGet();
        for (let window of windows) {
            if (_.isNil(window) || _.isNil(window.container)) {
                continue;
            }
            window.isOnTop = window === topWindow;

            let zIndex = window.isOnTop ? this.topZIndex : currentIndex--;
            this.zIndexSet(window, zIndex);
        }

        this.windowsArray.sort(this.zIndexSortFunction);
        this.observer.next(new ObservableData(WindowServiceEvent.SETTED_ON_TOP, topWindow));
    }

    protected checkPosition<T>(item: IWindow<T>): void {
        while (this.hasSamePosition(item)) {
            item.move(item.getX() + this.gapX, item.getY() + this.gapY);
        }
    }

    protected hasSamePosition<T>(window: IWindow<T>): boolean {
        let x = window.getX();
        let y = window.getY();
        return this.windowsArray.some(item => item !== window && x === item.getX() && y === item.getY());
    }

    protected windowsGet(): Array<IWindow> {
        return this.windowsArray;
    }

    protected zIndexGet(window: IWindow): number {
        return !_.isNil(window) && !_.isNil(window.container) ? parseInt(ViewUtil.getStyle(window.container.parentElement, 'zIndex'), 10) : -1;
    }

    protected zIndexSet(window: IWindow, index: number): void {
        if (_.isNil(window)) {
            return;
        }
        if (!_.isNil(window.wrapper)) {
            ViewUtil.setStyle(window.wrapper, 'zIndex', index);
        }
        if (!_.isNil(window.backdrop)) {
            ViewUtil.setStyle(window.backdrop, 'zIndex', index);
        }
    }

    protected zIndexSortFunction = (first: IWindow, second: IWindow): number => {
        return this.zIndexGet(first) > this.zIndexGet(second) ? -1 : 1;
    };

    // --------------------------------------------------------------------------
    //
    // 	Setters Methods
    //
    // --------------------------------------------------------------------------

    protected add<T>(config: IWindowConfig<T>, content: IWindowContent<T>): void {
        this._windows.set(config, content);
        this.observer.next(new ObservableData(WindowServiceEvent.OPENED, content.window));
    }

    protected remove<T>(config: IWindowConfig<T>): void {
        let window = this._windows.get(config);
        if (_.isNil(window)) {
            return null;
        }

        window.close();
        this._windows.delete(config);
        this.observer.next(new ObservableData(WindowServiceEvent.CLOSED, window.window));
    }

    protected getById<T>(id: string): IWindow<T> {
        let item = _.find(Array.from(this._windows.values()), item => item.config.id === id);
        return !_.isNil(item) ? item.window : null;
    }

    protected setDefaultProperties<T>(config: IWindowConfig<T>): void {
        if (_.isNil(config.delayFocusTrap)) {
            config.delayFocusTrap = this.delayFocusTrap;
        }
        if (_.isNil(config.autoFocus)) {
            config.autoFocus = this.autoFocus;
        }
        if (_.isNil(config.verticalAlign)) {
            config.verticalAlign = this.verticalAlign;
        }
        if (_.isNil(config.horizontalAlign)) {
            config.horizontalAlign = this.horizontalAlign;
        }
        if (_.isNaN(config.defaultMinWidth)) {
            config.defaultMinWidth = this.minWidth;
        }
        if (_.isNaN(config.defaultMinHeight)) {
            config.defaultMinHeight = this.minHeight;
        }
        if (_.isNaN(config.paddingTop)) {
            config.paddingTop = this.paddingTop;
        }
        if (_.isNaN(config.paddingLeft)) {
            config.paddingLeft = this.paddingLeft;
        }
        if (_.isNaN(config.paddingRight)) {
            config.paddingRight = this.paddingRight;
        }
        if (_.isNaN(config.paddingBottom)) {
            config.paddingBottom = this.paddingBottom;
        }

        config['hasBackdrop'] = config.isModal;
        config['disableClose'] = config.isDisableClose;

        if (!_.isNil(config.propertiesId)) {
            this.properties.load(config.propertiesId, config);
        }
        if (config instanceof WindowConfig) {
            config.setDefaultProperties();
        }
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public open<U extends IWindowContent<T>, T>(component: ClassType<U>, config: IWindowConfig<T>): U {
        let window: IWindow<T> = null;
        let content: IWindowContent<T> = null;
        if (!_.isNil(config.id)) {
            window = this.getById<T>(config.id);
            if (!_.isNil(window)) {
                content = window.content;
                return content as U;
            }
        }

        this.setDefaultProperties(config);

        let info = this.openWindow<U, T>(component, config);
        window = info.window;
        content = info.content;

        this.observer.next(new ObservableData(WindowServiceEvent.OPEN_STARTED, window));
        let subscription = window.events.subscribe(event => {
            switch (event) {
                case WindowEvent.OPENED:
                    this.add(config, content);
                    this.setWindowOnTop(window);
                    if (this.isNeedCheckPositionAfterOpen) {
                        this.checkPosition(window);
                    }
                    this.observer.next(new ObservableData(WindowServiceEvent.OPEN_FINISHED, window));
                    break;

                case WindowEvent.CLOSED:
                    subscription.unsubscribe();
                    this.remove(config);
                    if (window.isOnTop && this.windows.size > 0) {
                        this.updateTop();
                    }
                    break;

                case WindowEvent.RESIZED:
                    if (!_.isNil(config.propertiesId)) {
                        this.properties.save(config.propertiesId, window);
                    }
                    break;

                case WindowEvent.SET_ON_TOP:
                    this.setWindowOnTop(window);
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

    public close<T>(value: WindowId<T>): void {
        let item = this.get(value);
        if (!_.isNil(item)) {
            item.close();
        }
    }

    public closeAll(): void {
        this.windowsArray.forEach(item => item.close());
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.closeAll();
        if (!_.isNil(this.observer)) {
            this.observer.complete();
            this.observer = null;
        }
        if (!_.isNil(this.properties)) {
            this.properties.destroy();
            this.properties = null;
        }
        this.language = null;
        this._windows = null;
    }

    protected abstract openWindow<U extends IWindowContent<T>, T>(component: ClassType<U>, config: IWindowConfig<T>): IWindowInfo<T>;

    protected abstract openInfo<T>(config: IWindowConfig<T>): IQuestion;

    protected abstract openQuestion<T>(config: IWindowConfig<T>): IQuestion;

    // --------------------------------------------------------------------------
    //
    // 	Additional Methods
    //
    // --------------------------------------------------------------------------

    public info(translationId?: string, translation?: any, questionOptions?: IQuestionOptions, configOptions?: WindowConfigOptions): IQuestion {
        let text = this.language.translate(translationId, translation);
        let config: IWindowConfig<QuestionManager> = _.assign(new WindowConfig(true, false, 450), configOptions);
        config.data = new QuestionManager(_.assign(questionOptions, { mode: QuestionMode.INFO, text }));
        return this.openQuestion(config);
    }

    public question(translationId?: string, translation?: any, questionOptions?: IQuestionOptions, configOptions?: WindowConfigOptions): IQuestion {
        let text = this.language.translate(translationId, translation);
        let config: IWindowConfig<QuestionManager> = _.assign(new WindowConfig(true, false, 450), configOptions);
        config.data = new QuestionManager(_.assign(questionOptions, { mode: QuestionMode.QUESTION, text }));
        return this.openQuestion(config);
    }

    // --------------------------------------------------------------------------
    //
    // 	Private Properties
    //
    // --------------------------------------------------------------------------

    private get windowsArray(): Array<IWindow> {
        return Array.from(this.windows.values()).map(item => item.window);
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public get events(): Observable<ObservableData<WindowServiceEvent, IWindow>> {
        return this.observer.asObservable();
    }

    public get windows(): Map<IWindowConfig, IWindowContent> {
        return this._windows;
    }
}

class WindowPropertiesManager extends Destroyable {
    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(private cookies: CookieService) {
        super();
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public load<T>(name: string, config: IWindowConfig<T>): void {
        let item = this.cookies.getObject(`${name}Window`) as IWindowConfig<T>;
        if (_.isNil(item)) {
            return;
        }
        if (item.hasOwnProperty('width')) {
            config.defaultWidth = item.width as any;
        }
        if (item.hasOwnProperty('height')) {
            config.defaultHeight = item.height as any;
        }
    }

    public save(name: string, window: IWindow): void {
        this.cookies.putObject(name + 'Window', { width: window.getWidth(), height: window.getHeight() });
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.cookies = null;
    }
}

export interface IWindowInfo<T> {
    window: IWindow<T>;
    content: IWindowContent<T>;
}
