export function frames(duration: number, sampleRate = 44100) {
  return sampleRate * duration / 1000;
}