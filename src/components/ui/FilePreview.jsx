import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Image, Video, Music, File, Download, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FilePreview({ 
  file,
  onRemove,
  showActions = true,
  className 
}) {
  const getIcon = () => {
    if (file.type?.startsWith('image/')) return Image;
    if (file.type?.startsWith('video/')) return Video;
    if (file.type?.startsWith('audio/')) return Music;
    if (file.type?.includes('pdf')) return FileText;
    return File;
  };

  const getPreview = () => {
    if (file.type?.startsWith('image/')) {
      return (
        <img 
          src={URL.createObjectURL(file)} 
          alt={file.name}
          className="w-full h-full object-cover"
        />
      );
    }
    
    const Icon = getIcon();
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Icon className="w-12 h-12 text-gray-400 mb-2" />
        <p className="text-xs text-gray-600 text-center px-2 truncate max-w-full">
          {file.name}
        </p>
      </div>
    );
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.05 }}
      className={cn(
        'relative rounded-xl overflow-hidden bg-gray-50 border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow group',
        className
      )}
    >
      <div className="aspect-square">
        {getPreview()}
      </div>

      {showActions && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity space-y-1">
          {onRemove && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onRemove}
              className="w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 bg-indigo-500 text-white rounded-lg flex items-center justify-center shadow-lg hover:bg-indigo-600 transition-colors"
          >
            <Download className="w-4 h-4" />
          </motion.button>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-white text-xs font-medium truncate">{file.name}</p>
        <p className="text-white/80 text-xs">{formatSize(file.size)}</p>
      </div>
    </motion.div>
  );
}