/**
 * Utility functions for currency, dates, and localized Indonesian formatting
 */

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumberIndo(amount: number): string {
  return new Intl.NumberFormat('id-ID').format(amount);
}

export function formatDateIndo(dateString: string): string {
  try {
    const [year, month, day] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatMonthYearIndo(monthYearStr: string): string {
  try {
    const [year, month] = monthYearStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
    }).format(date);
  } catch {
    return monthYearStr;
  }
}

/**
 * Text-to-speech helper in Indonesian for elderly residents
 */
export function playSpeechIndo(text: string, onEnd?: () => void): boolean {
  if (!('speechSynthesis' in window)) {
    return false;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'id-ID';
  utterance.rate = 0.95; // slightly slower for elderly comprehension
  utterance.pitch = 1.0;

  // Attempt to select Indonesian voice if available
  const voices = window.speechSynthesis.getVoices();
  const idVoice = voices.find(v => v.lang.startsWith('id') || v.name.toLowerCase().includes('indonesia'));
  if (idVoice) {
    utterance.voice = idVoice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeech(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function createWhatsAppUrl(phone: string, message: string): string {
  // Normalize Indonesian phone number (08xx -> 628xx)
  let cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.slice(1);
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
