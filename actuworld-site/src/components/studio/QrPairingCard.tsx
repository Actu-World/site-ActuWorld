import { useCallback, useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, RefreshCw, Smartphone, TimerOff, WifiOff } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  QR_PAYLOAD_PREFIX,
  exchangeTokenHash,
  pollPairing,
  startPairing,
} from '../../lib/studio/pairing';

const POLL_INTERVAL_MS = 2500;

type PairingState = 'idle' | 'loading' | 'active' | 'approving' | 'expired' | 'error';

/**
 * Connexion par QR code : affiche un QR à scanner depuis l'app mobile
 * (Écrire → Écrire sur ordinateur → Scanner le QR code). Quand l'app approuve,
 * la session Supabase est créée ici et useStudioSession redirige vers l'éditeur.
 */
export function QrPairingCard() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  // Sobriété : PAS de start+poll pour chaque visiteur desktop — le cycle de
  // pairing (pair/start + poll toutes les 2,5 s) ne démarre qu'au clic sur
  // « Afficher le QR code ».
  const [started, setStarted] = useState(false);
  const [state, setState] = useState<PairingState>('idle');
  const [qrValue, setQrValue] = useState('');
  // Générations : incrémenter relance un cycle start+poll et invalide l'ancien.
  const [generation, setGeneration] = useState(0);

  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!started) return;

    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const run = async () => {
      setState('loading');
      let pollToken = '';
      try {
        const session = await startPairing();
        if (cancelled) return;
        pollToken = session.pollToken;
        setQrValue(`${QR_PAYLOAD_PREFIX}${session.code}`);
        setState('active');
      } catch {
        if (!cancelled) setState('error');
        return;
      }

      intervalId = setInterval(async () => {
        try {
          const result = await pollPairing(pollToken);
          if (cancelled) return;
          if (result.status === 'expired') {
            clearInterval(intervalId);
            setState('expired');
            return;
          }
          if (result.status === 'approved') {
            clearInterval(intervalId);
            setState('approving');
            try {
              await exchangeTokenHash(result.tokenHash);
              // Rien d'autre à faire : useStudioSession voit la session et
              // StudioLoginPage redirige vers /studio/editeur.
            } catch {
              if (isMountedRef.current) setState('error');
            }
          }
          // pending → on continue à poller
        } catch {
          // Erreur réseau transitoire : on retente au tick suivant.
        }
      }, POLL_INTERVAL_MS);
    };

    void run();

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, [started, generation]);

  const regenerate = useCallback(() => setGeneration((n) => n + 1), []);

  return (
    <div className="card p-6">
      <div className="flex items-start gap-3 mb-4">
        <Smartphone className="w-5 h-5 text-aw-primary shrink-0 mt-0.5" />
        <div>
          <h3 className="body-semi">{t('Connexion rapide avec le téléphone', 'Quick sign-in with your phone')}</h3>
          <p className="text-aw-muted text-sm mt-1">
            {t(
              'Dans l’app ActuWorld : Écrire → « Écrire sur ordinateur » → Scanner le QR code.',
              'In the ActuWorld app: Write → “Write on desktop” → Scan the QR code.'
            )}
          </p>
        </div>
      </div>

      <div className="relative mx-auto w-fit rounded-2xl bg-white p-4 border border-aw">
        {/* Le QR reste rendu (flouté) sous les overlays pour éviter les sauts de layout */}
        <QRCodeSVG
          value={qrValue || 'awstudio1:placeholder'}
          size={196}
          marginSize={0}
          className={state === 'active' ? '' : 'blur-sm opacity-40'}
          aria-label={t('QR code de connexion au Studio', 'Studio sign-in QR code')}
        />

        {state === 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setStarted(true)}
              className="btn-primary btn-sm inline-flex items-center"
            >
              <QrCode className="mr-1.5 h-4 w-4" />
              {t('Afficher le QR code', 'Show the QR code')}
            </button>
          </div>
        )}

        {state === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-aw-primary animate-spin" />
          </div>
        )}

        {state === 'approving' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-gray-700 bg-white/90 rounded-lg px-3 py-2">
              {t('Connexion…', 'Signing in…')}
            </p>
          </div>
        )}

        {(state === 'expired' || state === 'error') && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/85 backdrop-blur-[2px] px-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-aw-primary/10">
              {state === 'expired' ? (
                <TimerOff className="h-6 w-6 text-aw-primary" />
              ) : (
                <WifiOff className="h-6 w-6 text-red-500" />
              )}
            </div>
            <div>
              <p className="body-semi text-gray-800">
                {state === 'expired'
                  ? t('QR code expiré', 'QR code expired')
                  : t('Connexion impossible', 'Connection failed')}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {state === 'expired'
                  ? t('Ce code n’est plus valide.', 'This code is no longer valid.')
                  : t('Impossible de joindre le serveur.', 'Could not reach the server.')}
              </p>
            </div>
            <button type="button" onClick={regenerate} className="btn-primary btn-sm inline-flex items-center">
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              {t('Nouveau code', 'New code')}
            </button>
          </div>
        )}
      </div>

      <p className="text-aw-muted text-xs mt-4 text-center">
        {t(
          'Le QR code est à usage unique et expire au bout de 2 minutes.',
          'The QR code is single-use and expires after 2 minutes.'
        )}
      </p>
    </div>
  );
}
