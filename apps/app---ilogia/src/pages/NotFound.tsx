import { Link } from 'react-router-dom';
import { buttonStyles, useI18n } from '@ilogia/ui';
export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <p className="font-display text-5xl font-bold text-gold-500" dir="ltr">404</p>
      <h1 className="mt-4 text-xl font-semibold text-ink">{t('nf.title')}</h1>
      <p className="mt-1 text-sm text-muted">{t('nf.body')}</p>
      <Link to="/" className={`mt-6 ${buttonStyles()}`}>{t('nf.home')}</Link>
    </div>
  );
}
