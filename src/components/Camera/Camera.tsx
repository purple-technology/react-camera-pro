import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Container = styled.div<any>`
  width: 100%;
  ${({ aspectRatio }) =>
    aspectRatio === 'cover'
      ? `
      position: absolute;
      bottom: 0
      top: 0
      left: 0
      right: 0`
      : `
      position: relative;
      padding-bottom: ${100 / aspectRatio}%;`}
`;

const Cam = styled.video<any>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  transform: rotateY(${({ mirrored }) => (mirrored ? '180deg' : '0deg')});
`;

type FacingMode = 'user' | 'environment';

export interface CameraProps {
  facingMode?: FacingMode;
  aspectRatio?: 'cover' | number; // for example 16/9, 4/3, 1/1
}

type Stream = MediaStream | null;
type SetStream = React.Dispatch<React.SetStateAction<Stream>>;

export const Camera = React.forwardRef<unknown, CameraProps>(({ facingMode = 'user', aspectRatio = 'cover' }, ref) => {
  const player = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<Stream>(null);
  const [currentFacingMode, setFacingMode] = useState<FacingMode>(facingMode);

  useImperativeHandle(ref, () => ({
    takePhoto: () => {
      console.log('TAKE photo');
    },
    switchCamera: () => {
      setFacingMode(currentFacingMode === 'user' ? 'environment' : 'user');
    },
  }));

  useEffect(() => initCameraStream(stream, setStream, currentFacingMode), [currentFacingMode]);

  useEffect(() => {
    console.log('player');
    if (stream && player && player.current) {
      console.log('stream');
      player.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <Container aspectRatio={aspectRatio}>
      <Wrapper>
        <Cam
          ref={player}
          id="video"
          muted={true}
          autoPlay={true}
          playsInline={true}
          mirrored={currentFacingMode === 'user' ? true : false}
        ></Cam>
      </Wrapper>
    </Container>
  );
});

Camera.displayName = 'Camera';

const initCameraStream = (stream: Stream, setStream: SetStream, currentFacingMode: FacingMode) => {
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
    },
  };

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(stream => {
      setStream(handleSuccess(stream));
    })
    .catch(handleError);
};

const handleSuccess = (stream: MediaStream) => {
  const track = stream.getVideoTracks()[0];
  const settings = track.getSettings();
  const str = JSON.stringify(settings, null, 4);
  console.log('settings ' + str);

  return stream;
  //return navigator.mediaDevices.enumerateDevices();
};

const handleError = (error: Error) => {
  console.log(error);

  //https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
  if (error.name === 'PermissionDeniedError') {
    throw new Error('Permission denied. Please refresh and give camera permission.');
  }
};
