export function frames(duration: number, sampleRate: number) {
  return sampleRate * duration / 1000;
}