import { Component, ElementRef } from '@angular/core';
import { ViewUtil, WindowEvent } from '@ts-core/angular';
import { WindowElement } from '../WindowElement';
import * as _ from 'lodash';

@Component({
    selector: 'vi-window-expand-element',
    styleUrl: 'window-expand-element.component.scss',
    template: '',
    standalone: false
})
export class WindowExpandElementComponent extends WindowElement {
    // --------------------------------------------------------------------------
    //
    // 	Constants
    //
    // --------------------------------------------------------------------------

    public static ICON_CLASS: string = 'fas fa-angle-double-up';
    public static ICON_VALUE: string = null;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(element: ElementRef) {
        super(element);
    }

    // --------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    // --------------------------------------------------------------------------

    protected createChildren(): void {
        super.createChildren();

        if (!_.isNil(WindowExpandElementComponent.ICON_VALUE)) {
            ViewUtil.setProperty(this.nativeElement, 'innerHTML', WindowExpandElementComponent.ICON_VALUE);
        }
        if (!_.isNil(WindowExpandElementComponent.ICON_CLASS)) {
            ViewUtil.addClasses(this.nativeElement, WindowExpandElementComponent.ICON_CLASS);
        }
        ViewUtil.addClass(this.nativeElement, 'mouse-active');
    }

    // --------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    // --------------------------------------------------------------------------

    public clickHandler(event: MouseEvent): void {
        super.clickHandler(event);
        if (!_.isNil(this.window)) {
            this.window.emit(WindowEvent.EXPAND);
        }
    }
}
