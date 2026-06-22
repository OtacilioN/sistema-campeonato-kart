"use client";

import { useEffect, useState } from "react";
import { VzIcon } from "@/components/VelozesUI";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isStandaloneMode() {
  if (typeof window === "undefined") return false;
  const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches || navigatorWithStandalone.standalone === true;
}

export function PwaInstallButton() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsInstalled(isStandaloneMode());
    });

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    }

    function handleInstalled() {
      setIsInstalled(true);
      setInstallPrompt(null);
      setShowInstructions(false);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  async function handleInstallClick() {
    if (!installPrompt) {
      setShowInstructions(true);
      return;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    setInstallPrompt(null);

    if (choice.outcome === "accepted") {
      setIsInstalled(true);
    } else {
      setShowInstructions(true);
    }
  }

  if (isInstalled) return null;

  return (
    <>
      <button className="pwa-install-button" type="button" onClick={handleInstallClick}>
        <VzIcon name="download" size={18} />
        <span>Instalar app</span>
      </button>

      {showInstructions ? (
        <div className="pwa-modal-backdrop" role="presentation" onClick={() => setShowInstructions(false)}>
          <section
            aria-labelledby="pwa-install-title"
            aria-modal="true"
            className="pwa-modal"
            role="dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="pwa-modal-head">
              <span className="offline-icon">
                <VzIcon name="download" size={24} />
              </span>
              <button aria-label="Fechar instruções" className="pwa-modal-close" type="button" onClick={() => setShowInstructions(false)}>
                x
              </button>
            </div>
            <h2 id="pwa-install-title">Instalar no celular</h2>
            <ol>
              <li>No Safari do iPhone, toque no botão de compartilhar.</li>
              <li>Escolha &quot;Adicionar à Tela de Início&quot;.</li>
              <li>Confirme em &quot;Adicionar&quot;.</li>
            </ol>
            <p>No Android, se o navegador não mostrar a instalação automática, abra o menu do navegador e escolha &quot;Instalar app&quot; ou &quot;Adicionar à tela inicial&quot;.</p>
            <button className="vz-button primary" type="button" onClick={() => setShowInstructions(false)}>
              Entendi
            </button>
          </section>
        </div>
      ) : null}
    </>
  );
}
