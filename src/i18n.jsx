import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import {languageSupported} from "./locale/language-list";
import {enTrans} from "./locale/en-locale";
import {viTrans} from "./locale/vn-locale";
import {poTrans} from "./locale/po_locale";
import {esTrans} from "./locale/es_locale";
import {deTrans} from "./locale/de_locale";


i18n
    .use(LanguageDetector)

i18n
    .use(initReactI18next)
    .init({
        // debug: true,
        fallbackLng: 'en',
        load: 'languageOnly',
        supportedLngs: languageSupported,
        interpolation: {
            escapeValue: false,
        },
        resources: {
            en: {
                translation: {...enTrans}
            },
            vi: {
                translation: {...viTrans}
            },
            pl: {
                translation: {...poTrans}
            },
            es: {
                translation: {...esTrans}
            },
            de: {
                translation: {...deTrans}
            }
        }
    });

export default i18n;
