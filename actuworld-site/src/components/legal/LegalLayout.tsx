import type { ReactNode } from "react";
import { PageWrapper } from "../animations";
import { useLanguage } from "../../i18n/LanguageContext";

export interface LegalSection {
  /** Ancre stable (utilisée dans le sommaire) */
  id: string;
  title: string;
  body: ReactNode;
}

interface LegalLayoutProps {
  title: string;
  /** Ligne sous le titre : périmètre, date de mise à jour… */
  meta?: ReactNode;
  sections: LegalSection[];
  /** Balise <PageMeta> de la page */
  head?: ReactNode;
}

/**
 * Gabarit des pages légales : titre, méta, sommaire d'ancres (pages longues)
 * et colonne de lecture limitée à ~68 caractères.
 */
export const LegalLayout = ({ title, meta, sections, head }: LegalLayoutProps) => {
  const { isEnglish } = useLanguage();
  const showToc = sections.length >= 5;

  return (
    <PageWrapper className="bg-aw-bg text-aw-text">
      {head}
      <div className="max-w-6xl mx-auto container-px pt-16 md:pt-24 pb-20 md:pb-28">
        <header className={`max-w-[68ch] ${showToc ? "lg:ml-[calc(14rem+4rem)]" : ""}`}>
          <h1>{title}</h1>
          {meta && <p className="mt-4 text-[15px] text-aw-muted">{meta}</p>}
        </header>

        <div className={`mt-12 ${showToc ? "lg:grid lg:grid-cols-[14rem_1fr] lg:gap-16" : ""}`}>
          {showToc && (
            <nav aria-label={isEnglish ? "On this page" : "Sur cette page"} className="mb-12 lg:mb-0">
              <div className="lg:sticky lg:top-24">
                <p className="text-sm font-semibold text-aw-text mb-3">
                  {isEnglish ? "On this page" : "Sur cette page"}
                </p>
                <ol className="space-y-2 text-[15px] border-l border-aw pl-4">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`} className="text-aw-muted hover:text-aw-text">
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </nav>
          )}

          <div className="max-w-[68ch] space-y-12 text-[17px] leading-[1.7] text-aw-text [&_a]:font-semibold [&_a]:text-aw-primary [&_a]:underline [&_a]:underline-offset-[3px] [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_ul]:mt-3 [&_ol]:mt-3 [&_li]:mt-1.5 [&_p+p]:mt-4">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24" aria-labelledby={`${s.id}-title`}>
                <h2 id={`${s.id}-title`} className="text-[1.375rem] mb-4">
                  {s.title}
                </h2>
                {s.body}
              </section>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
