import { Directive, ElementRef, HostListener, Output } from '@angular/core';
import { DateUtil, Loadable, LoadableEvent, LoadableStatus, ObservableData } from '@ts-core/common';
import { filter, Observable } from 'rxjs';
import { ViewUtil } from '@ts-core/angular';
import { VoiceRecognitionService } from '../service/VoiceRecognitionService';
import * as _ from 'lodash';

@Directive({
    selector: '[vi-voice-recognition-button]',
    standalone: false
})
export class VoiceRecognitionButtonDirective extends Loadable<void> {
    //--------------------------------------------------------------------------
    //
    //	Properties
    //
    //--------------------------------------------------------------------------

    protected _timer: any;

    //--------------------------------------------------------------------------
    //
    //	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(
        private element: ElementRef,
        private recognition: VoiceRecognitionService
    ) {
        super();
        this.initialize();
    }

    //--------------------------------------------------------------------------
    //
    //	Private Methods
    //
    //--------------------------------------------------------------------------

    protected initialize(): void {
        this._status = LoadableStatus.LOADED;
        if (!this.isSupported) {
            ViewUtil.addClass(this.element, 'd-none');
        }
    }

    protected commitStatusChangedProperties(oldStatus: LoadableStatus, newStatus: LoadableStatus): void {
        super.commitStatusChangedProperties(oldStatus, newStatus);

        ViewUtil.toggleClass(this.element, 'text-base', this.isLoading);

        switch (newStatus) {
            case LoadableStatus.LOADING:
                this.observer.next(new ObservableData(LoadableEvent.STARTED));
                break;
            case LoadableStatus.LOADED:
                this.observer.next(new ObservableData(LoadableEvent.FINISHED));
                break;
        }
    }

    protected activate(): void {
        this.status = LoadableStatus.LOADING;
    }

    protected deactivate(): void {
        if (this.isNeedDeactivationDelay) {
            this.timer = setTimeout(this.deactivateHandler, this.delay);
        } else {
            this.deactivateHandler();
        }
    }

    //--------------------------------------------------------------------------
    //
    //	Public Methods
    //
    //--------------------------------------------------------------------------

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        if (this.isLoading) {
            this.recognition.stop();
        }
        super.destroy();
        this.timer = null;
        this.recognition = null;
    }

    //--------------------------------------------------------------------------
    //
    //	Event Handlers
    //
    //--------------------------------------------------------------------------

    @HostListener('click', ['$event'])
    protected clickHandler(event: MouseEvent): void {
        event.stopPropagation();
    }

    @HostListener('pointerup', ['$event'])
    protected pointerUpHandler(event: MouseEvent): void {
        this.recognition.stop();
        this.deactivate();
    }

    @HostListener('pointerleave')
    protected pointerLeaveHandler(): void {
        this.recognition.stop();
        this.deactivate();
    }

    @HostListener('pointerdown')
    protected pointerDownHandler(): void {
        this.recognition.start();
        this.activate();
    }

    protected deactivateHandler = (): void => {
        this.status = LoadableStatus.LOADED;
    };

    //--------------------------------------------------------------------------
    //
    //	Private Properties
    //
    //--------------------------------------------------------------------------

    protected get delay(): number {
        return DateUtil.MILLISECONDS_SECOND / 2;
    }

    protected get isDisabled(): boolean {
        return !this.isSupported || this.isLoading;
    }

    protected get isSupported(): boolean {
        return this.recognition.isSupported;
    }

    protected get isNeedDeactivationDelay(): boolean {
        return !this.recognition.isIntermediateResults;
    }

    protected get timer(): any {
        return this._timer;
    }
    protected set timer(value: any) {
        if (value === this._timer) {
            return;
        }
        clearTimeout(this._timer);
        this._timer = value;
    }

    //--------------------------------------------------------------------------
    //
    //	Public Properties
    //
    //--------------------------------------------------------------------------

    @Output()
    public get started(): Observable<void> {
        return super.started;
    }
    @Output()
    public get progress(): Observable<string> {
        return this.recognition.progress.pipe(filter(() => this.isLoading));
    }
    @Output()
    public get finished(): Observable<void> {
        return super.finished;
    }
}
