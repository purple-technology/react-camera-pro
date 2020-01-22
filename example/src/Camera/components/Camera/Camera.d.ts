import React from 'react';
declare type FacingMode = 'user' | 'environment';
export interface CameraProps {
    facingMode?: FacingMode;
    aspectRatio?: 'cover' | number;
    numberOfCamerasCallback?(numberOfCameras: number): void;
}
export declare const Camera: React.ForwardRefExoticComponent<CameraProps & React.RefAttributes<unknown>>;
export {};
