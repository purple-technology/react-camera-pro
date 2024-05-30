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

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
}

var Wrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n"], ["\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n"])));
var Container = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  width: 100%;\n  ", "\n"], ["\n  width: 100%;\n  ",
    "\n"])), function (_a) {
    var aspectRatio = _a.aspectRatio;
    return aspectRatio === 'cover'
        ? "\n    position: absolute;\n    bottom: 0;\n    top: 0;\n    left: 0;\n    right: 0;"
        : "\n    position: relative;\n    padding-bottom: " + 100 / aspectRatio + "%;";
});
var ErrorMsg = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  padding: 40px;\n"], ["\n  padding: 40px;\n"])));
var Cam = styled.video(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  z-index: 0;\n  transform: rotateY(", ");\n"], ["\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  z-index: 0;\n  transform: rotateY(", ");\n"])), function (_a) {
    var mirrored = _a.mirrored;
    return (mirrored ? '180deg' : '0deg');
});
var Canvas = styled.canvas(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: none;\n"], ["\n  display: none;\n"])));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;

var Camera = React.forwardRef(function (_a, ref) {
    var _b = _a.facingMode, facingMode = _b === void 0 ? 'user' : _b, _c = _a.aspectRatio, aspectRatio = _c === void 0 ? 'cover' : _c, _d = _a.numberOfCamerasCallback, numberOfCamerasCallback = _d === void 0 ? function () { return null; } : _d, _e = _a.videoSourceDeviceId, videoSourceDeviceId = _e === void 0 ? undefined : _e, _f = _a.errorMessages, errorMessages = _f === void 0 ? {
        noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
        permissionDenied: 'Permission denied. Please refresh and give camera permission.',
        switchCamera: 'It is not possible to switch camera to different one because there is only one video device accessible.',
        canvas: 'Canvas is not supported.',
    } : _f, _g = _a.videoReadyCallback, videoReadyCallback = _g === void 0 ? function () { return null; } : _g;
    var player = useRef(null);
    var canvas = useRef(null);
    var context = useRef(null);
    var container = useRef(null);
    var _h = useState(0), numberOfCameras = _h[0], setNumberOfCameras = _h[1];
    var _j = useState(null), stream = _j[0], setStream = _j[1];
    var _k = useState(facingMode), currentFacingMode = _k[0], setFacingMode = _k[1];
    var _l = useState(false), notSupported = _l[0], setNotSupported = _l[1];
    var _m = useState(false), permissionDenied = _m[0], setPermissionDenied = _m[1];
    var _o = useState(false), torchSupported = _o[0], setTorchSupported = _o[1];
    var _p = useState(false), torch = _p[0], setTorch = _p[1];
    useEffect(function () {
        numberOfCamerasCallback(numberOfCameras);
    }, [numberOfCameras]);
    var switchTorch = function (on) {
        if (on === void 0) { on = false; }
        return __awaiter(void 0, void 0, void 0, function () {
            var supportedConstraints, track, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(stream && (navigator === null || navigator === void 0 ? void 0 : navigator.mediaDevices))) return [3 /*break*/, 4];
                        supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
                        track = stream.getTracks()[0];
                        if (!(supportedConstraints && 'torch' in supportedConstraints && track)) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, track.applyConstraints({ advanced: [{ torch: on }] })];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, true];
                    case 3:
                        _a = _b.sent();
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/, false];
                }
            });
        });
    };
    useEffect(function () {
        switchTorch(torch);
    }, [torch]);
    useImperativeHandle(ref, function () { return ({
        takePhoto: function (type) {
            var _a, _b, _c, _d, _e;
            if (numberOfCameras < 1) {
                throw new Error(errorMessages.noCameraAccessible);
            }
            if (canvas === null || canvas === void 0 ? void 0 : canvas.current) {
                var playerWidth = ((_a = player === null || player === void 0 ? void 0 : player.current) === null || _a === void 0 ? void 0 : _a.videoWidth) || 1280;
                var playerHeight = ((_b = player === null || player === void 0 ? void 0 : player.current) === null || _b === void 0 ? void 0 : _b.videoHeight) || 720;
                var playerAR = playerWidth / playerHeight;
                var canvasWidth = ((_c = container === null || container === void 0 ? void 0 : container.current) === null || _c === void 0 ? void 0 : _c.offsetWidth) || 1280;
                var canvasHeight = ((_d = container === null || container === void 0 ? void 0 : container.current) === null || _d === void 0 ? void 0 : _d.offsetHeight) || 1280;
                var canvasAR = canvasWidth / canvasHeight;
                var sX = void 0, sY = void 0, sW = void 0, sH = void 0, imgData = void 0;
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
                if (!context.current) {
                    context.current = canvas.current.getContext('2d', { willReadFrequently: true });
                }
                if (context.current && (player === null || player === void 0 ? void 0 : player.current)) {
                    context.current.drawImage(player.current, sX, sY, sW, sH, 0, 0, sW, sH);
                }
                switch (type) {
                    case 'imgData':
                        imgData = (_e = context.current) === null || _e === void 0 ? void 0 : _e.getImageData(0, 0, sW, sH);
                        break;
                    default: /* base64url */
                        imgData = canvas.current.toDataURL('image/jpeg');
                        break;
                }
                return imgData;
            }
            else {
                throw new Error(errorMessages.canvas);
            }
        },
        switchCamera: function () {
            if (numberOfCameras < 1) {
                throw new Error(errorMessages.noCameraAccessible);
            }
            else if (numberOfCameras < 2) {
                console.error('Error: Unable to switch camera. Only one device is accessible.'); // console only
            }
            var newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
            setFacingMode(newFacingMode);
            return newFacingMode;
        },
        getNumberOfCameras: function () {
            return numberOfCameras;
        },
        toggleTorch: function () {
            var torchVal = !torch;
            setTorch(torchVal);
            return torchVal;
        },
        torchSupported: torchSupported,
    }); });
    useEffect(function () {
        initCameraStream(stream, setStream, currentFacingMode, videoSourceDeviceId, setNumberOfCameras, setNotSupported, setPermissionDenied);
    }, [currentFacingMode, videoSourceDeviceId]);
    useEffect(function () {
        switchTorch(false).then(function (success) { return setTorchSupported(success); });
        if (stream && player && player.current) {
            player.current.srcObject = stream;
        }
        return function () {
            if (stream) {
                stream.getTracks().forEach(function (track) {
                    track.stop();
                });
            }
        };
    }, [stream]);
    return (React.createElement(Container, { ref: container, aspectRatio: aspectRatio },
        React.createElement(Wrapper, null,
            notSupported ? React.createElement(ErrorMsg, null, errorMessages.noCameraAccessible) : null,
            permissionDenied ? React.createElement(ErrorMsg, null, errorMessages.permissionDenied) : null,
            React.createElement(Cam, { ref: player, id: "video", muted: true, autoPlay: true, playsInline: true, mirrored: currentFacingMode === 'user' ? true : false, onLoadedData: function () {
                    videoReadyCallback();
                } }),
            React.createElement(Canvas, { ref: canvas }))));
});
Camera.displayName = 'Camera';
var shouldSwitchToCamera = function (currentFacingMode) { return __awaiter(void 0, void 0, void 0, function () {
    var cameras;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cameras = [];
                if (!(currentFacingMode === 'environment')) return [3 /*break*/, 2];
                return [4 /*yield*/, navigator.mediaDevices.enumerateDevices().then(function (devices) {
                        var videoDevices = devices.filter(function (i) { return i.kind == 'videoinput'; });
                        videoDevices.forEach(function (device) {
                            var capabilities = device.getCapabilities();
                            if (capabilities.facingMode && capabilities.facingMode.indexOf('environment') >= 0 && capabilities.deviceId) {
                                cameras.push(capabilities.deviceId);
                            }
                        });
                    })];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                if (cameras.length > 1) {
                    return [2 /*return*/, cameras.pop()];
                }
                return [2 /*return*/, undefined];
        }
    });
}); };
var initCameraStream = function (stream, setStream, currentFacingMode, videoSourceDeviceId, setNumberOfCameras, setNotSupported, setPermissionDenied) { return __awaiter(void 0, void 0, void 0, function () {
    var cameraDeviceId, switchToCamera, constraints, getWebcam;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                // stop any active streams in the window
                if (stream) {
                    stream.getTracks().forEach(function (track) {
                        track.stop();
                    });
                }
                return [4 /*yield*/, shouldSwitchToCamera(currentFacingMode)];
            case 1:
                switchToCamera = _b.sent();
                if (switchToCamera) {
                    cameraDeviceId = switchToCamera;
                }
                else {
                    cameraDeviceId = videoSourceDeviceId ? { exact: videoSourceDeviceId } : undefined;
                }
                constraints = {
                    audio: false,
                    video: {
                        deviceId: cameraDeviceId,
                        facingMode: currentFacingMode,
                        width: { ideal: 1920 },
                        height: { ideal: 1920 },
                    },
                };
                if ((_a = navigator === null || navigator === void 0 ? void 0 : navigator.mediaDevices) === null || _a === void 0 ? void 0 : _a.getUserMedia) {
                    navigator.mediaDevices
                        .getUserMedia(constraints)
                        .then(function (stream) {
                        setStream(handleSuccess(stream, setNumberOfCameras));
                    })
                        .catch(function (err) {
                        handleError(err, setNotSupported, setPermissionDenied);
                    });
                }
                else {
                    getWebcam = navigator.getUserMedia ||
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia ||
                        navigator.mozGetUserMedia ||
                        navigator.msGetUserMedia;
                    if (getWebcam) {
                        getWebcam(constraints, function (stream) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                setStream(handleSuccess(stream, setNumberOfCameras));
                                return [2 /*return*/];
                            });
                        }); }, function (err) {
                            handleError(err, setNotSupported, setPermissionDenied);
                        });
                    }
                    else {
                        setNotSupported(true);
                    }
                }
                return [2 /*return*/];
        }
    });
}); };
var handleSuccess = function (stream, setNumberOfCameras) {
    navigator.mediaDevices
        .enumerateDevices()
        .then(function (r) { return setNumberOfCameras(r.filter(function (i) { return i.kind === 'videoinput'; }).length); });
    return stream;
};
var handleError = function (error, setNotSupported, setPermissionDenied) {
    console.error(error);
    //https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    if (error.name === 'PermissionDeniedError') {
        setPermissionDenied(true);
    }
    else {
        setNotSupported(true);
    }
};

export { Camera };
