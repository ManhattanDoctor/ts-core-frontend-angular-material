import { Injectable } from '@angular/core';
import { Transport, Destroyable, TransportCommand, TransportEvent } from '@ts-core/common';
import { CdkScrollable, ExtendedScrollToOptions } from '@angular/cdk/scrolling';
import { NativeWindowService } from '@ts-core/frontend';
import { map, filter } from 'rxjs';
import * as _ from 'lodash';

@Injectable({ providedIn: 'root' })
export class ScrollService extends Destroyable {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    public container: CdkScrollable;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(transport: Transport, private nativeWindow: NativeWindowService) {
        super();
        transport
            .listen<ScrollCommand>(ScrollCommand.NAME)
            .pipe(
                filter(() => !_.isNil(this.container)),
                map(command => command.request)
            )
            .subscribe(data => this.execute(data));
    }

    //--------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    //--------------------------------------------------------------------------

    protected getElementPositionTop(id: string): number {
        let element = this.nativeWindow.document.getElementById(id);
        if (_.isNil(element)) {
            return null;
        }
        let item = element.getBoundingClientRect();
        return element.offsetTop + item.top;
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public execute(item: IScrollDto): void {
        if (!_.isNil(item.elementId)) {
            let position = this.getElementPositionTop(item.elementId);
            if (!_.isNil(position)) {
                item.top = position;
            }
        }
        if (_.isNil(item.top)) {
            item.top = 0;
        }
        if (_.isNil(item.behavior)) {
            item.behavior = 'smooth';
        }
        this.container.scrollTo(item);
    }

    public toElement(id: string, options?: ScrollIntoViewOptions): void {
        let element = this.nativeWindow.document.getElementById(id);
        if (!_.isNil(element)) {
            element.scrollIntoView(options);
        }
    }
}

export class ScrollCommand extends TransportCommand<IScrollDto> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'ScrollCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request?: IScrollDto) {
        super(ScrollCommand.NAME, request);
    }
}

export type IScrollDto = ExtendedScrollToOptions & { elementId?: string };

export class ScrolledEvent extends TransportEvent<IScrolledEventDto> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'ScrolledEvent';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IScrolledEventDto) {
        super(ScrolledEvent.NAME, request);
    }
}

export interface IScrolledEventDto {
    isTop?: boolean;
    isLeft?: boolean;
    isRight?: boolean;
    isBottom?: boolean;
}
