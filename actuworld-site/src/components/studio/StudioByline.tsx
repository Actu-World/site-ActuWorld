import { LogOut } from 'lucide-react';
import { supabase } from '../../lib/studio/supabase';
import { initialsFromName } from '../../lib/studio/images';
import { useLanguage } from '../../i18n/LanguageContext';

// Signature de session façon « byline » de post (métabar auteur de l'app) :
// avatar + nom en petites capitales + rôle, à la place de l'ancienne carte
// « Connecté en tant que ». La déconnexion reste accessible mais discrète.

interface StudioBylineProps {
  displayName: string;
  username?: string | null;
  avatarSrc: string | null;
}

export function StudioByline({ displayName, username, avatarSrc }: StudioBylineProps) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  return (
    <div
      className="flex items-center justify-between gap-3 mb-6"
      title={t(`Connecté en tant que ${displayName}`, `Signed in as ${displayName}`)}
    >
      <div className="flex items-center gap-3 min-w-0">
        {avatarSrc ? (
          <img src={avatarSrc} alt="" className="w-10 h-10 rounded-full object-cover shrink-0 bg-aw-surface" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-aw-primary flex items-center justify-center shrink-0">
            <span className="text-white text-[13px] font-semibold">{initialsFromName(displayName)}</span>
          </div>
        )}
        <div className="min-w-0 leading-snug">
          <p className="text-[13px] font-bold tracking-[0.6px] uppercase truncate">{displayName}</p>
          <p className="text-aw-muted text-xs truncate">
            {username ? `@${username} · ` : ''}{t('Correspondant', 'Correspondent')}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => void supabase.auth.signOut()}
        className="inline-flex items-center gap-1.5 text-sm text-aw-muted hover:text-red-500 shrink-0"
        title={t('Se déconnecter', 'Sign out')}
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">{t('Se déconnecter', 'Sign out')}</span>
      </button>
    </div>
  );
}
