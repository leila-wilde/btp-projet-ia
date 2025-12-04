import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/i18n/language.service';

interface NewsItem {
  id: number;
  titleKey: string;
  contentKey: string;
  date: string;
  author: string;
  categoryKey: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1>{{ t.home.title }}</h1>
          <p class="hero-subtitle">{{ t.home.tagline }}</p>
          <p class="hero-description">{{ t.home.description }}</p>
          <div class="hero-actions">
            <button class="btn-primary" routerLink="/auth/register">{{ t.home.getStarted }}</button>
            <button class="btn-secondary" routerLink="/forum">{{ t.home.explore }}</button>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features">
        <h2>{{ t.home.features }}</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📅</div>
            <h3>{{ t.home.events }}</h3>
            <p>{{ t.home.eventsDesc }}</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💬</div>
            <h3>{{ t.home.forum }}</h3>
            <p>{{ t.home.forumDesc }}</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🛠️</div>
            <h3>{{ t.home.workshops }}</h3>
            <p>{{ t.home.workshopsDesc }}</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">👥</div>
            <h3>{{ t.home.community }}</h3>
            <p>{{ t.home.communityDesc }}</p>
          </div>
        </div>
      </section>

      <!-- News Section -->
      <section class="news-section">
        <h2>{{ t.home.latestNews }}</h2>
        <div class="news-list">
          <article *ngFor="let item of newsItems" class="news-card">
            <div class="news-header">
              <h3>{{ getNewsTitle(item.titleKey) }}</h3>
              <span class="badge badge-primary">{{ getNewsCategory(item.categoryKey) }}</span>
            </div>
            <p class="news-meta">{{ t.home.by }} <strong>{{ item.author }}</strong> · {{ formatDate(item.date) }}</p>
            <p class="news-content">{{ getNewsContent(item.contentKey) }}</p>
            <a href="#" class="read-more">{{ t.home.readMore }}</a>
          </article>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .home-container {
        width: 100%;
      }

      .hero {
        background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
        border-radius: 12px;
        padding: 4rem 2rem;
        margin-bottom: 3rem;
        color: white;
        text-align: center;
      }

      .hero-content {
        max-width: 600px;
        margin: 0 auto;
      }

      .hero h1 {
        font-size: 3rem;
        color: white;
        margin-bottom: 1rem;
      }

      .hero-subtitle {
        font-size: 1.5rem;
        color: rgba(255, 255, 255, 0.95);
        margin-bottom: 1rem;
        font-style: italic;
      }

      .hero-description {
        font-size: 1.1rem;
        color: rgba(255, 255, 255, 0.85);
        margin-bottom: 2rem;
      }

      .hero-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
      }

      .hero-actions button {
        padding: 1rem 2rem;
        font-size: 1.1rem;
      }

      .features {
        margin-bottom: 4rem;
      }

      .features h2 {
        text-align: center;
        margin-bottom: 2rem;
        font-size: 2.5rem;
      }

      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
      }

      .feature-card {
        background: var(--surface);
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        border: 1px solid var(--border);
        transition: all 0.3s ease;
      }

      .feature-card:hover {
        transform: translateY(-8px);
        box-shadow: var(--shadow-lg);
        border-color: var(--accent);
      }

      .feature-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .feature-card h3 {
        color: var(--primary);
        margin-bottom: 0.75rem;
      }

      .feature-card p {
        color: var(--text-secondary);
        margin: 0;
      }

      .news-section {
        margin-bottom: 3rem;
      }

      .news-section h2 {
        margin-bottom: 2rem;
        font-size: 2.5rem;
      }

      .news-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .news-card {
        background: var(--surface);
        border-radius: 12px;
        padding: 2rem;
        border-left: 4px solid var(--accent);
        transition: all 0.3s ease;
        box-shadow: var(--shadow-sm);
      }

      .news-card:hover {
        box-shadow: var(--shadow-md);
        transform: translateX(4px);
      }

      .news-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 0.75rem;
      }

      .news-card h3 {
        margin: 0;
        flex: 1;
      }

      .news-meta {
        font-size: 0.9rem;
        color: var(--text-secondary);
        margin-bottom: 1rem;
      }

      .news-content {
        color: var(--text-secondary);
        margin-bottom: 1rem;
        line-height: 1.6;
      }

      .read-more {
        color: var(--accent);
        font-weight: 600;
        transition: all 0.3s ease;
      }

      .read-more:hover {
        color: var(--accent-dark);
        margin-left: 0.25rem;
      }

      @media (max-width: 768px) {
        .hero {
          padding: 2rem 1rem;
        }

        .hero h1 {
          font-size: 2rem;
        }

        .hero-actions {
          flex-direction: column;
        }

        .features-grid {
          grid-template-columns: 1fr;
        }

        .news-header {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  t: any;

  newsItems: NewsItem[] = [
    {
      id: 1,
      titleKey: 'welcomeTitle',
      contentKey: 'welcomeContent',
      date: '2025-12-04',
      author: 'Admin',
      categoryKey: 'announcement',
    },
    {
      id: 2,
      titleKey: 'featuresTitle',
      contentKey: 'featuresContent',
      date: '2025-12-03',
      author: 'Team',
      categoryKey: 'update',
    },
    {
      id: 3,
      titleKey: 'securityTitle',
      contentKey: 'securityContent',
      date: '2025-12-02',
      author: 'Security Team',
      categoryKey: 'security',
    },
  ];

  constructor(private languageService: LanguageService) {
    this.t = this.languageService.getTranslations();
  }

  ngOnInit(): void {
    this.languageService.currentLanguage$.subscribe(() => {
      this.t = this.languageService.getTranslations();
    });
  }

  getNewsTitle(key: string): string {
    return (this.t.news as any)[key] || key;
  }

  getNewsContent(key: string): string {
    return (this.t.news as any)[key] || key;
  }

  getNewsCategory(key: string): string {
    return (this.t.home as any)[key] || key;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const lang = this.languageService.getCurrentLanguage();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', options);
  }
}
