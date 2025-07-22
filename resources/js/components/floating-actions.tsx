import { Button } from '@/components/ui/button';
import React from 'react';

interface FloatingActionsProps {
  /** Texto descriptivo a mostrar junto a los botones */
  text: string;
  /** Handler al pulsar "Guardar" */
  onSave: () => void;
  /** Handler al pulsar "Descartar" */
  onDiscard: () => void;
  /** Deshabilitar el botón de Guardar */
  disableSave?: boolean;
  /** Deshabilitar el botón de Descartar */
  disableDiscard?: boolean;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({ text, onSave, onDiscard, disableSave = false, disableDiscard = false }) => {
  return (
    <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center">
      <div className="flex items-center gap-4 rounded-lg bg-white px-6 py-3 shadow-lg">
        <span className="text-sm font-medium text-gray-700">{text}</span>
        <Button onClick={onSave} disabled={disableSave}>
          Guardar
        </Button>
        <Button variant="ghost" onClick={onDiscard} disabled={disableDiscard}>
          Descartar
        </Button>
      </div>
    </div>
  );
};
