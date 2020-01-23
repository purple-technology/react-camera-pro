export type FacingMode = 'user' | 'environment';
export type AspectRatio = 'cover' | number; // for example 16/9, 4/3, 1/1
export type Stream = MediaStream | null;
export type SetStream = React.Dispatch<React.SetStateAction<Stream>>;
export type SetNumberOfCameras = React.Dispatch<React.SetStateAction<number>>;
export interface CameraProps {
  facingMode?: FacingMode;
  aspectRatio?: AspectRatio;
  numberOfCamerasCallback?(numberOfCameras: number): void;
}

export type CameraType = React.ForwardRefExoticComponent<CameraProps & React.RefAttributes<unknown>> & {
  takePhoto(): string;
  switchCamera(): FacingMode;
  getNumberOfCameras(): number;
};
