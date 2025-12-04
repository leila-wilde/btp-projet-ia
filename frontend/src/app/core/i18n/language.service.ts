import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { translations, Language } from './translations';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly STORAGE_KEY = 'app-language';
  private readonly DEFAULT_LANGUAGE: Language = 'fr';

  private currentLanguageSubject: BehaviorSubject<Language>;
  public currentLanguage$: Observable<Language>;

  constructor() {
    const savedLanguage = this.getSavedLanguage();
    this.currentLanguageSubject = new BehaviorSubject<Language>(savedLanguage);
    this.currentLanguage$ = this.currentLanguageSubject.asObservable();
  }

  private getSavedLanguage(): Language {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved === 'en' || saved === 'fr') {
      return saved;
    }
    return this.DEFAULT_LANGUAGE;
  }

  getCurrentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  setLanguage(language: Language): void {
    this.currentLanguageSubject.next(language);
    localStorage.setItem(this.STORAGE_KEY, language);
  }

  toggleLanguage(): void {
    const current = this.getCurrentLanguage();
    const newLanguage: Language = current === 'fr' ? 'en' : 'fr';
    this.setLanguage(newLanguage);
  }

  getTranslations() {
    return translations[this.getCurrentLanguage()];
  }

  translate(key: string, section: string = 'nav'): string {
    const lang = this.getCurrentLanguage();
    const trans = translations[lang];
    const sectionObj = (trans as any)[section];
    return sectionObj?.[key] || key;
  }
}
