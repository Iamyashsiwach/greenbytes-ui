/**
 * Component to display reference image when target is detected
 */

// Reference image display component with lazy loading optimization
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageIcon, ExternalLink } from 'lucide-react';

interface RefImageProps {
  mode: "disease" | "pest";
  filename: string;
}

export const RefImage: React.FC<RefImageProps> = ({ mode, filename }) => {
  const imagePath = `/ref/${mode === 'disease' ? 'deadheart' : 'esb'}/${filename}`;
  const targetName = mode === 'disease' ? 'Dead Heart Disease' : 'Early Shoot Borer (ESB)';
  
  return (
    <Card className="mt-3 sm:mt-4 border-2 border-orange-200 bg-orange-50/50">
      <CardHeader className="pb-2 sm:pb-3">
        <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
          <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />
          Reference Image
          <Badge variant="outline" className="ml-auto text-xs">
            {mode === 'disease' ? '🦠 Disease' : '🐛 Pest'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 sm:space-y-3">
          <div className="relative group">
            <img 
              src={imagePath} 
              alt={`Reference for ${targetName}`}
              className="w-full max-h-32 sm:max-h-48 object-contain rounded-lg border border-orange-200 bg-white shadow-sm group-hover:shadow-md transition-shadow"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.src = '/logo.svg';
                target.alt = 'Reference image placeholder';
              }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-lg" />
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-xs sm:text-sm font-medium text-orange-800">
              {targetName}
            </p>
            <p className="text-xs text-orange-600/80">
              Typical symptoms and characteristics
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
