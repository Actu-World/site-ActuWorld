import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, LogIn } from 'lucide-react';
import { PageMeta } from '../components/PageMeta';
import { useLanguage } from '../i18n/LanguageContext';
import { supabase } from '../lib/studio/supabase';

/**
 * Atterrissage du lien de connexion envoyé par email (Studio, ASV Pro).
 *
 * Le mail pointe ici, sur actuworld.fr, et non sur l'adresse Supabase : un lien vers
 * un autre domaine que l'expéditeur fait classer le mail en indésirables. La session
 * n'est ouverte qu'au clic (verifyOtp avec le token_hash) : les antivirus de
 * messagerie qui ouvrent les liens à l'avance ne consomment plus le lien à usage unique.
 * Modèle du mail : Docs/site/EMAIL-TEMPLATE-MAGIC-LINK.html.
 */

// Destinations autorisées après connexion (jamais une adresse prise telle quelle dans l'URL).
const NEXT_PATHS = ['/pro', '/studio/editeur'] as const;
// Rapport ASV Pro ouvert depuis l'app : /pro/rapport/<uuid>, rien d'autre.
const PRO_REPORT_PATH = /^\/pro\/rapport\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function safeNext(raw: string | null): string {
  const value = raw ?? '';
  if ((NEXT_PATHS as readonly string[]).includes(value) || PRO_REPORT_PATH.test(value)) return value;
  return '/studio/editeur';
}

export default function AuthConfirmPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [state, setState] = useState<'idle' | 'verifying' | 'error'>('idle');

  const tokenHash = params.get('token_hash') ?? '';
  const next = safeNext(params.get('next'));
  const isPro = next.startsWith('/pro');
  // Ouverture depuis l'app (déjà connectée) : la session s'ouvre sans clic. Le
  // clic ne protège que les liens reçus par mail, que les antivirus pré-ouvrent.
  const auto = params.get('auto') === '1' && PRO_REPORT_PATH.test(next);
  const loginPath = isPro ? '/pro' : '/studio';
  const target = isPro ? 'ASV Pro' : t('le Studio', 'the Studio');

  const confirm = async () => {
    if (!tokenHash || state === 'verifying') return;
    setState('verifying');
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'magiclink' });
    if (error) {
      setState('error');
      return;
    }
    navigate(next, { replace: true });
  };

  // Une seule tentative, même si React rejoue l'effet (le lien ne sert qu'une fois).
  const autoStarted = useRef(false);
  useEffect(() => {
    if (!auto || !tokenHash || autoStarted.current) return;
    autoStarted.current = true;
    confirm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, tokenHash]);

  const broken = !tokenHash || state === 'error';

  if (auto && !broken) {
    return (
      <div className="max-w-lg mx-auto container-px py-16 sm:py-24">
        <PageMeta
          title={t('Rapport ASV', 'ASV report')}
          description={t('Ouverture de ton rapport ASV Pro.', 'Opening your ASV Pro report.')}
          path="/auth/confirm"
          noindex
        />
        <div className="card p-8 text-center" role="status">
          <Loader2 className="w-5 h-5 animate-spin mx-auto text-aw-muted" aria-hidden="true" />
          <h1 className="body-semi text-lg mt-4 mb-2">{t('Analyse en cours', 'Analysis in progress')}</h1>
          <p className="text-aw-muted text-sm">
            {t('On ouvre ton rapport dans ASV Pro. Les sources sont en train d’être lues.',
              'Opening your report in ASV Pro. The sources are being read.')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto container-px py-16 sm:py-24">
      <PageMeta
        title={t('Connexion', 'Sign in')}
        description={t('Connexion à ton compte ActuWorld.', 'Sign in to your ActuWorld account.')}
        path="/auth/confirm"
        noindex
      />
      <div className="card p-8 text-center" role={broken ? 'alert' : undefined}>
        {broken ? (
          <>
            <h1 className="body-semi text-lg mb-2">{t('Ce lien ne fonctionne plus', 'This link no longer works')}</h1>
            <p className="text-aw-muted text-sm">
              {t(
                'Il a peut-être déjà servi ou il a expiré (un lien vaut une heure, une seule fois). Demande un nouveau lien.',
                'It may have been used already or expired (a link is valid for one hour, once). Request a new link.',
              )}
            </p>
            <Link to={loginPath} className="btn-outline mt-6 inline-flex">
              {t('Recevoir un nouveau lien', 'Get a new link')}
            </Link>
          </>
        ) : (
          <>
            <h1 className="body-semi text-lg mb-2">{t('Connexion à ton compte', 'Sign in to your account')}</h1>
            <p className="text-aw-muted text-sm">
              {t(`Un clic et te voilà dans ${target}.`, `One click and you are in ${target}.`)}
            </p>
            <button type="button" onClick={confirm} disabled={state === 'verifying'} className="btn-primary mt-6 inline-flex items-center gap-2">
              {state === 'verifying'
                ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                : <LogIn className="w-4 h-4" aria-hidden="true" />}
              {isPro ? t('Ouvrir ASV Pro', 'Open ASV Pro') : t('Ouvrir le Studio', 'Open the Studio')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
