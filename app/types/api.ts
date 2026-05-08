export interface StatsResponse {
  total: number
  positifs: number
  neutres: number
  negatifs: number
  streaming: number
}

export interface SentimentsDistribution {
  total: number
  positifs: number
  neutres: number
  negatifs: number
  pourcentages: {
    positifs: number
    neutres: number
    negatifs: number
  }
}

export interface SentimentsReview {
  text: string
  score: number
  prediction: number
  sentiment: string
  emoji: string
  summary: string
  product_id: string
}

export interface SentimentsResponse {
  distribution: SentimentsDistribution
  recent_reviews: SentimentsReview[]
}

export interface PredictionsByDateItem {
  date: string
  negative: number
  neutral: number
  positive: number
  total: number
}

export interface PredictionsByDateResponse {
  predictions_by_date: PredictionsByDateItem[]
}

export interface ProductScoringResponse {
  product_id: string
  total_reviews: number
  sentiments: {
    positive: number
    neutral: number
    negative: number
  }
  percentages: {
    positive: number
    neutral: number
    negative: number
  }
  average_score: number
}

export interface LivePrediction {
  text: string
  score: number
  prediction: number
  summary: string
  product_id: string
  sentiment: string
  emoji: string
  timestamp?: string
}

export interface OfflinePrediction {
  Text: string
  Score: number
  prediction: number
  Summary: string
  sentiment: string
  emoji: string
  timestamp?: string
}

export type RawPrediction = LivePrediction | OfflinePrediction

export interface NormalizedPrediction {
  id: string
  text: string
  score: number
  prediction: number
  summary: string
  productId?: string
  sentiment: string
  emoji: string
  timestamp?: string
  source: 'live' | 'offline'
}

export interface ModelMetrics {
  accuracy: number
  precision: number
  recall: number
  f1_score: number
  support?: number
}

export interface ClassMetrics extends ModelMetrics {
  label: string
}

export interface ModelPerformance {
  model_name: string
  accuracy: number
  f1_score: number
  precision: number
  recall: number
  val_accuracy?: number
  test_accuracy?: number
  class_metrics: ClassMetrics[]
  training_time?: number
  best_model?: boolean
}

export interface MLResponse {
  models: ModelPerformance[]
  best_model: ModelPerformance
  class_distribution: {
    [key: string]: number
  }
  feature_count?: number
  training_lines?: number
}

// Model endpoints types
export interface ModelMetricsInfo {
  model_name: string
  test_accuracy: number
  test_f1: number
  val_accuracy: number
  is_best: boolean
  trained_at: string
}

export interface ModelMetricsResponse {
  status: string
  best_model: {
    name: string | null
    accuracy: number | null
    f1_score: number | null
    saved_at: string | null
  }
  all_models: ModelMetricsInfo[]
}

export interface ModelInfoResponse {
  status: string
  model_name: string
  accuracy: number
  f1_score: number
  spark_version: string
  saved_at: string
  feat_model_path: string
  best_model_path: string
}

export interface DataStatsResponse {
  status: string
  total_predictions: number
  class_distribution: {
    negative: number
    neutral: number
    positive: number
  }
  percentages: {
    negative: number
    neutral: number
    positive: number
  }
}

export interface PredictionSample {
  Id: string
  Text: string
  Summary: string
  Score: number
  label: number
  prediction: number
  label_str: string
  prediction_str: string
}

export interface PredictionsSampleResponse {
  status: string
  count: number
  samples: PredictionSample[]
}

export interface PredictResponse {
  status: string
  method: string
  model_used?: string
  text: string
  summary?: string
  prediction: number
  sentiment: string
  emoji: string
  confidence: number
  confidence_percent?: number
  model_linked?: boolean
  available_models?: string[]
  similar_reviews_count?: number
  similar_reviews_agreement?: string
  example_similar?: string
  data_distribution?: {
    negative: number
    neutral: number
    positive: number
  }
  message?: string
  error?: string
  source_endpoint?: 'spark' | 'similar'
}

export interface SentimentsDistributionResponse {
  status: string
  total_reviews: number
  distribution: {
    negative: { count: number; percentage: number }
    neutral: { count: number; percentage: number }
    positive: { count: number; percentage: number }
  }
  emojis: {
    negative: string
    neutral: string
    positive: string
  }
}

export interface BestWorstReviewsResponse {
  status: string
  count: number
  reviews: Array<{
    Text: string
    Summary: string
    Score: number
    prediction_str: string
  }>
}

export interface UserObject {
  id: string
  username: string
  email: string
  full_name?: string
  role?: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
  last_login?: string | null
}

export interface AuthResponse {
  access_token: string
  token_type: string
  expires_at?: string
  message?: string
  status?: string
  user?: UserObject
}
