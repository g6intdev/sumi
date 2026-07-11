export type CanvasObjectType = 'character' | 'asset';

export type CanvasObject = {
  id: string;
  type: CanvasObjectType;
  assetId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  expressionId?: string;
  dialogue?: string;
};

export type Panel = {
  backgroundId?: string;
  objects: CanvasObject[];
};
