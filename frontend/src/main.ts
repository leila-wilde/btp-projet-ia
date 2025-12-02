import 'zone.js';  // Required for Angular
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { JwtInterceptor } from './app/core/interceptors/jwt.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ]
})
  .then(() => {
    console.log('✅ Angular application bootstrapped successfully');
  })
  .catch((err) => {
    console.error('❌ Error bootstrapping Angular application:', err);
    
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'padding: 20px; background: #fee; border: 2px solid #c33; margin: 20px; border-radius: 8px;';
    errorDiv.innerHTML = `
      <h2 style="color: #c33; margin: 0 0 10px 0;">Application Error</h2>
      <p style="margin: 0;"><strong>Failed to start the application.</strong></p>
      <p style="margin: 10px 0 0 0; font-family: monospace; font-size: 12px;">${err.message || err}</p>
    `;
    document.body.appendChild(errorDiv);
  });

