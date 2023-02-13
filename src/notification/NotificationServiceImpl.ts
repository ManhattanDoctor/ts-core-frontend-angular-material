import { ComponentType } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';
import { ClassType, IDestroyable, ObservableData } from '@ts-core/common';
import { ArrayUtil, DateUtil, ObjectUtil } from '@ts-core/common';
import { LanguageService } from '@ts-core/frontend';
import { Observable, Subject } from 'rxjs';
import {
    QuestionManager,
    IQuestion,
    IQuestionOptions,
    QuestionMode,
    WindowEvent,
    WindowAlign,
    NotificationService,
    INotification,
    INotificationContent,
    NotificationConfig,
    NotificationServiceEvent,
    INotificationConfig,
    NotificationEvent,
    NotificationConfigOptions,
    NotificationId
} from '@ts-core/angular';
import { NotificationFactory } from './NotificationFactory';
import { NotificationBaseComponent } from './component/NotificationBaseComponent';
import { NotificationComponent } from './component/notification/notification.component';
import * as _ from 'lodash';

export class NotificationServiceImpl extends NotificationService {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    public factory: NotificationFactory<INotification>;
    public questionComponent: ComponentType<INotificationContent>;

    public gapY: number;
    public closeDuration: number;

    public minWidth: number;
    public minHeight: number;

    public paddingTop: number;
    public paddingLeft: number;
    public paddingRight: number;
    public paddingBottom: number;

    public verticalAlign: WindowAlign;
    public horizontalAlign: WindowAlign;

    protected dialog: MatDialog;
    protected language: LanguageService;
    protected observer: Subject<ObservableData<NotificationServiceEvent, INotification | INotificationConfig>>;

    protected _configs: Array<INotificationConfig>;
    protected _closedConfigs: Array<INotificationConfig>;
    protected _notifications: Map<INotificationConfig, INotificationContent>;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(language: LanguageService, dialog: MatDialog) {
        super();

        this._configs = [];
        this._closedConfigs = [];
        this._notifications = new Map();

        this.dialog = dialog;
        this.language = language;
        this.observer = new Subject();

        this.factory = new NotificationFactory(NotificationBaseComponent);
        this.questionComponent = NotificationComponent;

        this.verticalAlign = WindowAlign.START;
        this.horizontalAlign = WindowAlign.END;

        this.gapY = 25;
        this.minWidth = this.minHeight = 25;
        this.paddingTop = this.paddingLeft = this.paddingRight = this.paddingBottom = 25;
        this.closeDuration = 10 * DateUtil.MILLISECONDS_SECOND;
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public open<U extends INotificationContent<T>, T>(component: ClassType<U>, config: INotificationConfig<T>): U {
        let notification: INotification<T> = null;
        let content: INotificationContent<T> = null;
        if (!_.isNil(config.id)) {
            notification = this.getById<T>(config.id);
            if (!_.isNil(notification)) {
                content = notification.content;
                return content as U;
            }
        }

        this.setDefaultProperties(config);

        let info = this.openNotification<U, T>(component, config);
        notification = info.notification;
        content = info.content;

        let subscription = notification.events.subscribe(event => {
            switch (event) {
                case WindowEvent.OPENED:
                    this.add(config, content);
                    this.checkPosition(notification);
                    if (!_.isNil(config.sound)) {
                        // Assets.playSound(config.sound);
                    }
                    break;

                case WindowEvent.CLOSED:
                    subscription.unsubscribe();
                    this.close(config);
                    break;

                case NotificationEvent.REMOVED:
                    subscription.unsubscribe();
                    this.remove(config);
                    break;
            }
        });
        return content as U;
    }

    // --------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    // --------------------------------------------------------------------------

    protected getById<T>(id: string): INotification<T> {
        let item = _.find(Array.from(this._notifications.values()), item => item.config.id === id);
        return !_.isNil(item) ? item.notification : null;
    }

    protected setDefaultProperties<T>(config: INotificationConfig<T>): void {
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
        if (_.isNaN(config.closeDuration)) {
            config.closeDuration = this.closeDuration;
        }
        if (_.isNil(config.verticalAlign)) {
            config.verticalAlign = this.verticalAlign;
        }
        if (_.isNil(config.horizontalAlign)) {
            config.horizontalAlign = this.horizontalAlign;
        }

        config.isModal = config['hasBackdrop'] = false;

        if (config instanceof NotificationConfig) {
            config.setDefaultProperties();
        }
    }

    protected checkPosition<T>(item: INotification<T>): void {
        let previous = this.getPrevious(item);
        if (!_.isNil(previous)) {
            item.setY(previous.getY() + previous.getHeight() + this.gapY);
        }
    }

    protected getPrevious<T>(value: INotification<T>): INotification {
        if (this.notifications.size === 0) {
            return null;
        }

        let items = Array.from(this.notifications.values());
        for (let i = 0; i < items.length; i++) {
            if (items[i].notification === value) {
                if (i === 0) {
                    return null;
                }
                return items[i - 1].notification;
            }
        }
        return null;
    }

    protected openNotification<U extends INotificationContent<T>, T>(component: ClassType<U>, config: INotificationConfig<T>): INotificationInfo<T> {
        let reference = this.dialog.open<INotificationContent<T>>(component, config);
        let notification = this.factory.create({ config, reference, overlay: reference['_ref'].overlayRef });
        return { notification, content: reference.componentInstance };
    }

    // --------------------------------------------------------------------------
    //
    // 	Setters Methods
    //
    // --------------------------------------------------------------------------

    private add<T>(config: INotificationConfig<T>, content: INotificationContent<T>): void {
        this._configs.push(config);
        this.observer.next(new ObservableData(NotificationServiceEvent.ADDED, config));

        this._notifications.set(config, content);
        this.observer.next(new ObservableData(NotificationServiceEvent.OPENED, content.notification));
    }

    // --------------------------------------------------------------------------
    //
    // 	Help Methods
    //
    // --------------------------------------------------------------------------

    public get<T>(value: NotificationId<T>): INotificationConfig<T> {
        if (_.isNil(value)) {
            return null;
        }
        if (value instanceof NotificationConfig) {
            return value;
        }

        let id = value.toString();
        if (ObjectUtil.instanceOf<NotificationConfigOptions>(value, ['id'])) {
            id = value.id;
        }
        for (let item of this.configs) {
            if (item.id === id) {
                return item;
            }
        }
        return null;
    }

    public has<T>(value: NotificationId<T>): boolean {
        return !_.isNil(this.get(value));
    }

    public remove<T>(value: NotificationId<T>): void {
        let config = this.get(value);
        if (_.isNil(config)) {
            return;
        }

        this.close(config);
        ArrayUtil.remove(this._configs, config);
        ArrayUtil.remove(this._closedConfigs, config);
        this.observer.next(new ObservableData(NotificationServiceEvent.REMOVED, config));

        if (IDestroyable.instanceOf(config)) {
            config.destroy();
        }
    }

    public closeAll(): void {
        this.configs.forEach(item => this.remove(item));
    }

    public close<T>(value: NotificationId<T>): INotification<T> {
        let config = this.get(value);
        if (_.isNil(config)) {
            return null;
        }

        let notification = this._notifications.get(config);
        if (_.isNil(notification)) {
            return null;
        }

        notification.close();
        this._notifications.delete(config);

        this._closedConfigs.push(config);
        this.observer.next(new ObservableData(NotificationServiceEvent.CLOSED, notification.notification));
        return notification.notification;
    }

    public info(translationId?: string, translation?: any, questionOptions?: IQuestionOptions, configOptions?: NotificationConfigOptions): IQuestion {
        let text = this.language.translate(translationId, translation);
        let data = new QuestionManager(_.assign(questionOptions, { mode: QuestionMode.INFO, text }));
        let config = _.assign(new NotificationConfig(data), configOptions);
        return this.open(this.questionComponent, config).config.data;
    }

    public question(translationId?: string, translation?: any, questionOptions?: IQuestionOptions, configOptions?: NotificationConfigOptions): IQuestion {
        let text = this.language.translate(translationId, translation);
        let data = new QuestionManager(_.assign(questionOptions, { mode: QuestionMode.QUESTION, text }));
        let config = _.assign(new NotificationConfig(data), configOptions);
        return this.open(this.questionComponent, config).config.data;
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public get events(): Observable<ObservableData<NotificationServiceEvent, INotificationConfig | INotification>> {
        return this.observer.asObservable();
    }

    public get configs(): Array<INotificationConfig> {
        return this._configs;
    }

    public get closedConfigs(): Array<INotificationConfig> {
        return this._closedConfigs;
    }

    public get notifications(): Map<INotificationConfig, INotificationContent> {
        return this._notifications;
    }
}

export interface INotificationInfo<T> {
    notification: INotification<T>;
    content: INotificationContent<T>;
}
