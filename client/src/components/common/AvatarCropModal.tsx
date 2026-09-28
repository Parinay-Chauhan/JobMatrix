import React, { useState, useRef, useEffect, useCallback } from "react";
import { ZoomIn, X } from "lucide-react";

export interface AvatarCropModalProps {
  isOpen: boolean;
  imageFile: File | null;
  onClose: () => void;
  onSave: (croppedFile: File) => Promise<void> | void;
  isSaving?: boolean;
}

export const AvatarCropModal: React.FC<AvatarCropModalProps> = ({
  isOpen,
  imageFile,
  onClose,
  onSave,
  isSaving = false,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialPanX: number; initialPanY: number }>({
    startX: 0,
    startY: 0,
    initialPanX: 0,
    initialPanY: 0,
  });

  const VIEWPORT_SIZE = 340;
  const CROP_RADIUS = 130; // 260px diameter circular aperture

  // Load image object URL
  useEffect(() => {
    if (!imageFile) {
      setImageSrc(null);
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setImageSrc(objectUrl);

    const img = new Image();
    img.src = objectUrl;
    img.onload = () => {
      setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
      setZoom(1);
      setPan({ x: 0, y: 0 });
    };

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageFile]);

  // Compute base scale and pan bounds
  const baseScale =
    naturalSize.width > 0 && naturalSize.height > 0
      ? Math.max((CROP_RADIUS * 2) / naturalSize.width, (CROP_RADIUS * 2) / naturalSize.height)
      : 1;

  const currentScale = baseScale * zoom;
  const drawWidth = naturalSize.width * currentScale;
  const drawHeight = naturalSize.height * currentScale;

  const maxPanX = Math.max(0, (drawWidth - CROP_RADIUS * 2) / 2);
  const maxPanY = Math.max(0, (drawHeight - CROP_RADIUS * 2) / 2);

  // Clamp pan when zoom changes
  useEffect(() => {
    setPan((prev) => ({
      x: Math.max(-maxPanX, Math.min(maxPanX, prev.x)),
      y: Math.max(-maxPanY, Math.min(maxPanY, prev.y)),
    }));
  }, [maxPanX, maxPanY]);

  // Pointer drag event handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialPanX: pan.x,
      initialPanY: pan.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;

    const newX = dragStartRef.current.initialPanX + deltaX;
    const newY = dragStartRef.current.initialPanY + deltaY;

    setPan({
      x: Math.max(-maxPanX, Math.min(maxPanX, newX)),
      y: Math.max(-maxPanY, Math.min(maxPanY, newY)),
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Safe ignore
      }
    }
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    setZoom((prev) => Math.max(1, Math.min(3, +(prev + delta).toFixed(2))));
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(3, +(prev + 0.15).toFixed(2)));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(1, +(prev - 0.15).toFixed(2)));
  };

  // Export cropped canvas
  const handleConfirmCrop = useCallback(async () => {
    if (!imageSrc || naturalSize.width === 0 || naturalSize.height === 0) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    await new Promise((resolve) => {
      if (img.complete) resolve(null);
      else img.onload = () => resolve(null);
    });

    const canvas = document.createElement("canvas");
    const OUTPUT_SIZE = 512;
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Viewport center
    const cx = VIEWPORT_SIZE / 2;
    const cy = VIEWPORT_SIZE / 2;

    // Image top-left in viewport
    const imgLeft = cx - drawWidth / 2 + pan.x;
    const imgTop = cy - drawHeight / 2 + pan.y;

    // Crop aperture center in image pixels
    const cropCenterInImgX = (cx - imgLeft) / currentScale;
    const cropCenterInImgY = (cy - imgTop) / currentScale;

    // Crop diameter in image pixels
    const sourceCropD = (CROP_RADIUS * 2) / currentScale;

    const sx = Math.max(0, cropCenterInImgX - sourceCropD / 2);
    const sy = Math.max(0, cropCenterInImgY - sourceCropD / 2);
    const sWidth = Math.min(naturalSize.width - sx, sourceCropD);
    const sHeight = Math.min(naturalSize.height - sy, sourceCropD);

    // Draw to canvas with high smoothing quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const croppedFile = new File([blob], imageFile?.name || "avatar.jpg", {
          type: "image/jpeg",
          lastModified: Date.now(),
        });
        onSave(croppedFile);
      },
      "image/jpeg",
      0.92
    );
  }, [imageSrc, naturalSize, drawWidth, drawHeight, pan.x, pan.y, currentScale, imageFile, onSave]);

  if (!isOpen || !imageFile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 text-slate-100 border border-slate-800 shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950">
          <h3 className="text-sm font-bold text-white tracking-wide">
            Adjust Profile Photo
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Crop Area */}
        <div className="p-4 sm:p-5 flex flex-col items-center select-none bg-slate-950">
          <div
            className="relative overflow-hidden rounded-xl bg-slate-900 flex items-center justify-center cursor-grab active:cursor-grabbing border border-slate-800 shadow-inner"
            style={{ width: VIEWPORT_SIZE, height: VIEWPORT_SIZE }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
          >
            {/* Draggable & Scalable Image */}
            {imageSrc && (
              <img
                src={imageSrc}
                alt="Crop preview"
                draggable={false}
                className="max-w-none pointer-events-none transition-transform duration-75 ease-out"
                style={{
                  width: drawWidth,
                  height: drawHeight,
                  transform: `translate3d(${pan.x}px, ${pan.y}px, 0)`,
                }}
              />
            )}

            {/* Circular Dark Vignette Overlay with Dashed Guide Border */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox={`0 0 ${VIEWPORT_SIZE} ${VIEWPORT_SIZE}`}
            >
              <defs>
                <mask id="avatar-crop-mask">
                  <rect width="100%" height="100%" fill="white" />
                  <circle
                    cx={VIEWPORT_SIZE / 2}
                    cy={VIEWPORT_SIZE / 2}
                    r={CROP_RADIUS}
                    fill="black"
                  />
                </mask>
              </defs>
              {/* Darkened area outside the circular crop aperture */}
              <rect
                width="100%"
                height="100%"
                fill="rgba(0, 0, 0, 0.72)"
                mask="url(#avatar-crop-mask)"
              />
              {/* White Dashed Circle Guide */}
              <circle
                cx={VIEWPORT_SIZE / 2}
                cy={VIEWPORT_SIZE / 2}
                r={CROP_RADIUS}
                fill="none"
                stroke="rgba(255, 255, 255, 0.85)"
                strokeDasharray="5 5"
                strokeWidth="1.5"
              />
            </svg>
          </div>

          {/* Zoom In / Zoom Out (+, -) Controls & Slider */}
          <div className="w-full max-w-xs mt-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-semibold">
              <span className="flex items-center gap-1.5">
                <ZoomIn className="w-3.5 h-3.5 text-slate-400" />
                <span>Zoom Scale</span>
              </span>
              <span className="text-emerald-400 font-mono">{Math.round(zoom * 100)}%</span>
            </div>

            <div className="flex items-center gap-3 bg-slate-900 p-2 rounded-xl border border-slate-800">
              {/* Zoom Out Button (-) */}
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoom <= 1}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-white flex items-center justify-center font-bold text-base border border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
                title="Zoom Out (-)"
              >
                −
              </button>

              {/* Slider */}
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400"
              />

              {/* Zoom In Button (+) */}
              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-white flex items-center justify-center font-bold text-base border border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
                title="Zoom In (+)"
              >
                +
              </button>
            </div>
            <p className="text-[11px] text-slate-500 text-center">
              Drag to reposition • Scroll or use buttons to adjust scale
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-800 bg-slate-950 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-800 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmCrop}
            disabled={isSaving}
            className="py-2 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Saving Photo...</span>
              </>
            ) : (
              <span>Save Profile Photo</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarCropModal;
