import { Pipe, PipeTransform } from '@angular/core';
import { ICdkTableRow } from './ICdkTableRow';
import * as _ from 'lodash';

@Pipe({
    name: 'viCdkTableRowClassName',
    standalone: false
})
export class CdkTableRowClassNamePipe implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform<U>(item: U, row: ICdkTableRow<U>, selectedRows: Array<U>): string {
        return !_.isNil(row) && !_.isNil(row.className) ? (_.isString(row.className) ? row.className : row.className(item, selectedRows)) : null;
    }
}
