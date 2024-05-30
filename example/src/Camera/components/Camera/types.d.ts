/// <reference types="react" />
export declare type FacingMode = 'user' | 'environment';
export declare type AspectRatio = 'cover' | number;
export declare type Stream = MediaStream | null;
export declare type SetStream = React.Dispatch<React.SetStateAction<Stream>>;
export declare type SetNumberOfCameras = React.Dispatch<React.SetStateAction<number>>;
export declare type SetNotSupported = React.Dispatch<React.SetStateAction<boolean>>;
export declare type SetPermissionDenied = React.Dispatch<React.SetStateAction<boolean>>;
export interface CameraProps {
    facingMode?: FacingMode;
    aspectRatio?: AspectRatio;
    numberOfCamerasCallback?(numberOfCameras: number): void;
    videoSourceDeviceId?: string | undefined;
    errorMessages: {
        noCameraAccessible?: string;
        permissionDenied?: string;
        switchCamera?: string;
        canvas?: string;
    };
    videoReadyCallback?(): void;
}
export declare type CameraType = React.ForwardRefExoticComponent<CameraProps & React.RefAttributes<unknown>> & {
    takePhoto(type?: 'base64url' | 'imgData'): string | ImageData;
    switchCamera(): FacingMode;
    getNumberOfCameras(): number;
    toggleTorch(): boolean;
    torchSupported: boolean;
};
