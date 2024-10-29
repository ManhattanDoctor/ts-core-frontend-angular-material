import { Injectable } from '@angular/core';
import { ArrayUtil, ClassType, Loadable, LoadableEvent, LoadableStatus, ObservableData } from '@ts-core/common';
import { NativeWindowService } from '@ts-core/frontend';
import { filter, map, Observable } from 'rxjs';
import { Platform } from '@angular/cdk/platform';
import * as _ from 'lodash';

@Injectable({ providedIn: 'root' })
export class VoiceRecognitionService extends Loadable<VoiceRecognitionEvent, string> {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    protected _isSupported: boolean;

    protected chunks: Array<string>;
    protected dictionary: VoiceRecognitionDictionary;
    protected recognition: any;
    protected dictionaries: VoiceRecognitionDictionaries;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(protected nativeWindow: NativeWindowService, protected platform: Platform) {
        super();
        this.chunks = new Array();
        this.status = LoadableStatus.LOADED;

        this.initialize();
    }

    //--------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    //--------------------------------------------------------------------------

    protected initialize(): void {
        this._isSupported = !_.isNil(this.SpeechRecognitionClass);
        if (!this.isSupported) {
            return;
        }

        this.recognition = this.createSpeechRecognition();
        this.dictionaries = this.createDictionaries();
        this.setLanguage();

        this.recognition.addEventListener('end', this.recognitionEndHandler);
        this.recognition.addEventListener('error', this.recognitionErrorHandler);
        this.recognition.addEventListener('result', this.recognitionResultHandler);
    }

    protected createDictionaries(): VoiceRecognitionDictionaries {
        let item = {} as VoiceRecognitionDictionaries;
        item[VoiceRecognitionDictionaryLanguage.RU] = VoiceRecognitionDictionaryRu;
        item[VoiceRecognitionDictionaryLanguage.EN] = VoiceRecognitionDictionaryEn;
        return item;
    }

    protected createSpeechRecognition(): any {
        let item = new this.SpeechRecognitionClass();
        item.continuous = this.isContinuous;
        item.interimResults = this.isIntermediateResults;
        item.maxAlternatives = 1;
        return item;
    }

    protected setLanguage(): void {
        if (!this.isSupported || _.isNil(this.recognition)) {
            return;
        }
        let language = this.getLanguage();
        this.dictionary = this.dictionaries[language];
        this.recognition.lang = language;
    }

    protected replaceFinal(item: string): string {
        if (_.isNil(this.dictionary)) {
            return item;
        }
        return item.replace(/\s{1,}([\.+,?!:-])/g, '$1');
    }

    protected replaceIntermediate(item: string): string {
        if (_.isNil(this.dictionary)) {
            return item;
        }
        return item
            .split(' ')
            .map(word => {
                word = word.trim();
                let lower = word.toLowerCase();
                return !_.isNil(this.dictionary[lower]) ? this.dictionary[lower] : word;
            })
            .join(' ');
    }

    protected getLanguage(): string {
        return 'ru-RU';
    }

    //--------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    //--------------------------------------------------------------------------

    protected recognitionResultHandler = (event: any): void => {
        let isFinal = false;
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            let item = event.results[i];
            if (item.isFinal) {
                isFinal = true;
            }
            transcript += this.replaceIntermediate(_.first<any>(item).transcript);
        }
        if (isFinal) {
            transcript = this.replaceFinal(transcript);
        }
        let text = transcript;
        if (!_.isEmpty(this.chunks)) {
            text = this.replaceFinal(`${this.chunks.join(' ')} ${text}`);
        }
        if (isFinal) {
            this.chunks.push(transcript);
        }
        this.observer.next(new ObservableData(VoiceRecognitionEvent.PROGRESS, text));
    };

    protected recognitionEndHandler = (event: Event): void => {
        if (this.isLoading) {
            this.recognition.start();
        }
    };

    protected recognitionErrorHandler = (event: Event): void => {
        this.stop();
    };

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public async start(): Promise<void> {
        if (this.isLoading) {
            return;
        }
        this.recognition.start();
        ArrayUtil.clear(this.chunks);
        this.status = LoadableStatus.LOADING;
        this.observer.next(new ObservableData(LoadableEvent.STARTED));
    }

    public async stop(): Promise<void> {
        if (!this.isLoading) {
            return;
        }
        this.recognition.stop();
        this.status = LoadableStatus.LOADED;
        this.observer.next(new ObservableData(LoadableEvent.FINISHED));
    }

    //--------------------------------------------------------------------------
    //
    // 	Private Properties
    //
    //--------------------------------------------------------------------------

    protected get SpeechRecognitionClass(): ClassType<any> {
        return this.nativeWindow.window['SpeechRecognition'] || this.nativeWindow.window['webkitSpeechRecognition'];
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get progress(): Observable<string> {
        return this.observer.asObservable().pipe(
            filter(item => item.type === VoiceRecognitionEvent.PROGRESS),
            map(item => item.data.toString())
        );
    }

    public get isSupported(): boolean {
        return this._isSupported;
    }

    public get isContinuous(): boolean {
        return true;
    }

    public get isIntermediateResults(): boolean {
        return !this.platform.ANDROID && !this.platform.IOS;
    }
}

export enum VoiceRecognitionEvent {
    PROGRESS = 'PROGRESS'
}

export type VoiceRecognitionDictionary = Record<string, string>;

export type VoiceRecognitionDictionaries = Record<VoiceRecognitionDictionaryLanguage, VoiceRecognitionDictionary>;

export enum VoiceRecognitionDictionaryLanguage {
    RU = 'ru',
    EN = 'en'
}

export let VoiceRecognitionDictionaryRu: VoiceRecognitionDictionary = {
    точка: '.',
    запятая: ',',
    вопрос: '?',
    восклицание: '!',
    двоеточие: ':',
    тире: '-',
    абзац: '\n',
    отступ: '\t'
};

export let VoiceRecognitionDictionaryEn: VoiceRecognitionDictionary = {
    dot: '.',
    comma: ',',
    question: '?',
    exclamation: '!',
    colon: ':',
    dash: '-',
    paragraph: '\n',
    indent: '\t'
};
