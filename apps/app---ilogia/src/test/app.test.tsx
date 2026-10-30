import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@ilogia/auth';
import { LocaleProvider, ToastProvider } from '@ilogia/ui';
import { App } from '../App';
import { ar, en } from '../i18n';

const setup = (path = '/') => render(
  <LocaleProvider dicts={{ ar, en }}><ToastProvider><AuthProvider client={null}>
    <MemoryRouter initialEntries={[path]}><App /></MemoryRouter>
  </AuthProvider></ToastProvider></LocaleProvider>);

describe('app flows (no Supabase configured)', () => {
  it('protected route redirects to login and explains missing config', async () => {
    setup('/profile');
    expect(await screen.findByTestId('not-configured')).toBeInTheDocument();
    expect(screen.getByTestId('login-submit')).toBeDisabled();
  });
  it('demo mode → dashboard with labelled sample data → logout', async () => {
    setup('/login');
    fireEvent.click(await screen.findByTestId('demo'));
    expect(await screen.findByTestId('demo-banner')).toBeInTheDocument();
    expect(await screen.findByTestId('greeting')).toHaveTextContent('طالب');
    expect(screen.getByTestId('heatmap').children.length).toBeGreaterThanOrEqual(78);
    fireEvent.click(screen.getByText('الخروج من العرض'));
    await waitFor(() => expect(screen.getByTestId('login-submit')).toBeInTheDocument());
  });
  it('navigates to services; planned apps are not links', async () => {
    setup('/login'); fireEvent.click(await screen.findByTestId('demo'));
    await screen.findByTestId('greeting');
    fireEvent.click(screen.getByText('كل الخدمات'));
    expect(await screen.findByRole('heading', { name: 'خدمات منظومة iLogia' })).toBeInTheDocument();
    expect(screen.getByTestId('eco-exams').querySelector('a')).toBeNull();
  });
});
