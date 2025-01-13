import { Pipe, PipeTransform } from '@angular/core';
import { ICdkTableColumn } from './ICdkTableColumn';
import * as _ from 'lodash';

@Pipe({
    name: 'viCdkTableColumnClassName',
    standalone: false
})
export class CdkTableColumnClassNamePipe implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform<U>(item: U, column: ICdkTableColumn<U>): string {
        return !_.isNil(column) && !_.isNil(column.className) ? (_.isString(column.className) ? column.className : column.className(item, column)) : null;
    }
}
