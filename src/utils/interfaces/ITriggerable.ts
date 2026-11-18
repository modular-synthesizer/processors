export interface ITriggerable {
  readonly gate: boolean;
  readonly rising: boolean;
  readonly falling: boolean;
}