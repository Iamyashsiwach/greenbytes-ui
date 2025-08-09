/**
 * Component to display model outputs and fusion results with modern UI
 */

import React from 'react';
import { YOLOResult, TabNetResult, FusionResult } from '../lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Eye, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

interface ModelSummaryProps {
  yolo: YOLOResult;
  tabnet: TabNetResult;
  fusion: FusionResult;
}

export const ModelSummary: React.FC<ModelSummaryProps> = ({ yolo, tabnet, fusion }) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Model Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* YOLO Results */}
        <Card className="prediction-card">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
              <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
              <span className="hidden sm:inline">YOLO Vision Model</span>
              <span className="sm:hidden">YOLO Vision</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg sm:text-2xl font-bold text-blue-600">
                  {(yolo.conf * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">Confidence</p>
              </div>
              {yolo.present && (
                <Badge variant="default" className="detection-badge text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">Detected</span>
                  <span className="sm:hidden">✓</span>
                </Badge>
              )}
            </div>
            {yolo.boxes.length > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                {yolo.boxes.length} detection(s) found
              </p>
            )}
          </CardContent>
        </Card>

        {/* TabNet Results */}
        <Card className="prediction-card">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
              <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
              <span className="hidden sm:inline">TabNet Analysis</span>
              <span className="sm:hidden">TabNet</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg sm:text-2xl font-bold text-purple-600">
                  {(tabnet.proba * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  Score (≥{(tabnet.threshold * 100).toFixed(0)}%)
                </p>
              </div>
              {tabnet.pred && (
                <Badge variant="default" className="detection-badge text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">Detected</span>
                  <span className="sm:hidden">✓</span>
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fusion Results */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600" />
            <span className="hidden sm:inline">Multimodal Fusion</span>
            <span className="sm:hidden">Fusion Result</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="bg-muted/50 p-2 sm:p-3 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Fusion Rule:</p>
              <code className="text-xs bg-background px-2 py-1 rounded border break-all">
                {fusion.rule}
              </code>
            </div>
            
            <div className={`p-3 sm:p-4 rounded-lg text-center ${
              fusion.present 
                ? 'bg-destructive/10 border border-destructive/20' 
                : 'bg-green-50 border border-green-200'
            }`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                {fusion.present ? (
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-destructive" />
                ) : (
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                )}
                <span className={`text-sm sm:text-lg font-bold ${
                  fusion.present ? 'text-destructive' : 'text-green-600'
                }`}>
                  {fusion.present ? 'TARGET DETECTED' : 'NOT DETECTED'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {fusion.present 
                  ? 'One or more models detected the target condition'
                  : 'No target conditions detected by either model'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
