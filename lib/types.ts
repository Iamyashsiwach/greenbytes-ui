/**
 * Shared TypeScript types for API and UI
 */

// Question structure
export interface Question {
  key: string;
  text: string;
}

// Answer values
export type AnswerValue = -1 | 0 | 1; // Unknown | No | Yes

// API request/response types
export interface PredictRequest {
  image: File;
  mode: "disease" | "pest";
  answers: AnswerValue[];
}

export interface YOLOResult {
  present: boolean;
  conf: number;
  boxes: number[][];
  mask_rle: string | null;
}

export interface TabNetResult {
  proba: number;
  threshold: number;
  pred: boolean;
}

export interface FusionResult {
  rule: string;
  yolo_thresh: number;
  present: boolean;
}

export interface PredictResponse {
  mode: "disease" | "pest";
  answers: Record<string, AnswerValue>;
  yolo: YOLOResult;
  tabnet: TabNetResult;
  fusion: FusionResult;
  ref_img: string;
}

// Chat message types
export interface UserMessage {
  id: string;
  role: "user";
  payload: {
    mode: "disease" | "pest";
    imageDataUrl: string;
    answers: Record<string, AnswerValue>;
  };
}

export interface AssistantMessage {
  id: string;
  role: "assistant";
  payload: PredictResponse | { status: string; error?: string };
}

export type Message = UserMessage | AssistantMessage;
