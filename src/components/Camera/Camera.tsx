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
      errorMessage = 'Any camera device accessible. Please connect your camera or try different browser.',
      permissionDeniedMessage = 'Permission denied. Please refresh and give camera permission.',
    },
    ref,
  ) => {
    const player = useRef<HTMLVideoElement>(null);
    const canvas = useRef<HTMLCanvasElement>(null);
    const container = useRef<HTMLDivElement>(null);
    const [numberOfCameras, setNumberOfCameras] = useState<number>(0);
    const [stream, setStream] = useState<Stream>(null);
    const [currentFacingMode, setFacingMode] = useState<FacingMode>(facingMode);
    const [notSupported, setNotSupported] = useState<boolean>(false);
    const [permissionDenied, setPermissionDenied] = useState<boolean>(false);

    useEffect(() => {
      numberOfCamerasCallback(numberOfCameras);
    }, [numberOfCameras]);

    useImperativeHandle(ref, () => ({
      takePhoto: () => {
        if (numberOfCameras < 1) {
          throw new Error("There isn't any video device accessible.");
        }

        if (canvas?.current) {
          const playerWidth = player?.current?.videoWidth || 1280;
          const playerHeight = player?.current?.videoHeight || 720;
          const playerAR = playerWidth / playerHeight;

          const canvasWidth = container?.current?.offsetWidth || 1280;
          const canvasHeight = container?.current?.offsetHeight || 1280;
          const canvasAR = canvasWidth / canvasHeight;

          let sX, sY, sW, sH;

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

          const context = canvas.current.getContext('2d');
          if (context && player?.current) {
            context.drawImage(player.current, sX, sY, sW, sH, 0, 0, sW, sH);
          }

          const imgData = canvas.current.toDataURL('image/jpeg');
          return imgData;
        } else {
          throw new Error('Canvas is not supported');
        }
      },
      switchCamera: () => {
        if (numberOfCameras < 1) {
          throw new Error("There isn't any video device accessible.");
        } else if (numberOfCameras < 2) {
          console.warn(
            'It is not possible to switch camera to different one, because there is only one video device accessible.',
          );
        }
        const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
        setFacingMode(newFacingMode);
        return newFacingMode;
      },
      getNumberOfCameras: () => {
        return numberOfCameras;
      },
    }));

    useEffect(() => {
      initCameraStream(stream, setStream, currentFacingMode, setNumberOfCameras, setNotSupported, setPermissionDenied);
    }, [currentFacingMode]);

    useEffect(() => {
      if (stream && player && player.current) {
        player.current.srcObject = stream;
      }
      return () => {
        console.log('stop!');
        if (stream) {
          stream.getTracks().forEach(track => {
            track.stop();
          });
        }
      };
    }, [stream]);

    return (
      <Container ref={container} aspectRatio={aspectRatio}>
        <Wrapper>
          {permissionDenied ? <ErrorMsg>{errorMessage}</ErrorMsg> : null}
          {notSupported ? <ErrorMsg>{permissionDeniedMessage}</ErrorMsg> : null}
          <Cam
            ref={player}
            id="video"
            muted={true}
            autoPlay={true}
            playsInline={true}
            mirrored={currentFacingMode === 'user' ? true : false}
          ></Cam>
          <Canvas ref={canvas} />
        </Wrapper>
      </Container>
    );
  },
);

Camera.displayName = 'Camera';

const initCameraStream = (
  stream: Stream,
  setStream: SetStream,
  currentFacingMode: FacingMode,
  setNumberOfCameras: SetNumberOfCameras,
  setNotSupported: SetNotSupported,
  setPermissionDenied: SetPermissionDenied,
) => {
  // stop any active streams in the window
  if (stream) {
    stream.getTracks().forEach(track => {
      track.stop();
    });
  }

  const constraints = {
    audio: false,
    video: {
      facingMode: currentFacingMode,
      width: { ideal: 1920 },
      height: { ideal: 1920 },
    },
  };

  if (navigator?.mediaDevices?.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(stream => {
        setStream(handleSuccess(stream, setNumberOfCameras));
      })
      .catch(err => {
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
        stream => {
          setStream(handleSuccess(stream, setNumberOfCameras));
        },
        err => {
          handleError(err as Error, setNotSupported, setPermissionDenied);
        },
      );
    } else {
      setNotSupported(true);
    }
  }
};

const handleSuccess = (stream: MediaStream, setNumberOfCameras: SetNumberOfCameras) => {
  const track = stream.getVideoTracks()[0];
  const settings = track.getSettings();
  const str = JSON.stringify(settings, null, 4);
  console.log('Camera settings ' + str);
  navigator.mediaDevices
    .enumerateDevices()
    .then(r => setNumberOfCameras(r.filter(i => i.kind === 'videoinput').length));

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
