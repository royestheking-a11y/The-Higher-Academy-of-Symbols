import { useState, useCallback } from 'react';
import { ConfirmModal } from '../components/ConfirmModal';

export const useConfirm = () => {
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    titleAr: string;
    titleEn: string;
    messageAr: string;
    messageEn: string;
    onConfirm: () => void;
  } | null>(null);

  const confirm = useCallback((titleAr: string, titleEn: string, messageAr: string, messageEn: string, onConfirm: () => void) => {
    setConfirmState({
      isOpen: true,
      titleAr,
      titleEn,
      messageAr,
      messageEn,
      onConfirm
    });
  }, []);

  const ConfirmDialog = useCallback(() => {
    if (!confirmState?.isOpen) return null;
    return (
      <ConfirmModal
        isOpen={confirmState.isOpen}
        titleAr={confirmState.titleAr}
        titleEn={confirmState.titleEn}
        messageAr={confirmState.messageAr}
        messageEn={confirmState.messageEn}
        onConfirm={() => {
          confirmState.onConfirm();
          setConfirmState(null);
        }}
        onCancel={() => setConfirmState(null)}
      />
    );
  }, [confirmState]);

  return { confirm, ConfirmDialog };
};
