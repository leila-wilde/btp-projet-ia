import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface NewsItem {
  id: number;
  title: string;
  content: string;
  date: string;
  author: string;
  category?: string;
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
          <h1>Welcome to L'Archipel Libre</h1>
          <p class="hero-subtitle">Des îlots de technologie au service du lien social</p>
          <p class="hero-description">Join our community platform built on open-source technology, connecting people through events, discussions, and collaborative workshops.</p>
          <div class="hero-actions">
            <button class="btn-primary" routerLink="/auth/register">Get Started</button>
            <button class="btn-secondary" routerLink="/forum">Explore</button>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features">
        <h2>Our Features</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📅</div>
            <h3>Events</h3>
            <p>Discover and organize community events in your area</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💬</div>
            <h3>Forum</h3>
            <p>Engage in meaningful discussions with the community</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🛠️</div>
            <h3>Workshops</h3>
            <p>Share and learn through collaborative workshops</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">👥</div>
            <h3>Community</h3>
            <p>Connect with like-minded individuals</p>
          </div>
        </div>
      </section>

      <!-- News Section -->
      <section class="news-section">
        <h2>Latest News & Updates</h2>
        <div class="news-list">
          <article *ngFor="let item of newsItems" class="news-card">
            <div class="news-header">
              <h3>{{ item.title }}</h3>
              <span *ngIf="item.category" class="badge badge-primary">{{ item.category }}</span>
            </div>
            <p class="news-meta">By <strong>{{ item.author }}</strong> · {{ formatDate(item.date) }}</p>
            <p class="news-content">{{ item.content }}</p>
            <a href="#" class="read-more">Read more →</a>
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

      /* Hero Section */
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

      /* Features Section */
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

      /* News Section */
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
        align-items: start;
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
export class HomeComponent {
  newsItems: NewsItem[] = [
    {
      id: 1,
      title: "Welcome to L'Archipel Libre",
      content:
        "We're excited to launch our new web platform. This is a community-driven space built with modern, open-source technology. Explore events, join discussions, and collaborate with fellow community members.",
      date: '2025-12-04',
      author: 'Admin',
      category: 'Announcement',
    },
    {
      id: 2,
      title: 'Platform Features Now Live',
      content:
        "All core features are now available! Create and manage events, start forum discussions, propose workshops, and build meaningful connections with your community.",
      date: '2025-12-03',
      author: 'Team',
      category: 'Update',
    },
    {
      id: 3,
      title: 'Security & Privacy First',
      content:
        'Your data is protected with industry-standard encryption and security practices. We respect your privacy and give you full control over your information.',
      date: '2025-12-02',
      author: 'Security Team',
      category: 'Security',
    },
  ];

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}
