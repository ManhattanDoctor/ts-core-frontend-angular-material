# @ts-core/angular-material

> Реализация окон, уведомлений, нижних листов и таблиц экосистемы ts-core на Angular Material

[![npm version](https://img.shields.io/npm/v/@ts-core/angular-material.svg)](https://www.npmjs.com/package/@ts-core/angular-material)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

Пакет закрывает абстракции [`@ts-core/angular`](https://www.npmjs.com/package/@ts-core/angular) реализациями на Angular Material: `WindowService` открывает перетаскиваемые окна, `NotificationService` показывает всплывающие сообщения, `BottomSheetService` — нижние листы. Сверх этого поставляются таблицы с постраничным выводом, вкладки, меню и примеси Sass.

Прикладной код при этом остаётся независимым от Material: он работает с `WindowService`, а какой именно диалог откроется — решает подключённая реализация.

## Содержание

- [Описание](#описание)
  - [Основные возможности](#основные-возможности)
- [Установка](#установка)
  - [Зависимости](#зависимости)
  - [Стили](#стили)
- [Быстрый старт](#быстрый-старт)
- [Настройка приложения](#настройка-приложения)
- [Окна](#окна)
  - [Своё содержимое](#своё-содержимое)
  - [Вопросы и сообщения](#вопросы-и-сообщения)
  - [Элементы управления окном](#элементы-управления-окном)
- [Уведомления](#уведомления)
- [Нижние листы](#нижние-листы)
- [Портал](#портал)
- [Таблицы](#таблицы)
  - [Источник данных](#источник-данных)
  - [Настройки колонок](#настройки-колонок)
  - [Постраничный вывод или лента](#постраничный-вывод-или-лента)
- [Вкладки и меню](#вкладки-и-меню)
- [Переводы Material](#переводы-material)
- [Компоненты и директивы](#компоненты-и-директивы)
- [Структура проекта](#структура-проекта)
- [История изменений](#история-изменений)
- [Лицензия](#лицензия)

## Описание

### Основные возможности

- **Окна** — немодальные, перетаскиваемые, с изменением размера, сворачиванием и восстановлением позиции
- **Уведомления** — всплывающие сообщения и вопросы с автозакрытием по таймеру
- **Нижние листы** — то же содержимое, что и в окне, но снизу экрана
- **Портал** — выбирает окно или нижний лист по ширине экрана
- **Таблицы** — постраничные, фильтруемые и с закладками, поверх `CdkTable` с сортировкой и подсветкой строк
- **Вкладки и меню** — `vi-tab-group` и `vi-menu-list` поверх коллекций `ListItems`
- **Переводы Material** — подписи пагинатора и локаль выбора даты берутся из `LanguageService`
- **Примеси Sass** — границы, уровни, контейнеры и вспомогательные функции цвета и типографики

## Установка

```bash
npm install @ts-core/angular-material
```

### Зависимости

```json
{
    "@ts-core/angular": "~22.0.1",
    "@angular/cdk": "^22.1.1",
    "@angular/material": "^22.1.1",
    "@angular/material-moment-adapter": "^22.1.1",
    "bootstrap": "^5.3.8",
    "csshake": "^1.7.0"
}
```

Требования к полифиллам и настройке сборки описаны в [`@ts-core/angular`](https://www.npmjs.com/package/@ts-core/angular) — они относятся ко всей цепочке пакетов.

### Стили

```scss
// styles.scss
@use '@angular/material' as mat;
@use '@ts-core/angular' as vi;
@use '@ts-core/angular-material' as vi-mat;

html {
    @include mat.theme((color: (primary: mat.$violet-palette, theme-type: light), typography: Roboto, density: 0));
}

@include vi-mat.core();

html,
body {
    // окна выравниваются по высоте страницы, поэтому она должна совпадать с экраном
    height: 100%;
}
```

```json
// angular.json → architect.build.options
{
    "stylePreprocessorOptions": { "includePaths": ["./node_modules"] }
}
```

Без `height: 100%` у `html` и `body` окна Material центрируются относительно всей высоты документа и уезжают за пределы экрана.

## Быстрый старт

```ts
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideVIMat } from '@ts-core/angular-material';
import { LoggerLevel } from '@ts-core/common';

export const appConfig: ApplicationConfig = {
    providers: [provideVIMat({ loggerLevel: LoggerLevel.LOG })]
};
```

`provideVIMat` включает в себя `provideVI`, поэтому отдельно настраивать `@ts-core/angular` не нужно.

```ts
import { Component, inject } from '@angular/core';
import { WindowService, WindowConfig } from '@ts-core/angular';

@Component({ selector: 'app-root', template: `<button (click)="open()">Открыть</button>` })
export class App {
    private windows = inject(WindowService);

    public async open(): Promise<void> {
        await this.windows.question('common.confirmation').yesNotPromise;
    }
}
```

## Настройка приложения

| Функция | Назначение |
|---|---|
| `provideVIMat(options)` | все провайдеры пакета вместе с `provideVI` |
| `viMatProviders(options)` | тот же список без обёртки — когда нужно что-то переопределить |
| `VIMatModule.forRoot(options)` | вариант для приложений на `NgModule` |

Регистрируются `WindowService`, `NotificationService`, `BottomSheetService`, `PortalService`, а также `MatPaginatorIntl` с переводами.

## Окна

### Своё содержимое

Содержимое окна — обычный самостоятельный компонент, наследующий `IWindowContent`:

```ts
@Component({
    selector: 'user-edit',
    imports: [FormsModule, MatButtonModule, MatDialogModule, VIMatModule],
    template: `
        <div class="p-3" [vi-window-drag-area]="windowSignal()">
            <h2>{{ title }}</h2>
            <button mat-flat-button (click)="submit()">Применить</button>
            <button mat-stroked-button (click)="close()">Закрыть</button>
        </div>
    `
})
export class UserEditComponent extends IWindowContent {
    public static EVENT_SUBMITTED = 'EVENT_SUBMITTED';

    constructor(container: ViewContainerRef) {
        super(container);
        ViewUtil.addClasses(container.element, 'd-block');
    }

    public submit(): void {
        this.emit(UserEditComponent.EVENT_SUBMITTED);
    }
}
```

```ts
let config = new WindowConfig(false, true, 420);   // немодальное, с изменением размера, ширина 420
config.id = 'userEdit' + id;

if (this.windows.setOnTop(config.id)) {
    return;   // окно уже открыто — поднимаем его вместо второго такого же
}

let content = this.windows.open(UserEditComponent, config);
content.events.pipe(takeUntil(content.destroyed)).subscribe(event => {
    if (event === UserEditComponent.EVENT_SUBMITTED) {
        content.close();
    }
});
```

Идентификатор окна нужен именно для этого: без него повторное действие открывает второе окно поверх первого.

### Вопросы и сообщения

```ts
let question = this.windows.question('user.remove.confirmation');
try {
    await question.yesNotPromise;   // нажали «Да»
} catch (error) {
    // нажали «Нет» или закрыли окно
}

this.windows.info('user.saved');
```

Подписи кнопок берутся из переводов `general.yes`, `general.not`, `general.close`.

### Элементы управления окном

| Селектор | Назначение |
|---|---|
| `[vi-window-drag-area]` | область перетаскивания окна |
| `vi-window-close-element` | кнопка закрытия |
| `vi-window-expand-element` | разворот на весь экран |
| `vi-window-minimize-element` | сворачивание |
| `vi-window-resize-element` | уголок изменения размера |

## Уведомления

```ts
this.notifications.info('order.created', null, undefined, { closeDuration: 4000 });

let question = this.notifications.question('order.cancel.confirmation');
await question.yesNotPromise;
```

Уведомления складываются в стопку и закрываются по таймеру `closeDuration` либо по нажатию. Своё содержимое — компонент, наследующий `INotificationContent`.

## Нижние листы

```ts
let content = this.sheet.open(UserEditComponent, new WindowConfig(false, false, 420));
```

Компонент содержимого тот же, что и для окна, — интерфейс `IWindowContent` общий.

## Портал

`PortalService` выбирает способ показа по ширине экрана: на широком открывает окно, на узком — нижний лист.

```ts
this.portal.open(UserEditComponent, config);
this.portal.question('user.remove.confirmation');
```

Граница — контрольная точка `SM` из `BootstrapBreakpointService`.

## Таблицы

### Источник данных

Таблица работает с коллекцией из `@ts-core/common`. Приложение описывает запрос и разбор ответа:

```ts
export class UserMapCollection extends PaginableDataSourceMapCollection<IUser> {
    constructor(private api: Client) {
        super('id');
        this.pageSize = 20;
    }

    protected async request(): Promise<IPagination<IUser>> {
        return this.api.userList({ pageIndex: this.pageIndex, pageSize: this.pageSize });
    }

    protected parseItem(item: IUser): IUser {
        return TransformUtil.toClass(User, item);
    }

    // страница заменяет предыдущую, а не добавляется к ней
    protected override isNeedClearAfterLoad(): boolean {
        return true;
    }
}
```

`isNeedClearAfterLoad` определяет поведение при переходе на другую страницу: по умолчанию записи накапливаются — это нужно для бесконечной ленты. Для постраничной таблицы возвращайте `true`, иначе строки предыдущих страниц останутся на экране.

### Настройки колонок

```ts
public settings: ICdkTableSettings<IUser> = {
    columns: [
        { name: 'name', headerId: 'user.name' },
        { name: 'amount', headerId: 'user.amount', format: item => FinancePipe.format(item.amount, FinancePipe.DEFAULT_FORMAT) },
        { name: 'status', headerId: 'user.status', cellClassName: item => item.isActive ? 'text-success' : null },
        CdkTableColumnMenu
    ]
};
```

```html
<vi-cdk-table-paginable
    class="d-block"
    [table]="items"
    [settings]="settings"
    [paginator]="{ pageSizes: [10, 25], showFirstLastButtons: true }"
    (cellClicked)="cellClickedHandler($event)"
>
    <button mat-icon-button (click)="items.reload()">
        <mat-icon fontIcon="refresh"></mat-icon>
    </button>
</vi-cdk-table-paginable>
```

Содержимое между тегами попадает в строку пагинатора — туда обычно кладут кнопку обновления.

### Постраничный вывод или лента

| Компонент | Источник | Когда применять |
|---|---|---|
| `vi-cdk-table-paginable` | `PaginableDataSourceMapCollection` | обычная таблица со страницами |
| `vi-cdk-table-paginable-bookmark` | `PaginableBookmarkDataSourceMapCollection` | листание по закладке, без общего количества |
| `vi-cdk-table-filterable` | `FilterableDataSourceMapCollection` | список без страниц |

## Вкладки и меню

```ts
this.tabs = new SelectListItems<ISelectListItem<string>>(language);
this.tabs.add(new SelectListItem('user.general', 0, 'GENERAL'));
this.tabs.add(new SelectListItem('user.history', 1, 'HISTORY'));
this.tabs.complete(0);
```

```html
<vi-tab-group [list]="tabs"></vi-tab-group>

<mat-menu #matMenu [overlapTrigger]="false">
    <vi-menu-list [list]="menu" isMaterialIcon></vi-menu-list>
</mat-menu>
<span [vi-menu-trigger-for]="matMenu"></span>
```

`[vi-menu-trigger-for]` позволяет открыть меню из кода — например, по нажатию на ячейку таблицы:

```ts
public cellClickedHandler(item: ICdkTableCellEvent<IUser>): void {
    if (item.column.name === CDK_TABLE_COLUMN_MENU_NAME) {
        this.menu.refresh(item.data);
        this.trigger.openMenuOn(item.event.target);
    }
}
```

Подписи вкладок и пунктов меню переводятся при смене языка, компоненты перерисовываются сами.

## Переводы Material

`LanguageMatPaginatorIntl` подставляет в пагинатор переводы:

```json
{
    "paginator": {
        "firstPage": "Первая",
        "lastPage": "Последняя",
        "nextPage": "Следующая",
        "previousPage": "Предыдущая",
        "itemsPerPage": "Строк на странице",
        "pageRange": "{current} из {total}"
    }
}
```

`LanguageMomentDateAdapter` синхронизирует локаль выбора даты с `LanguageService`:

```ts
providers: [{ provide: DateAdapter, useClass: LanguageMomentDateAdapter }]
```

## Компоненты и директивы

| Селектор | Назначение |
|---|---|
| `vi-cdk-table-paginable` | таблица со страницами |
| `vi-cdk-table-paginable-bookmark` | таблица с листанием по закладке |
| `vi-cdk-table-filterable` | таблица без страниц |
| `vi-tab-group` | вкладки поверх `SelectListItems` |
| `vi-menu-list` | пункты меню поверх `ListItems` |
| `vi-notification` | стандартное содержимое уведомления |
| `[vi-menu-trigger-for]` | открытие меню из кода |
| `[vi-window-drag-area]` | перетаскивание окна |
| `[vi-voice-recognition-button]` | распознавание речи в поле ввода |

Сервисы: `PortalService`, `ScrollService`, `BootstrapBreakpointService`, `VoiceRecognitionService`.

## Структура проекта

```
src/
├── VIMatModule.ts          provideVIMat, viMatProviders
├── _index.scss             примеси Sass, core()
├── helper/                 функции цвета, типографики и границ
├── bottomSheet/            нижние листы
├── component/
│   ├── cdk-table/          таблицы, пайпы ячеек, строк и колонок
│   ├── menu-list/          пункты меню
│   ├── tab-group/          вкладки
│   └── ShellBaseComponent  каркас страницы
├── directive/              меню и распознавание речи
├── language/               переводы пагинатора и локаль дат
├── notification/           уведомления
├── service/                портал, прокрутка, контрольные точки
└── window/                 окна и элементы управления ими
```

## История изменений

### 22.0.1

- Поддержка Angular 22 и TypeScript 6
- Компоненты стали самостоятельными, `standalone: false` снят, у каждого свой список импортов
- Добавлены `provideVIMat` и `viMatProviders` — настройка без `NgModule`
- Шаблоны переведены на встроенный синтаксис управления `@if` и `@for`, `ngClass` и `ngStyle` заменены на `[class]` и `[style]`
- Исправлена опечатка в шаблоне постраничной таблицы, из-за которой не отрисовывалась шапка
- `vi-menu-list` и `vi-tab-group` перерисовываются при смене языка
- `LanguageMomentDateAdapter` приведён к новому конструктору адаптера Material
- Стили кладёт в пакет сама сборка, а не отдельный шаг копирования

Публичный API не менялся: `VIMatModule.forRoot()` работает по-прежнему, селекторы и входы компонентов совпадают с предыдущими версиями.

## Лицензия

ISC © Renat Gubaev
