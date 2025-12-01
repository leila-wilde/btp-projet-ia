import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface NewsItem {
  id: number;
  title: string;
  content: string;
  date: string;
  author: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container">
      <h2>News & Updates</h2>
      <div class="news-list">
        <article *ngFor="let item of newsItems" class="news-item">
          <h3>{{ item.title }}</h3>
          <p class="meta">By {{ item.author }} on {{ item.date }}</p>
          <p class="content">{{ item.content }}</p>
        </article>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 20px;
    }

    h2 {
      font-size: 28px;
      margin-bottom: 20px;
      color: #2c3e50;
    }

    .news-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .news-item {
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border-left: 4px solid #3498db;
    }

    .news-item h3 {
      font-size: 20px;
      color: #2c3e50;
      margin-bottom: 8px;
    }

    .meta {
      font-size: 12px;
      color: #7f8c8d;
      margin-bottom: 12px;
    }

    .content {
      line-height: 1.6;
      color: #555;
    }
  `]
})
export class HomeComponent {
  newsItems: NewsItem[] = [
    {
      id: 1,
      title: 'Welcome to L\'Archipel Libre',
      content: 'This is our new web platform. We\'re building a community-driven platform with modern web technologies. Stay tuned for more updates!',
      date: '2025-10-30',
      author: 'Admin'
    },
    {
      id: 2,
      title: 'Platform Launch',
      content: 'We\'re excited to announce the launch of our new web interface. This is the first step in our journey to create a better user experience.',
      date: '2025-10-28',
      author: 'Team'
    },
    {
      id: 3,
      title: 'Authentication System',
      content: 'Our new authentication system is now integrated. Users can securely log in and manage their profiles with ease.',
      date: '2025-10-25',
      author: 'Security Team'
    }
  ];
}
