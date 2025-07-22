import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Crop, Eye, RotateCcw } from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';

interface ImageCropperProps {
  src: string;
  onCrop: (croppedImage: string) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export const ImageCrop: React.FC<ImageCropperProps> = ({ src, onCrop, onCancel, isOpen }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState({
    x: 25,
    y: 25,
    width: 150,
    height: 150,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, cropX: 0, cropY: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const updatePreview = useCallback(() => {
    const previewCanvas = previewCanvasRef.current;
    const image = imgRef.current;
    if (!previewCanvas || !image) return;

    const ctx = previewCanvas.getContext('2d');
    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    previewCanvas.width = 150;
    previewCanvas.height = 150;

    ctx.drawImage(image, crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY, 0, 0, 150, 150);
  }, [crop]);

  const handleImageLoad = () => {
    if (imgRef.current) {
      const { width, height } = imgRef.current.getBoundingClientRect();
      setImageSize({ width, height });

      const newCrop = {
        x: (width - 150) / 2,
        y: (height - 150) / 2,
        width: 150,
        height: 150,
      };
      setCrop(newCrop);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const rect = imgRef.current?.getBoundingClientRect();
    if (rect) {
      setDragStart({
        x: e.clientX,
        y: e.clientY,
        cropX: crop.x,
        cropY: crop.y,
      });
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !imgRef.current) return;

      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      const newX = Math.max(0, Math.min(imageSize.width - crop.width, dragStart.cropX + deltaX));
      const newY = Math.max(0, Math.min(imageSize.height - crop.height, dragStart.cropY + deltaY));

      setCrop((prev) => ({
        ...prev,
        x: newX,
        y: newY,
      }));
    },
    [isDragging, dragStart, crop.width, crop.height, imageSize],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  React.useEffect(() => {
    if (imgRef.current && imageSize.width > 0) {
      updatePreview();
    }
  }, [crop, updatePreview, imageSize]);

  const applyCrop = () => {
    const canvas = canvasRef.current;
    const image = imgRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(image, crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY, 0, 0, crop.width, crop.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const reader = new FileReader();
        reader.onload = () => {
          onCrop(reader.result as string);
        };
        reader.readAsDataURL(blob);
      }
    }, 'image/png');
  };

  const resetCrop = () => {
    setCrop({
      x: (imageSize.width - 150) / 2,
      y: (imageSize.height - 150) / 2,
      width: 150,
      height: 150,
    });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => onCancel()}>
      <DialogContent className="max-h-[90vh] max-w-4xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <Crop className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Recortar Logo</h3>
                <p className="text-sm text-gray-600">Ajusta el área de recorte para tu logo</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={resetCrop}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Restablecer
            </Button>
          </div>

          <ScrollArea className="h-[60vh]">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="relative inline-block overflow-hidden rounded-lg border-2 border-gray-300 bg-gray-50">
                  <img
                    ref={imgRef}
                    src={src}
                    alt="Imagen para recortar"
                    className="max-h-[400px] max-w-full object-contain select-none"
                    onLoad={handleImageLoad}
                    draggable={false}
                  />

                  <div
                    className="absolute cursor-move border-2 border-blue-500 bg-blue-500/10 shadow-lg"
                    style={{
                      left: crop.x,
                      top: crop.y,
                      width: crop.width,
                      height: crop.height,
                    }}
                    onMouseDown={handleMouseDown}
                  >
                    <div className="absolute -top-1 -left-1 h-3 w-3 rounded-full border-2 border-white bg-blue-500 shadow"></div>
                    <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-blue-500 shadow"></div>
                    <div className="absolute -bottom-1 -left-1 h-3 w-3 rounded-full border-2 border-white bg-blue-500 shadow"></div>
                    <div className="absolute -right-1 -bottom-1 h-3 w-3 rounded-full border-2 border-white bg-blue-500 shadow"></div>

                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <div className="h-4 w-4 rounded-full border-2 border-white bg-blue-500 opacity-60"></div>
                    </div>
                  </div>

                  <div
                    className="pointer-events-none absolute inset-0 bg-black/30"
                    style={{
                      clipPath: `polygon(0% 0%, 0% 100%, ${crop.x}px 100%, ${crop.x}px ${crop.y}px, ${crop.x + crop.width}px ${crop.y}px, ${crop.x + crop.width}px ${crop.y + crop.height}px, ${crop.x}px ${crop.y + crop.height}px, ${crop.x}px 100%, 100% 100%, 100% 0%)`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 flex items-center gap-2 font-medium">
                    <Eye className="h-4 w-4" />
                    Vista Previa
                  </h4>
                  <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4">
                    <canvas ref={previewCanvasRef} className="max-w-full rounded border bg-white shadow-sm" width={150} height={150} />
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ancho:</span>
                    <span className="font-mono">{Math.round(crop.width)}px</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Alto:</span>
                    <span className="font-mono">{Math.round(crop.height)}px</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Proporción:</span>
                    <span className="font-mono">1:1</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="flex items-center justify-between border-t pt-4">
            <p className="text-sm text-gray-600">Arrastra el área azul para posicionar tu logo</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button onClick={applyCrop} className="bg-primary hover:bg-blue-700">
                <Crop className="mr-2 h-4 w-4" />
                Aplicar Recorte
              </Button>
            </div>
          </div>
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
};
