# @ts-core/angular-material

Angular Material библиотека с компонентами пользовательского интерфейса. Расширяет `@ts-core/angular` реализациями на базе Angular Material для окон, уведомлений, таблиц, нижних листов и других UI-элементов.

## Содержание

- [Установка](#установка)
- [Зависимости](#зависимости)
- [Быстрый старт](#быстрый-старт)
- [Модули](#модули)
- [Окна (Windows)](#окна-windows)
- [Уведомления (Notifications)](#уведомления-notifications)
- [Нижние листы (Bottom Sheets)](#нижние-листы-bottom-sheets)
- [CDK-таблицы](#cdk-таблицы)
- [Директивы](#директивы)
- [Сервисы](#сервисы)
- [Примеры использования](#примеры-использования)
- [Связанные пакеты](#связанные-пакеты)

## Установка

```bash
npm install @ts-core/angular-material
```

```bash
yarn add @ts-core/angular-material
```

```bash
pnpm add @ts-core/angular-material
```

## Зависимости

| Пакет | Описание |
|-------|----------|
| `@angular/core` | Angular фреймворк |
| `@angular/material` | Angular Material компоненты |
| `@angular/cdk` | Angular Component Dev Kit |
| `@ts-core/angular` | Базовые Angular утилиты |
| `@ts-core/common` | Базовые классы и интерфейсы |
| `@ts-core/frontend` | Фронтенд утилиты |
| `bootstrap` | Bootstrap стили (для breakpoints) |

## Быстрый старт

### Подключение модуля

```typescript
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VIMatModule } from '@ts-core/angular-material';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        VIMatModule.forRoot({
            loggerLevel: LoggerLevel.ALL,
            languageOptions: {
                defaultLocale: 'ru',
                supportedLocales: ['ru', 'en']
            }
        })
    ]
})
export class AppModule {}
```

### Для standalone компонентов

```typescript
import { Component } from '@angular/core';
import { VIMatModule } from '@ts-core/angular-material';

@Component({
    standalone: true,
    imports: [VIMatModule]
})
export class MyComponent {}
```

## Модули

### VIMatModule (главный модуль)

Объединяет все подмодули и экспортирует VIModule:

```typescript
import { VIMatModule } from '@ts-core/angular-material';
import { IVIOptions } from '@ts-core/angular';

@NgModule({
    imports: [VIMatModule.forRoot(options)]
})
export class AppModule {}
```

### WindowModule

Модуль окон на базе MatDialog:

```typescript
import { WindowModule } from '@ts-core/angular-material';

@NgModule({
    imports: [WindowModule.forRoot()]
})
export class AppModule {}
```

### NotificationModule

Модуль уведомлений:

```typescript
import { NotificationModule } from '@ts-core/angular-material';

@NgModule({
    imports: [NotificationModule.forRoot()]
})
export class AppModule {}
```

### BottomSheetModule

Модуль нижних листов на базе MatBottomSheet:

```typescript
import { BottomSheetModule } from '@ts-core/angular-material';

@NgModule({
    imports: [BottomSheetModule.forRoot()]
})
export class AppModule {}
```

## Окна (Windows)

### WindowServiceImpl

Реализация WindowService на базе MatDialog:

```typescript
import { WindowService } from '@ts-core/angular';

@Component({...})
export class MyComponent {
    constructor(private windowService: WindowService) {}

    openDialog(): void {
        const content = this.windowService.open(MyDialogComponent, {
            data: { title: 'Заголовок', message: 'Сообщение' },
            width: '500px',
            disableClose: true
        });

        content.events.subscribe(event => {
            console.log('Dialog event:', event);
        });
    }

    showQuestion(): void {
        const question = this.windowService.question('confirm.delete', {
            name: 'Документ'
        });

        question.yesClick.subscribe(() => {
            this.deleteDocument();
        });
    }

    showInfo(): void {
        this.windowService.info('success.saved');
    }
}
```

### WindowBaseComponent

Базовый класс для содержимого окна:

```typescript
import { Component } from '@angular/core';
import { WindowBaseComponent } from '@ts-core/angular-material';

@Component({
    selector: 'app-my-dialog',
    template: `
        <h2 mat-dialog-title>{{ config.data.title }}</h2>
        <mat-dialog-content>
            <p>{{ config.data.message }}</p>
        </mat-dialog-content>
        <mat-dialog-actions>
            <button mat-button (click)="close()">Закрыть</button>
            <button mat-raised-button color="primary" (click)="save()">Сохранить</button>
        </mat-dialog-actions>
    `
})
export class MyDialogComponent extends WindowBaseComponent<MyDialogData> {
    save(): void {
        this.config.data.result = 'saved';
        this.close();
    }

    close(): void {
        this.destroy();
    }
}

interface MyDialogData {
    title: string;
    message: string;
    result?: string;
}
```

### WindowQuestionBaseComponent

Базовый класс для окна подтверждения:

```typescript
import { Component } from '@angular/core';
import { WindowQuestionBaseComponent } from '@ts-core/angular-material';

@Component({
    selector: 'app-confirm-dialog',
    template: `
        <h2 mat-dialog-title>Подтверждение</h2>
        <mat-dialog-content>
            <p>{{ question.text }}</p>
        </mat-dialog-content>
        <mat-dialog-actions align="end">
            <button mat-button (click)="no()">{{ question.noText }}</button>
            <button mat-raised-button color="primary" (click)="yes()">{{ question.yesText }}</button>
        </mat-dialog-actions>
    `
})
export class ConfirmDialogComponent extends WindowQuestionBaseComponent {}
```

### Конфигурация окна

```typescript
import { WindowProperties } from '@ts-core/angular-material';

const windowConfig = {
    data: { title: 'Заголовок' },
    width: '600px',
    height: 'auto',
    maxWidth: '90vw',
    maxHeight: '90vh',
    disableClose: false,
    panelClass: 'my-dialog-panel',
    hasBackdrop: true,
    backdropClass: 'my-backdrop'
};
```

### Перетаскиваемые и изменяемые окна

```typescript
import { Component } from '@angular/core';
import { WindowDragable, WindowResizeable } from '@ts-core/angular-material';

@Component({
    selector: 'app-draggable-dialog',
    template: `
        <div viWindowDragArea class="header">
            <h2>Перетаскиваемое окно</h2>
            <vi-window-close-element></vi-window-close-element>
        </div>
        <div class="content">
            Содержимое окна
        </div>
        <vi-window-resize-element></vi-window-resize-element>
    `
})
export class DraggableDialogComponent extends WindowDragable implements WindowResizeable {
    // Реализация интерфейсов для drag и resize
}
```

## Уведомления (Notifications)

### NotificationServiceImpl

Реализация сервиса уведомлений:

```typescript
import { NotificationService } from '@ts-core/angular';

@Component({...})
export class MyComponent {
    constructor(private notifications: NotificationService) {}

    showSuccess(): void {
        this.notifications.show({
            message: 'Данные сохранены',
            type: 'success',
            duration: 3000
        });
    }

    showError(): void {
        this.notifications.show({
            message: 'Произошла ошибка',
            type: 'error',
            duration: 5000
        });
    }

    showWarning(): void {
        this.notifications.show({
            message: 'Внимание!',
            type: 'warning',
            duration: 4000
        });
    }
}
```

### NotificationBaseComponent

Базовый класс для компонента уведомления:

```typescript
import { Component } from '@angular/core';
import { NotificationBaseComponent } from '@ts-core/angular-material';

@Component({
    selector: 'app-notification',
    template: `
        <div class="notification" [class]="notification.type">
            <span class="message">{{ notification.message }}</span>
            <button mat-icon-button (click)="close()">
                <mat-icon>close</mat-icon>
            </button>
        </div>
    `,
    styles: [`
        .notification { display: flex; align-items: center; padding: 16px; }
        .success { background: #4caf50; color: white; }
        .error { background: #f44336; color: white; }
        .warning { background: #ff9800; color: white; }
    `]
})
export class NotificationComponent extends NotificationBaseComponent {}
```

### NotificationQuestionBaseComponent

Уведомление с вопросом:

```typescript
import { Component } from '@angular/core';
import { NotificationQuestionBaseComponent } from '@ts-core/angular-material';

@Component({
    selector: 'app-notification-question',
    template: `
        <div class="notification-question">
            <span>{{ question.text }}</span>
            <div class="actions">
                <button mat-button (click)="no()">{{ question.noText }}</button>
                <button mat-raised-button (click)="yes()">{{ question.yesText }}</button>
            </div>
        </div>
    `
})
export class NotificationQuestionComponent extends NotificationQuestionBaseComponent {}
```

## Нижние листы (Bottom Sheets)

### BottomSheetServiceImpl

Реализация сервиса нижних листов:

```typescript
import { BottomSheetService } from '@ts-core/angular';

@Component({...})
export class MyComponent {
    constructor(private bottomSheet: BottomSheetService) {}

    openActions(): void {
        this.bottomSheet.open(ActionsSheetComponent, {
            data: {
                actions: [
                    { icon: 'edit', label: 'Редактировать', value: 'edit' },
                    { icon: 'delete', label: 'Удалить', value: 'delete' },
                    { icon: 'share', label: 'Поделиться', value: 'share' }
                ]
            }
        });
    }
}
```

### BottomSheetBaseComponent

Базовый класс для содержимого нижнего листа:

```typescript
import { Component } from '@angular/core';
import { BottomSheetBaseComponent } from '@ts-core/angular-material';

@Component({
    selector: 'app-actions-sheet',
    template: `
        <mat-nav-list>
            <mat-list-item *ngFor="let action of config.data.actions"
                           (click)="select(action)">
                <mat-icon matListItemIcon>{{ action.icon }}</mat-icon>
                <span matListItemTitle>{{ action.label }}</span>
            </mat-list-item>
        </mat-nav-list>
    `
})
export class ActionsSheetComponent extends BottomSheetBaseComponent<ActionsData> {
    select(action: Action): void {
        this.config.data.selected = action.value;
        this.close();
    }

    close(): void {
        this.destroy();
    }
}

interface ActionsData {
    actions: Action[];
    selected?: string;
}

interface Action {
    icon: string;
    label: string;
    value: string;
}
```

## CDK-таблицы

### CdkTableBaseComponent

Базовый компонент для таблиц с сортировкой и событиями:

```typescript
import { Component } from '@angular/core';
import { CdkTableBaseComponent, ICdkTableColumn, ICdkTableSettings } from '@ts-core/angular-material';
import { FilterableDataSourceMapCollection } from '@ts-core/common';

@Component({
    selector: 'app-users-table',
    template: `
        <table mat-table [dataSource]="source.itemsChanged" matSort (matSortChange)="sortEventHandler($event)">
            <ng-container *ngFor="let column of columns" [matColumnDef]="column.name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>
                    {{ column.label | viLanguage }}
                </th>
                <td mat-cell *matCellDef="let row"
                    [class]="row | viCdkTableCellClassName:column"
                    [style]="row | viCdkTableCellStyleName:column"
                    (click)="cellClickHandler(row, column, $event)">
                    {{ row | viCdkTableCellValue:column }}
                </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="columnNames"></tr>
            <tr mat-row *matRowDef="let row; columns: columnNames"
                [class]="row | viCdkTableRowClassName:rows"
                (click)="rowClickHandler(row, $event)">
            </tr>
        </table>
    `
})
export class UsersTableComponent extends CdkTableBaseComponent<UsersCollection, User> {
    columns: ICdkTableColumn<User>[] = [
        { name: 'id', label: 'ID' },
        { name: 'name', label: 'Имя', format: (user) => user.firstName + ' ' + user.lastName },
        { name: 'email', label: 'Email' },
        { name: 'status', label: 'Статус', className: (user) => `status-${user.status}` }
    ];
}
```

### CdkTablePaginableComponent

Компонент таблицы с пагинацией:

```typescript
import { Component, Input } from '@angular/core';
import { CdkTablePaginableComponent } from '@ts-core/angular-material';

@Component({
    selector: 'app-paginable-table',
    template: `
        <vi-cdk-table-paginable
            [table]="usersCollection"
            [columns]="columns"
            [settings]="tableSettings"
            (rowClicked)="onRowClick($event)"
            (cellClicked)="onCellClick($event)">
        </vi-cdk-table-paginable>
    `
})
export class MyTableComponent {
    @Input() usersCollection: UsersCollection;

    columns = [
        { name: 'id', label: 'ID' },
        { name: 'name', label: 'Имя' }
    ];

    tableSettings = {
        isInteractive: true,
        noDataId: 'table.noData'
    };

    onRowClick(event: { data: User; event: MouseEvent }): void {
        console.log('Row clicked:', event.data);
    }

    onCellClick(event: { data: User; column: string; event: MouseEvent }): void {
        console.log('Cell clicked:', event.column, event.data);
    }
}
```

### CdkTableFilterableComponent

Компонент таблицы с фильтрацией:

```typescript
import { Component } from '@angular/core';

@Component({
    selector: 'app-filterable-table',
    template: `
        <vi-cdk-table-filterable
            [table]="usersCollection"
            [columns]="columns"
            [filterColumns]="['name', 'email']">
        </vi-cdk-table-filterable>
    `
})
export class FilterableTableComponent {
    usersCollection: UsersCollection;
    columns = [
        { name: 'id', label: 'ID' },
        { name: 'name', label: 'Имя' },
        { name: 'email', label: 'Email' }
    ];
}
```

### ICdkTableColumn

Интерфейс колонки таблицы:

```typescript
interface ICdkTableColumn<U> {
    name: string;                           // Имя поля
    label?: string;                         // Текст заголовка
    format?: (item: U) => string;           // Форматирование значения
    className?: (item: U) => string;        // CSS класс ячейки
    styleName?: (item: U) => object;        // Inline стили ячейки
    sortable?: boolean;                     // Разрешена сортировка
    sticky?: 'start' | 'end';               // Закрепление колонки
}
```

### Пайпы для таблиц

```html
<!-- Значение ячейки -->
{{ row | viCdkTableCellValue:column }}

<!-- Класс ячейки -->
[class]="row | viCdkTableCellClassName:column"

<!-- Стиль ячейки -->
[style]="row | viCdkTableCellStyleName:column"

<!-- Класс колонки -->
[class]="column | viCdkTableColumnClassName"

<!-- Стиль колонки -->
[style]="column | viCdkTableColumnStyleName"

<!-- Класс строки -->
[class]="row | viCdkTableRowClassName:rows"

<!-- Стиль строки -->
[style]="row | viCdkTableRowStyleName:rows"
```

## Директивы

### MenuTriggerForDirective

Расширение matMenuTriggerFor для контекстного меню:

```html
<div [viMenuTriggerFor]="menu" [viMenuData]="item">
    Правый клик для меню
</div>

<mat-menu #menu>
    <ng-template matMenuContent let-data="data">
        <button mat-menu-item (click)="edit(data)">Редактировать</button>
        <button mat-menu-item (click)="delete(data)">Удалить</button>
    </ng-template>
</mat-menu>
```

### VoiceRecognitionButtonDirective

Кнопка голосового ввода:

```html
<button mat-icon-button
        viVoiceRecognitionButton
        [targetInput]="searchInput"
        (recognized)="onVoiceResult($event)">
    <mat-icon>mic</mat-icon>
</button>

<input #searchInput [(ngModel)]="searchText">
```

```typescript
@Component({...})
export class MyComponent {
    searchText = '';

    onVoiceResult(text: string): void {
        console.log('Распознано:', text);
    }
}
```

### WindowDragAreaDirective

Область для перетаскивания окна:

```html
<div viWindowDragArea class="window-header">
    <h2>Заголовок окна</h2>
</div>
```

## Сервисы

### PortalService

Сервис для выбора между Window и BottomSheet в зависимости от размера экрана:

```typescript
import { PortalService } from '@ts-core/angular-material';

@Component({...})
export class MyComponent {
    constructor(private portal: PortalService) {}

    openPortal(): void {
        // На мобильных откроет BottomSheet, на десктопе - Dialog
        this.portal.open(MyContentComponent, {
            data: { title: 'Заголовок' },
            mobileBreakpoint: 'md'  // Bootstrap breakpoint
        });
    }
}
```

### BootstrapBreakpointService

Сервис для определения текущего breakpoint Bootstrap:

```typescript
import { BootstrapBreakpointService } from '@ts-core/angular-material';

@Component({...})
export class MyComponent {
    constructor(private breakpoint: BootstrapBreakpointService) {}

    checkBreakpoint(): void {
        console.log('Current breakpoint:', this.breakpoint.current);
        // 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'

        if (this.breakpoint.isMobile) {
            // Мобильная версия
        }

        if (this.breakpoint.isDesktop) {
            // Десктоп версия
        }
    }
}
```

### ScrollService

Сервис для управления прокруткой:

```typescript
import { ScrollService } from '@ts-core/angular-material';

@Component({...})
export class MyComponent {
    constructor(private scroll: ScrollService) {}

    scrollToTop(): void {
        this.scroll.scrollToTop();
    }

    scrollToElement(element: HTMLElement): void {
        this.scroll.scrollTo(element);
    }
}
```

### VoiceRecognitionService

Сервис распознавания голоса:

```typescript
import { VoiceRecognitionService } from '@ts-core/angular-material';

@Component({...})
export class MyComponent {
    constructor(private voice: VoiceRecognitionService) {}

    startRecognition(): void {
        if (!this.voice.isSupported) {
            console.log('Распознавание голоса не поддерживается');
            return;
        }

        this.voice.start('ru-RU');

        this.voice.result.subscribe(text => {
            console.log('Распознано:', text);
        });

        this.voice.error.subscribe(error => {
            console.error('Ошибка:', error);
        });
    }

    stopRecognition(): void {
        this.voice.stop();
    }
}
```

## Примеры использования

### Полная настройка приложения

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VIMatModule } from '@ts-core/angular-material';
import { LoggerLevel } from '@ts-core/common';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        VIMatModule.forRoot({
            loggerLevel: LoggerLevel.DEBUG,
            languageOptions: {
                defaultLocale: 'ru',
                supportedLocales: ['ru', 'en']
            },
            themeOptions: {
                defaultTheme: 'light',
                supportedThemes: ['light', 'dark']
            }
        })
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
```

### Таблица пользователей с полным функционалом

```typescript
import { Component, ViewChild } from '@angular/core';
import { WindowService, BottomSheetService } from '@ts-core/angular';
import { CdkTablePaginableComponent, ICdkTableColumn } from '@ts-core/angular-material';

@Component({
    selector: 'app-users-management',
    template: `
        <div class="toolbar">
            <button mat-raised-button color="primary" (click)="addUser()">
                <mat-icon>add</mat-icon>
                Добавить пользователя
            </button>
        </div>

        <vi-cdk-table-paginable
            #table
            [table]="usersCollection"
            [columns]="columns"
            [settings]="tableSettings"
            (rowClicked)="editUser($event.data)"
            (cellClicked)="onCellClick($event)">
        </vi-cdk-table-paginable>
    `
})
export class UsersManagementComponent {
    @ViewChild('table') table: CdkTablePaginableComponent;

    usersCollection: UsersCollection;

    columns: ICdkTableColumn<User>[] = [
        {
            name: 'avatar',
            label: '',
            format: (user) => `<img src="${user.avatarUrl}" class="avatar">`
        },
        {
            name: 'name',
            label: 'user.name',
            format: (user) => `${user.firstName} ${user.lastName}`,
            sortable: true
        },
        {
            name: 'email',
            label: 'user.email',
            sortable: true
        },
        {
            name: 'role',
            label: 'user.role',
            className: (user) => `role-${user.role}`
        },
        {
            name: 'status',
            label: 'user.status',
            className: (user) => user.isActive ? 'active' : 'inactive',
            format: (user) => user.isActive ? 'Активен' : 'Неактивен'
        },
        {
            name: 'actions',
            label: '',
            format: () => '<mat-icon>more_vert</mat-icon>'
        }
    ];

    tableSettings = {
        isInteractive: true,
        noDataId: 'users.noData'
    };

    constructor(
        private windowService: WindowService,
        private bottomSheet: BottomSheetService
    ) {}

    addUser(): void {
        this.windowService.open(UserEditDialogComponent, {
            data: { user: null },
            width: '600px'
        });
    }

    editUser(user: User): void {
        this.windowService.open(UserEditDialogComponent, {
            data: { user },
            width: '600px'
        });
    }

    onCellClick(event: { data: User; column: string; event: MouseEvent }): void {
        if (event.column === 'actions') {
            event.event.stopPropagation();
            this.showActionsMenu(event.data);
        }
    }

    showActionsMenu(user: User): void {
        this.bottomSheet.open(UserActionsSheetComponent, {
            data: { user }
        });
    }
}
```

### Диалог редактирования

```typescript
import { Component } from '@angular/core';
import { WindowBaseComponent } from '@ts-core/angular-material';

@Component({
    selector: 'app-user-edit-dialog',
    template: `
        <h2 mat-dialog-title>
            {{ config.data.user ? 'Редактирование' : 'Создание' }} пользователя
        </h2>

        <mat-dialog-content>
            <form [formGroup]="form">
                <mat-form-field appearance="outline">
                    <mat-label>Имя</mat-label>
                    <input matInput formControlName="firstName">
                </mat-form-field>

                <mat-form-field appearance="outline">
                    <mat-label>Фамилия</mat-label>
                    <input matInput formControlName="lastName">
                </mat-form-field>

                <mat-form-field appearance="outline">
                    <mat-label>Email</mat-label>
                    <input matInput formControlName="email" type="email">
                </mat-form-field>

                <mat-form-field appearance="outline">
                    <mat-label>Роль</mat-label>
                    <mat-select formControlName="role">
                        <mat-option value="user">Пользователь</mat-option>
                        <mat-option value="admin">Администратор</mat-option>
                    </mat-select>
                </mat-form-field>
            </form>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
            <button mat-button (click)="close()">Отмена</button>
            <button mat-raised-button color="primary"
                    [disabled]="form.invalid || isLoading"
                    (click)="save()">
                Сохранить
            </button>
        </mat-dialog-actions>
    `
})
export class UserEditDialogComponent extends WindowBaseComponent<UserEditData> {
    form: FormGroup;
    isLoading = false;

    constructor(private fb: FormBuilder, private userService: UserService) {
        super();
        this.initForm();
    }

    initForm(): void {
        const user = this.config.data.user;
        this.form = this.fb.group({
            firstName: [user?.firstName || '', Validators.required],
            lastName: [user?.lastName || '', Validators.required],
            email: [user?.email || '', [Validators.required, Validators.email]],
            role: [user?.role || 'user', Validators.required]
        });
    }

    async save(): Promise<void> {
        if (this.form.invalid) return;

        this.isLoading = true;
        try {
            const userData = this.form.value;
            if (this.config.data.user) {
                await this.userService.update(this.config.data.user.id, userData);
            } else {
                await this.userService.create(userData);
            }
            this.config.data.saved = true;
            this.close();
        } finally {
            this.isLoading = false;
        }
    }

    close(): void {
        this.destroy();
    }
}

interface UserEditData {
    user?: User;
    saved?: boolean;
}
```

## API Reference

### VIMatModule

| Метод | Описание |
|-------|----------|
| `forRoot(options?)` | Создать модуль с настройками |

### WindowService (реализация)

| Метод | Описание |
|-------|----------|
| `open(component, config)` | Открыть диалог |
| `info(translationId, translation?, options?)` | Информационное окно |
| `question(translationId, translation?, options?)` | Окно подтверждения |
| `close(id)` | Закрыть окно |
| `closeAll()` | Закрыть все окна |

### CdkTableBaseComponent

| Свойство/Метод | Тип | Описание |
|----------------|-----|----------|
| `table` | `M` | Источник данных |
| `columns` | `ICdkTableColumn<U>[]` | Конфигурация колонок |
| `settings` | `ICdkTableSettings<U>` | Настройки таблицы |
| `selectedRow` | `U` | Выбранная строка |
| `selectedRows` | `U[]` | Выбранные строки |
| `rowClicked` | `EventEmitter` | Событие клика по строке |
| `cellClicked` | `EventEmitter` | Событие клика по ячейке |
| `render()` | `void` | Перерисовать таблицу |

### BootstrapBreakpointService

| Свойство | Тип | Описание |
|----------|-----|----------|
| `current` | `string` | Текущий breakpoint |
| `isMobile` | `boolean` | Мобильное устройство (xs, sm) |
| `isTablet` | `boolean` | Планшет (md) |
| `isDesktop` | `boolean` | Десктоп (lg, xl, xxl) |

## Связанные пакеты

| Пакет | Описание |
|-------|----------|
| `@ts-core/angular` | Базовые Angular утилиты |
| `@ts-core/frontend` | Фронтенд утилиты |
| `@ts-core/common` | Общие классы и интерфейсы |
| `@angular/material` | Angular Material компоненты |

## Автор

**Renat Gubaev** — [renat.gubaev@gmail.com](mailto:renat.gubaev@gmail.com)

- GitHub: [ManhattanDoctor](https://github.com/ManhattanDoctor)
- Репозиторий: [ts-core-frontend-angular-material](https://github.com/ManhattanDoctor/ts-core-frontend-angular-material)

## Лицензия

ISC
