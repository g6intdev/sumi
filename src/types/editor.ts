export type CanvasObjectType = 'character' | 'asset';

export type CanvasObject = {
  id: string;
  type: CanvasObjectType;
  assetId: string;
  /** Horizontal position as a fraction of the panel width (0–1). */
  x: number;
  /** Vertical position as a fraction of the panel height (0–1). */
  y: number;
  /** Object width as a fraction of the panel width (0–1). */
  width: number;
  /** Object height as a fraction of the panel height (0–1). */
  height: number;
  expressionId?: string;
  dialogue?: string;
};

export type Panel = {
  backgroundId?: string;
  objects: CanvasObject[];
};
