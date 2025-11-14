import React from 'react';
import Image from 'next/image';

// Icône Wave
export const WaveIcon: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <Image
    src="/wave.png"
    alt="Wave"
    width={120}
    height={120}
    className={className}
    style={{ objectFit: 'contain' }}
  />
);

// Icône Orange Money
export const OrangeMoneyIcon: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <Image
    src="/om.png"
    alt="Orange Money"
    width={120}
    height={120}
    className={className}
    style={{ objectFit: 'contain' }}
  />
);

// Icône Carte bancaire
export const CreditCardIcon: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <Image
    src="/cb.png"
    alt="Carte bancaire"
    width={120}
    height={120}
    className={className}
    style={{ objectFit: 'contain' }}
  />
);

