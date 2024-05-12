export function frames(duration: number, sampleRate: number = 44100) {
  return sampleRate * duration / 1000;
}