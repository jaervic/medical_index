import { Download, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { exportPersonalData, importPersonalData } from '@/lib/storage';

/**
 * Exporta/importa los datos personales (fijados, recientes, busquedas, tema).
 * Son solo preferencias locales: nunca hay datos de pacientes.
 */
export function DataControls({ onImported }: { onImported: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(exportPersonalData(), null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'meddex-datos.json';
    link.click();
    URL.revokeObjectURL(url);
    setMessage('Datos exportados.');
  };

  const handleImport = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text()) as unknown;
      const result = importPersonalData(parsed);
      if (result.ok) {
        setMessage('Datos importados. Recargando...');
        onImported();
      } else {
        setMessage(`No se importo: ${result.error}.`);
      }
    } catch {
      setMessage('No se pudo leer el archivo (JSON invalido).');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-ink ring-1 ring-inset ring-edge transition hover:bg-ink/5"
        >
          <Download size={14} />
          Exportar datos
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-ink ring-1 ring-inset ring-edge transition hover:bg-ink/5"
        >
          <Upload size={14} />
          Importar datos
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleImport(file);
            event.target.value = '';
          }}
        />
      </div>
      {message && <p className="text-xs text-muted">{message}</p>}
    </div>
  );
}
