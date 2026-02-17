import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Check, Download } from 'lucide-react';
import { Button } from './button';

export default function SignaturePad({ 
  onSave,
  width = 500,
  height = 200,
  className = ''
}) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    setIsDrawing(true);
    setIsEmpty(false);
    
    ctx.beginPath();
    ctx.moveTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    );
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    ctx.lineTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    );
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
  };

  const save = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL();
    onSave?.(dataUrl);
  };

  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-white"
      >
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="cursor-crosshair w-full"
        />
      </motion.div>

      <div className="flex items-center gap-2 mt-4">
        <Button
          variant="outline"
          onClick={clear}
          disabled={isEmpty}
          className="rounded-xl"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Clear
        </Button>

        <Button
          onClick={save}
          disabled={isEmpty}
          className="rounded-xl bg-indigo-600 hover:bg-indigo-700"
        >
          <Check className="w-4 h-4 mr-2" />
          Save Signature
        </Button>
      </div>
    </div>
  );
}