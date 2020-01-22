/* eslint-disable */
import React, { useRef, useState, useImperativeHandle, useEffect } from 'react';
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
        ? "\n      position: absolute;\n      bottom: 0\n      top: 0\n      left: 0\n      right: 0"
        : "\n      position: relative;\n      padding-bottom: " + 100 / aspectRatio + "%;";
});
var Cam = styled.video(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  z-index: 0;\n  transform: rotateY(", ");\n"], ["\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  z-index: 0;\n  transform: rotateY(", ");\n"])), function (_a) {
    var mirrored = _a.mirrored;
    return (mirrored ? '180deg' : '0deg');
});
var Camera = React.forwardRef(function (_a, ref) {
    var _b = _a.facingMode, facingMode = _b === void 0 ? 'user' : _b, _c = _a.aspectRatio, aspectRatio = _c === void 0 ? 'cover' : _c;
    var player = useRef(null);
    var _d = useState(null), stream = _d[0], setStream = _d[1];
    var _e = useState(facingMode), currentFacingMode = _e[0], setFacingMode = _e[1];
    useImperativeHandle(ref, function () { return ({
        takePhoto: function () {
            console.log('TAKE photo');
        },
        switchCamera: function () {
            setFacingMode(currentFacingMode === 'user' ? 'environment' : 'user');
        },
    }); });
    useEffect(function () { return initCameraStream(stream, setStream, currentFacingMode); }, [currentFacingMode]);
    useEffect(function () {
        console.log('player');
        if (stream && player && player.current) {
            console.log('stream');
            player.current.srcObject = stream;
        }
    }, [stream]);
    return (React.createElement(Container, { aspectRatio: aspectRatio },
        React.createElement(Wrapper, null,
            React.createElement(Cam, { ref: player, id: "video", muted: true, autoPlay: true, playsInline: true, mirrored: currentFacingMode === 'user' ? true : false }))));
});
Camera.displayName = 'Camera';
var initCameraStream = function (stream, setStream, currentFacingMode) {
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
        },
    };
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (stream) {
        setStream(handleSuccess(stream));
    })
        .catch(handleError);
};
var handleSuccess = function (stream) {
    var track = stream.getVideoTracks()[0];
    var settings = track.getSettings();
    var str = JSON.stringify(settings, null, 4);
    console.log('settings ' + str);
    return stream;
    //return navigator.mediaDevices.enumerateDevices();
};
var handleError = function (error) {
    console.log(error);
    //https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    if (error.name === 'PermissionDeniedError') {
        throw new Error('Permission denied. Please refresh and give camera permission.');
    }
};
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=Camera.js.map

export { Camera };
