/* eslint-disable */
import React, { useRef, useState, useEffect, useImperativeHandle } from 'react';
import styled from 'styled-components';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
}

var Wrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n"], ["\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n"])));
var Container = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  width: 100%;\n  ", "\n"], ["\n  width: 100%;\n  ",
    "\n"])), function (_a) {
    var aspectRatio = _a.aspectRatio;
    return aspectRatio === 'cover'
        ? "\n    position: absolute;\n    bottom: 0\n    top: 0\n    left: 0\n    right: 0"
        : "\n    position: relative;\n    padding-bottom: " + 100 / aspectRatio + "%;";
});
var Cam = styled.video(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  z-index: 0;\n  transform: rotateY(", ");\n"], ["\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  z-index: 0;\n  transform: rotateY(", ");\n"])), function (_a) {
    var mirrored = _a.mirrored;
    return (mirrored ? '180deg' : '0deg');
});
var Canvas = styled.canvas(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: none;\n"], ["\n  display: none;\n"])));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=styles.js.map

var Camera = React.forwardRef(function (_a, ref) {
    var _b = _a.facingMode, facingMode = _b === void 0 ? 'user' : _b, _c = _a.aspectRatio, aspectRatio = _c === void 0 ? 'cover' : _c, _d = _a.numberOfCamerasCallback, numberOfCamerasCallback = _d === void 0 ? function () { return null; } : _d;
    var player = useRef(null);
    var canvas = useRef(null);
    var container = useRef(null);
    var _e = useState(0), numberOfCameras = _e[0], setNumberOfCameras = _e[1];
    var _f = useState(null), stream = _f[0], setStream = _f[1];
    var _g = useState(facingMode), currentFacingMode = _g[0], setFacingMode = _g[1];
    useEffect(function () {
        numberOfCamerasCallback(numberOfCameras);
    }, [numberOfCameras]);
    useImperativeHandle(ref, function () { return ({
        takePhoto: function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            if (numberOfCameras < 1) {
                throw new Error("There isn't any video device accessible.");
            }
            if ((_a = canvas) === null || _a === void 0 ? void 0 : _a.current) {
                var playerWidth = ((_c = (_b = player) === null || _b === void 0 ? void 0 : _b.current) === null || _c === void 0 ? void 0 : _c.videoWidth) || 1280;
                var playerHeight = ((_e = (_d = player) === null || _d === void 0 ? void 0 : _d.current) === null || _e === void 0 ? void 0 : _e.videoHeight) || 720;
                var playerAR = playerWidth / playerHeight;
                var canvasWidth = ((_g = (_f = container) === null || _f === void 0 ? void 0 : _f.current) === null || _g === void 0 ? void 0 : _g.offsetWidth) || 1280;
                var canvasHeight = ((_j = (_h = container) === null || _h === void 0 ? void 0 : _h.current) === null || _j === void 0 ? void 0 : _j.offsetHeight) || 1280;
                var canvasAR = canvasWidth / canvasHeight;
                var sX = void 0, sY = void 0, sW = void 0, sH = void 0;
                if (playerAR > canvasAR) {
                    sH = playerHeight;
                    sW = playerHeight * canvasAR;
                    sX = (playerWidth - sW) / 2;
                    sY = 0;
                }
                else {
                    sW = playerWidth;
                    sH = playerWidth / canvasAR;
                    sX = 0;
                    sY = (playerHeight - sH) / 2;
                }
                canvas.current.width = sW;
                canvas.current.height = sH;
                var context = canvas.current.getContext('2d');
                if (context && ((_k = player) === null || _k === void 0 ? void 0 : _k.current)) {
                    context.drawImage(player.current, sX, sY, sW, sH, 0, 0, sW, sH);
                }
                var imgData = canvas.current.toDataURL('image/jpeg');
                return imgData;
            }
            else {
                throw new Error('Canvas is not supported');
            }
        },
        switchCamera: function () {
            if (numberOfCameras < 1) {
                throw new Error("There isn't any video device accessible.");
            }
            else if (numberOfCameras < 2) {
                console.warn('It is not possible to switch camera to different one, because there is only one video device accessible.');
            }
            var newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
            setFacingMode(newFacingMode);
            return newFacingMode;
        },
        getNumberOfCameras: function () {
            return numberOfCameras;
        },
    }); });
    useEffect(function () { return initCameraStream(stream, setStream, currentFacingMode, setNumberOfCameras); }, [currentFacingMode]);
    useEffect(function () {
        if (stream && player && player.current) {
            player.current.srcObject = stream;
        }
    }, [stream]);
    return (React.createElement(Container, { ref: container, aspectRatio: aspectRatio },
        React.createElement(Wrapper, null,
            React.createElement(Cam, { ref: player, id: "video", muted: true, autoPlay: true, playsInline: true, mirrored: currentFacingMode === 'user' ? true : false }),
            React.createElement(Canvas, { ref: canvas }))));
});
Camera.displayName = 'Camera';
var initCameraStream = function (stream, setStream, currentFacingMode, setNumberOfCameras) {
    // stop any active streams in the window
    if (stream) {
        stream.getTracks().forEach(function (track) {
            track.stop();
        });
    }
    var constraints = {
        audio: false,
        video: {
            facingMode: currentFacingMode,
            width: { ideal: 1920 },
            height: { ideal: 1920 },
        },
    };
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (stream) {
        setStream(handleSuccess(stream, setNumberOfCameras));
    })
        .catch(handleError);
};
var handleSuccess = function (stream, setNumberOfCameras) {
    var track = stream.getVideoTracks()[0];
    var settings = track.getSettings();
    var str = JSON.stringify(settings, null, 4);
    console.log('Camera settings ' + str);
    navigator.mediaDevices
        .enumerateDevices()
        .then(function (r) { return setNumberOfCameras(r.filter(function (i) { return i.kind === 'videoinput'; }).length); });
    return stream;
};
var handleError = function (error) {
    console.error(error);
    //https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    if (error.name === 'PermissionDeniedError') {
        throw new Error('Permission denied. Please refresh and give camera permission.');
    }
};
//# sourceMappingURL=Camera.js.map

export { Camera };
