import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <main style="padding:16px">
      <h1>Archipel Libre</h1>
      <p>Angular app is running inside Docker.</p>
    </main>
  `
})
export class AppComponent {}
