let audioContext: AudioContext | null = null

function getAudioContext() {
  audioContext ??= new AudioContext()
  return audioContext
}

// Navegadores só liberam áudio depois de uma interação do usuário com a página.
// O primeiro clique ou tecla "destrava" o som para os alertas seguintes.
function unlockAudio() {
  void getAudioContext().resume()
  window.removeEventListener('pointerdown', unlockAudio)
  window.removeEventListener('keydown', unlockAudio)
}

window.addEventListener('pointerdown', unlockAudio)
window.addEventListener('keydown', unlockAudio)

function playTone(context: AudioContext, frequency: number, startAt: number, duration: number) {
  const oscillator = context.createOscillator()
  const gain = context.createGain()

  oscillator.type = 'sine'
  oscillator.frequency.value = frequency

  gain.gain.setValueAtTime(0.0001, startAt)
  gain.gain.exponentialRampToValueAtTime(0.3, startAt + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration)

  oscillator.connect(gain).connect(context.destination)
  oscillator.start(startAt)
  oscillator.stop(startAt + duration)
}

export function playNewOrderSound() {
  const context = getAudioContext()
  if (context.state !== 'running') return

  const now = context.currentTime
  playTone(context, 880, now, 0.25)
  playTone(context, 1320, now + 0.18, 0.4)
}
