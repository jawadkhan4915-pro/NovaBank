import React from 'react';
import { CardDetails } from '@novabank/shared';
import { PosTerminalModal } from './PosTerminalModal';

interface CardChargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards: CardDetails[];
  onSuccess: () => void;
}

export const CardChargeModal: React.FC<CardChargeModalProps> = ({ isOpen, onClose, cards, onSuccess }) => {
  return (
    <PosTerminalModal
      isOpen={isOpen}
      onClose={onClose}
      cards={cards}
      onSuccess={onSuccess}
    />
  );
};
