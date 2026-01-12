import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => {
  console.error('Failed to bootstrap application:', err);
  // Optional: Display user-friendly error message
  const root = document.getElementById('app');
  if (root) {
    root.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
        <div style="text-align: center;">
          <h1 style="color: #dc3545;">Application Failed to Start</h1>
          <p>Please check the console for more details or contact support.</p>
        </div>
      </div>
    `;
  }
});
