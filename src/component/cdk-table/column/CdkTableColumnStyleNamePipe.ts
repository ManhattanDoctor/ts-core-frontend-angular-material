import { Pipe, PipeTransform } from '@angular/core';
import { ICdkTableColumn } from './ICdkTableColumn';
import * as _ from 'lodash';

@Pipe({
    name: 'viCdkTableColumnStyleName'
})
export class CdkTableColumnStyleNamePipe implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform<U>(item: U, column: ICdkTableColumn<U>): { [key: string]: any } {
        return !_.isNil(column) && !_.isNil(column.styleName) ? column.styleName(item, column) : null;
    }
}
