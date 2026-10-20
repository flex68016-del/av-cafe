'use client';

import { useState, useEffect, useRef } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallButton() {
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  async function handleInstall() {
    const deferredPrompt = deferredPromptRef.current;
    if (!deferredPrompt) {
      // iOS ou pas de prompt disponible - afficher les instructions
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: boolean }).MSStream;
      if (isIOS) {
        setShowIOSInstructions(true);
      } else {
        alert('Pour installer cette application : utilisez le menu de votre navigateur et sélectionnez "Installer application" ou "Ajouter à l\'écran d\'accueil"');
      }
      return;
    }

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;

    deferredPromptRef.current = null;
  }

  return (
    <>
      <button
        onClick={handleInstall}
        className="bg-orange-500 hover:bg-orange-600 text-white px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold min-h-[44px] flex items-center gap-1 sm:gap-2"
      >
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span className="hidden sm:inline">Installer</span>
      </button>

      {showIOSInstructions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowIOSInstructions(false)}>
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4 text-orange-500">Installer sur iPhone/iPad</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-300">
              <li>Ouvrez cette page dans Safari</li>
              <li>Appuyez sur le bouton <strong>Partager</strong> (icône avec une flèche vers le haut en bas de l&apos;écran)</li>
              <li>Faites défiler vers le bas et appuyez sur <strong>&quot;Ajouter à l&apos;écran d&apos;accueil&quot;</strong></li>
              <li>Appuyez sur <strong>&quot;Ajouter&quot;</strong> en haut à droite</li>
            </ol>
            <button
              onClick={() => setShowIOSInstructions(false)}
              className="w-full mt-6 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg min-h-[44px]"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
}
