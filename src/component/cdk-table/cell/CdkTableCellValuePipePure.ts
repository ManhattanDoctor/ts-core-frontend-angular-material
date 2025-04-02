import { Pipe, PipeTransform } from '@angular/core';
import { CdkTableCellValue, ICdkTableColumn } from '../column/ICdkTableColumn';
import * as _ from 'lodash';

@Pipe({
    name: 'viCdkTableCellValuePure',
    standalone: false
})
export class CdkTableCellValuePipePure implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform<U>(item: U, column: ICdkTableColumn<U>): CdkTableCellValue<U> | Promise<CdkTableCellValue<U>> {
        return !_.isNil(column.format) ? column.format(item, column) : item[column.name];
    }
}
