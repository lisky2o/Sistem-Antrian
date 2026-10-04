export function playCallChime(): void {
  try {
    const AudioContextClass = window.AudioContext
      || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return

    const context = new AudioContextClass()
    ;[880, 1174].forEach((frequency, index) => {
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      const startAt = context.currentTime + index * 0.18

      oscillator.type = 'sine'
      oscillator.frequency.value = frequency
      gain.gain.setValueAtTime(0.0001, startAt)
      gain.gain.exponentialRampToValueAtTime(0.15, startAt + 0.025)
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.32)
      oscillator.connect(gain).connect(context.destination)
      oscillator.start(startAt)
      oscillator.stop(startAt + 0.34)
    })

    window.setTimeout(() => void context.close(), 900)
  } catch {
    // Nada panggilan opsional; antrian tetap berfungsi jika audio tidak tersedia.
  }
}

export function speakQueueCall(number: string, counterName: string): void {
  if (!('speechSynthesis' in window)) return

  const spokenDigits: Record<string, string> = {
    '0': 'nol', '1': 'satu', '2': 'dua', '3': 'tiga', '4': 'empat',
    '5': 'lima', '6': 'enam', '7': 'tujuh', '8': 'delapan', '9': 'sembilan',
  }
  const spokenNumber = number.split('').map((digit) => spokenDigits[digit] ?? digit).join(' ')
  const utterance = new SpeechSynthesisUtterance(
    `Nomor antrian, ${spokenNumber}. Silakan menuju ${counterName}.`,
  )

  utterance.lang = 'id-ID'
  utterance.rate = 0.9
  utterance.volume = 1

  const indonesianVoice = window.speechSynthesis
    .getVoices()
    .find((voice) => voice.lang.toLowerCase().startsWith('id'))
  if (indonesianVoice) utterance.voice = indonesianVoice

  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}
