import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import {
  CameraProps,
  FacingMode,
  Stream,
  SetStream,
  SetNumberOfCameras,
  SetNotSupported,
  SetPermissionDenied,
} from './types';
import { Container, Wrapper, Canvas, Cam, ErrorMsg } from './styles';

export const Camera = React.forwardRef<unknown, CameraProps>(
  (
    {
      facingMode = 'user',
      aspectRatio = 'cover',
      numberOfCamerasCallback = () => null,
      videoSourceDeviceId = undefined,
      errorMessages = {
        noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
        permissionDenied: 'Permission denied. Please refresh and give camera permission.',
        switchCamera:
          'It is not possible to switch camera to different one because there is only one video device accessible.',
        canvas: 'Canvas is not supported.',
      },
      videoReadyCallback = () => null,
    },
    ref,
  ) => {
    const player = useRef<HTMLVideoElement>(null);
    const canvas = useRef<HTMLCanvasElement>(null);
    const context = useRef<any | null>(null);
    const container = useRef<HTMLDivElement>(null);
    const [numberOfCameras, setNumberOfCameras] = useState<number>(0);
    const [stream, setStream] = useState<Stream>(null);
    const [currentFacingMode, setFacingMode] = useState<FacingMode>(facingMode);
    const [notSupported, setNotSupported] = useState<boolean>(false);
    const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
    const [torchSupported, setTorchSupported] = useState<boolean>(false);
    const [torch, setTorch] = useState<boolean>(false);
    const mounted = useRef(false);

    useEffect(() => {
      mounted.current = true;

      return () => {
        mounted.current = false;
      };
    }, []);

    useEffect(() => {
      numberOfCamerasCallback(numberOfCameras);
    }, [numberOfCameras]);

    const switchTorch = async (on = false) => {
      if (stream && navigator?.mediaDevices && !!mounted.current) {
        const supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
        const [track] = stream.getTracks();
        if (supportedConstraints && 'torch' in supportedConstraints && track) {
          try {
            await track.applyConstraints({ advanced: [{ torch: on }] } as MediaTrackConstraintSet);
            return true;
          } catch {
            return false;
          }
        }
      }

      return false;
    };

    useEffect(() => {
      switchTorch(torch);
    }, [torch]);

    useImperativeHandle(ref, () => ({
      takePhoto: (type?: 'base64url' | 'imgData') => {
        if (numberOfCameras < 1) {
          throw new Error(errorMessages.noCameraAccessible);
        }

        if (canvas?.current) {
          const playerWidth = player?.current?.videoWidth || 1280;
          const playerHeight = player?.current?.videoHeight || 720;
          const playerAR = playerWidth / playerHeight;

          const canvasWidth = container?.current?.offsetWidth || 1280;
          const canvasHeight = container?.current?.offsetHeight || 1280;
          const canvasAR = canvasWidth / canvasHeight;

          let sX, sY, sW, sH, imgData;

          if (playerAR > canvasAR) {
            sH = playerHeight;
            sW = playerHeight * canvasAR;
            sX = (playerWidth - sW) / 2;
            sY = 0;
          } else {
            sW = playerWidth;
            sH = playerWidth / canvasAR;
            sX = 0;
            sY = (playerHeight - sH) / 2;
          }

          canvas.current.width = sW;
          canvas.current.height = sH;

          if (!context.current) {
            context.current = canvas.current.getContext('2d', { willReadFrequently: true });
          }

          if (context.current && player?.current) {
            context.current.drawImage(player.current, sX, sY, sW, sH, 0, 0, sW, sH);
          }

          switch (type) {
            case 'imgData':
              imgData = context.current?.getImageData(0, 0, sW, sH);
              break;
            default: /* base64url */
              imgData = canvas.current.toDataURL('image/jpeg');
              break;
          }

          return imgData;
        } else {
          throw new Error(errorMessages.canvas);
        }
      },
      switchCamera: () => {
        if (numberOfCameras < 1) {
          throw new Error(errorMessages.noCameraAccessible);
        } else if (numberOfCameras < 2) {
          console.error('Error: Unable to switch camera. Only one device is accessible.'); // console only
        }
        const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
        setFacingMode(newFacingMode);
        return newFacingMode;
      },
      getNumberOfCameras: () => {
        return numberOfCameras;
      },
      toggleTorch: () => {
        const torchVal = !torch;
        setTorch(torchVal);
        return torchVal;
      },
      torchSupported: torchSupported,
    }));

    useEffect(() => {
      initCameraStream(
        stream,
        setStream,
        currentFacingMode,
        videoSourceDeviceId,
        setNumberOfCameras,
        setNotSupported,
        setPermissionDenied,
        !!mounted.current,
      );
    }, [currentFacingMode, videoSourceDeviceId]);

    useEffect(() => {
      switchTorch(false).then((success) => setTorchSupported(success));
      if (stream && player && player.current) {
        player.current.srcObject = stream;
      }
      return () => {
        if (stream) {
          stream.getTracks().forEach((track) => {
            track.stop();
          });
        }
      };
    }, [stream]);

    return (
      <Container ref={container} aspectRatio={aspectRatio}>
        <Wrapper>
          {notSupported ? <ErrorMsg>{errorMessages.noCameraAccessible}</ErrorMsg> : null}
          {permissionDenied ? <ErrorMsg>{errorMessages.permissionDenied}</ErrorMsg> : null}
          <Cam
            ref={player}
            id="video"
            muted={true}
            autoPlay={true}
            playsInline={true}
            mirrored={currentFacingMode === 'user' ? true : false}
            onLoadedData={() => {
              videoReadyCallback();
            }}
          ></Cam>
          <Canvas ref={canvas} />
        </Wrapper>
      </Container>
    );
  },
);

Camera.displayName = 'Camera';

const shouldSwitchToCamera = async (currentFacingMode: FacingMode): Promise<string | undefined> => {
  const cameras: string[] = [];
  if (currentFacingMode === 'environment') {
    await navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter((i) => i.kind == 'videoinput');
      videoDevices.forEach((device) => {
        const capabilities = (device as InputDeviceInfo).getCapabilities();
        if (capabilities.facingMode && capabilities.facingMode.indexOf('environment') >= 0 && capabilities.deviceId) {
          cameras.push(capabilities.deviceId);
        }
      });
    });
  }

  if (cameras.length > 1) {
    return cameras.pop();
  }

  return undefined;
};

const initCameraStream = async (
  stream: Stream,
  setStream: SetStream,
  currentFacingMode: FacingMode,
  videoSourceDeviceId: string | undefined,
  setNumberOfCameras: SetNumberOfCameras,
  setNotSupported: SetNotSupported,
  setPermissionDenied: SetPermissionDenied,
  isMounted: boolean,
) => {
  // stop any active streams in the window
  if (stream) {
    stream.getTracks().forEach((track) => {
      track.stop();
    });
  }

  let cameraDeviceId;

  const switchToCamera = await shouldSwitchToCamera(currentFacingMode);
  if (switchToCamera) {
    cameraDeviceId = switchToCamera;
  } else {
    cameraDeviceId = videoSourceDeviceId ? { exact: videoSourceDeviceId } : undefined;
  }

  const constraints = {
    audio: false,
    video: {
      deviceId: cameraDeviceId,
      facingMode: currentFacingMode,
    },
  };

  if (navigator?.mediaDevices?.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        if (isMounted) {
          setStream(handleSuccess(stream, setNumberOfCameras));
        }
      })
      .catch((err) => {
        handleError(err, setNotSupported, setPermissionDenied);
      });
  } else {
    const getWebcam =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;
    if (getWebcam) {
      getWebcam(
        constraints,
        async (stream) => {
          if (isMounted) {
            setStream(handleSuccess(stream, setNumberOfCameras));
          }
        },
        (err) => {
          handleError(err as Error, setNotSupported, setPermissionDenied);
        },
      );
    } else {
      setNotSupported(true);
    }
  }
};

const handleSuccess = (stream: MediaStream, setNumberOfCameras: SetNumberOfCameras) => {
  navigator.mediaDevices
    .enumerateDevices()
    .then((r) => setNumberOfCameras(r.filter((i) => i.kind === 'videoinput').length));

  return stream;
};

const handleError = (error: Error, setNotSupported: SetNotSupported, setPermissionDenied: SetPermissionDenied) => {
  console.error(error);

  //https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
  if (error.name === 'PermissionDeniedError') {
    setPermissionDenied(true);
  } else {
    setNotSupported(true);
  }
};
