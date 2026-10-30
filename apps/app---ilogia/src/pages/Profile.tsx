import { useState } from 'react';
import { z } from 'zod';
import { Pencil } from 'lucide-react';
import { useAuth, withTimeout, authErrorMessage } from '@ilogia/auth';
import { Avatar, Badge, Button, ErrorState, Input, Select, Skeleton, useI18n, useToast } from '@ilogia/ui';
import { useDashboard } from '../data/useDashboard';
import { PageHeader } from '../components/Shell';
import { SubscriptionBadge } from './Home';

const schema = z.object({ name: z.string().trim().min(3), grade: z.coerce.number().int().positive() });

export default function ProfilePage() {
  const { t, date, locale } = useI18n(); const toast = useToast();
  const { profile, user, roles, status, client, refreshProfile } = useAuth();
  const { data, loading, error, reload } = useDashboard();
  const [edit, setEdit] = useState(false); const [saving, setSaving] = useState(false);
  const [name, setName] = useState(profile?.full_name ?? ''); const [grade, setGrade] = useState(String(profile?.grade_id ?? ''));
  const [errs, setErrs] = useState<{ name?: string; grade?: string }>({});
  if (loading && !data) return <Skeleton className="h-72" />;
  if (error || !data) return <ErrorState title={t('err.load')} body={t('err.loadBody')} onRetry={reload} retryLabel={t('err.retry')} />;

  const gradeName = data.grades.find((g) => g.id === Number(profile?.grade_id))?.name ?? (data.sample ? data.grades[0]?.name : null);
  const roleLabel = roles.includes('admin') ? t('role.admin') : roles.includes('teacher') ? t('role.teacher') : t('role.student');
  const created = profile?.created_at || user?.created_at;

  const save = async () => {
    const r = schema.safeParse({ name, grade });
    if (!r.success) { const f = r.error.flatten().fieldErrors; setErrs({ name: f.name ? t('p.nameErr') : undefined, grade: f.grade ? t('p.gradeErr') : undefined }); return; }
    setErrs({});
    if (status === 'demo' || !client) { toast({ tone: 'info', text: t('p.demoNoSave') }); return; }
    setSaving(true);
    try {
      // Existing server-side RPC (migration 010 on ilogia-eg.com). The client never writes role columns.
      const res = await withTimeout(client.rpc('save_my_profile', { p_name: r.data.name, p_grade_id: r.data.grade }));
      if (res.error) throw res.error;
      await refreshProfile(); setEdit(false); toast({ tone: 'success', text: t('p.saved') });
    } catch (e) { toast({ tone: 'error', text: authErrorMessage(e, locale) }); } finally { setSaving(false); }
  };

  const rows: [string, React.ReactNode][] = [
    [t('p.email'), <span dir="ltr">{profile?.email || user?.email || '—'}</span>],
    [t('p.grade'), gradeName || '—'],
    [t('p.role'), roleLabel],
    [t('p.since'), created ? date(created) : '—'],
    [t('p.subscription'), <SubscriptionBadge sub={data.subscription} />],
  ];

  return (
    <div className="max-w-3xl">
      <PageHeader title={t('p.title')} />
      <section className="overflow-hidden rounded-xl border border-line bg-surface shadow-1">
        <div className="flex flex-wrap items-center gap-4 bg-brand-700 p-5 text-white sm:p-6">
          <span className="rounded-full border-[3px] border-gold-500"><Avatar name={profile?.full_name} size={64} /></span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-[clamp(1.3rem,3.5vw,1.75rem)] font-bold leading-snug text-white" data-testid="profile-name">{profile?.full_name || '—'}</p>
            <p className="truncate text-sm text-white/80" dir="ltr" style={{ textAlign: 'start' }}>{profile?.email}</p>
            <div className="mt-2 flex flex-wrap gap-2"><Badge className="bg-white/[.16] text-white">{roleLabel}</Badge>{data.sample && <Badge className="border-0 bg-gold-500 text-ink">{locale === 'ar' ? 'حساب تجريبي' : 'Demo account'}</Badge>}</div>
          </div>
          {!edit && <Button variant="secondary" size="sm" className="w-full border-white bg-white text-brand-900 hover:bg-cream sm:w-auto" icon={<Pencil className="h-4 w-4" />} onClick={() => { setName(profile?.full_name ?? ''); setGrade(String(profile?.grade_id ?? '')); setEdit(true); }} data-testid="edit-profile">{t('p.edit')}</Button>}
        </div>
        {edit ? (
          <form className="grid gap-4 p-5 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); save(); }} noValidate>
            <Input label={t('p.name')} value={name} onChange={(e) => setName(e.target.value)} error={errs.name} autoComplete="name" data-testid="name-input" />
            <Select label={t('p.grade')} value={grade} onChange={(e) => setGrade(e.target.value)} error={errs.grade} data-testid="grade-select"
              options={[{ value: '', label: t('p.chooseGrade') }, ...data.grades.map((g) => ({ value: String(g.id), label: g.name }))]} />
            <p className="text-xs text-muted sm:col-span-2">{t('p.emailNote')}</p>
            <div className="flex gap-2 sm:col-span-2"><Button type="submit" loading={saving} data-testid="save-profile">{t('p.save')}</Button><Button type="button" variant="ghost" onClick={() => { setEdit(false); setErrs({}); }}>{t('p.cancel')}</Button></div>
          </form>
        ) : (
          <dl className="divide-y divide-line">
            {rows.map(([k, v]) => <div key={k} className="grid grid-cols-[140px_1fr] gap-4 px-5 py-3.5 text-sm"><dt className="text-muted">{k}</dt><dd className="text-ink">{v}</dd></div>)}
          </dl>
        )}
      </section>
    </div>
  );
}
