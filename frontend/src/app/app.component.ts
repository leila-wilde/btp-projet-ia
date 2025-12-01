import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div style="min-height: 100vh; background: #f5f5f5;">
      <header style="background: #2c3e50; color: white; padding: 1rem;">
        <h1 style="margin: 0;">🏝️ L'Archipel Libre</h1>
      </header>
      <main style="padding: 2rem;">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
  `]
})
export class AppComponent {}

