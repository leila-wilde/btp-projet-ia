import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent)
  .then(() => {
    console.log('✅ Angular application bootstrapped successfully');
  })
  .catch((err) => {
    console.error('❌ Error bootstrapping Angular application:', err);
    
    // Display error message in the DOM if Angular fails to bootstrap
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'padding: 20px; background: #fee; border: 2px solid #c33; margin: 20px; border-radius: 8px;';
    errorDiv.innerHTML = `
      <h2 style="color: #c33; margin: 0 0 10px 0;">Application Error</h2>
      <p style="margin: 0;"><strong>Failed to start the application.</strong></p>
      <p style="margin: 10px 0 0 0; font-family: monospace; font-size: 12px;">${err.message || err}</p>
    `;
    document.body.appendChild(errorDiv);
  });

