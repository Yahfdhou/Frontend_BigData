import type {
  LivePrediction,
  NormalizedPrediction,
  OfflinePrediction,
  RawPrediction,
  PredictionsByDateResponse,
  ProductScoringResponse,
  StatsResponse,
  SentimentsResponse,
  ModelMetricsResponse,
  ModelInfoResponse,
  DataStatsResponse,
  PredictionsSampleResponse,
  PredictResponse,
  SentimentsDistributionResponse,
  BestWorstReviewsResponse,
} from '~/types/api'

type PredictModelName = 'LogisticRegression_Weighted' | 'NaiveBayes' | 'auto'

interface PredictRequestOptions {
  text: string
  summary?: string
  modelName?: PredictModelName
}

const POSITIVE_HINTS = [
  'excellent',
  'excellente',
  'excellente',
  'great',
  'good',
  'bon',
  'bonne',
  'parfait',
  'rapide',
  'satisfait',
  'super',
  'amazing',
  'love',
  'awesome',
  'جميل',
  'ممتاز',
  'رائع',
  'جيد',
]

const NEGATIVE_HINTS = [
  'bad',
  'terrible',
  'awful',
  'mauvais',
  'mauvaise',
  'nul',
  'déçu',
  'decu',
  'cassé',
  'casse',
  'lent',
  'horrible',
  'poor',
  'worst',
  'سيء',
  'سيئة',
  'رديء',
  'سيئ',
]

// دالة مساعدة لضمان تحويل القيم لنصوص
const getString = (value: unknown): string => {
  return typeof value === 'string' ? value : String(value || '')
}

// دالة مساعدة لضمان تحويل القيم لأرقام
const getNumber = (value: unknown): number => {
  if (typeof value === 'number') return value
  const parsed = Number(value)
  return isNaN(parsed) ? 0 : parsed
}

const inferLocalSentiment = ({ text, summary, modelName = 'auto' }: PredictRequestOptions): PredictResponse => {
  const normalizedText = `${text} ${summary || ''}`.toLowerCase()

  const positiveHits = POSITIVE_HINTS.reduce((count, hint) => count + (normalizedText.includes(hint) ? 1 : 0), 0)
  const negativeHits = NEGATIVE_HINTS.reduce((count, hint) => count + (normalizedText.includes(hint) ? 1 : 0), 0)
  const score = positiveHits - negativeHits

  let prediction: 0 | 1 | 2 = 1
  let sentiment = 'neutre'
  let emoji = '😐'

  if (score > 0) {
    prediction = 2
    sentiment = 'positif'
    emoji = '😊'
  } else if (score < 0) {
    prediction = 0
    sentiment = 'négatif'
    emoji = '😡'
  }

  const confidence = Math.max(0.55, Math.min(0.95, 0.6 + Math.min(0.3, Math.abs(score) * 0.08)))

  return {
    status: 'success',
    method: 'local_fallback',
    model_used: modelName,
    text,
    summary,
    prediction,
    sentiment,
    emoji,
    confidence,
    confidence_percent: Math.round(confidence * 1000) / 10,
    model_linked: false,
    available_models: ['LogisticRegression_Weighted', 'NaiveBayes'],
  }
}

export const normalizePrediction = (
  item: any, // استخدمنا any هنا مؤقتاً لتسهيل التحويل من الحقول الجديدة
  index: number,
  source: 'live' | 'offline',
): NormalizedPrediction => {
  
  // التصحيح: بما أن Flask الآن يرسل text و summary بحروف صغيرة للكل
  // نقوم بسحبها مباشرة لضمان عدم ضياع البيانات
  const text = getString(item.text || item.Text)
  const summary = getString(item.summary || item.Summary)
  const score = getNumber(item.score ?? item.Score)

  return {
    id: `${source}-${index}-${score}-${Math.random().toString(36).substr(2, 9)}`, // ID فريد أكثر
    text,
    score,
    prediction: getNumber(item.prediction),
    summary,
    productId: getString(
      item.product_id || item.productId || item.ProductId || item.productID || item.PRODUCTID,
    ),
    sentiment: getString(item.sentiment || item.Sentiment),
    emoji: getString(item.emoji || item.Emoji),
    timestamp: getString(item.timestamp || item.Timestamp || item.created_at || item.createdAt || item.date),
    source,
  }
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const API_BASE = config.public.apiBaseUrl || 'http://3.88.50.172:5000'

  const getStats = () =>
    $fetch<StatsResponse>(`${API_BASE}/api/stats`)

  const getLive = async (): Promise<NormalizedPrediction[]> => {
    try {
      const data = await $fetch<any[]>(`${API_BASE}/api/live`)
      return data.map((item, index) => normalizePrediction(item, index, 'live'))
    } catch (err) {
      console.error('Error fetching live data:', err)
      return []
    }
  }

  const getOffline = async (): Promise<NormalizedPrediction[]> => {
    try {
      const data = await $fetch<any[]>(`${API_BASE}/api/offline`)
      return data.map((item, index) => normalizePrediction(item, index, 'offline'))
    } catch (err) {
      console.error('Error fetching offline data:', err)
      return []
    }
  }

  const getSentiments = async (): Promise<SentimentsResponse | null> => {
    try {
      const data = await $fetch<SentimentsResponse>(`${API_BASE}/api/sentiments`)
      return data
    } catch (err) {
      console.error('Error fetching sentiments data:', err)
      return null
    }
  }

  const getPredictionsByDate = async (): Promise<PredictionsByDateResponse | null> => {
    try {
      const data = await $fetch<PredictionsByDateResponse>(`${API_BASE}/api/predictions-by-date`)
      return data
    } catch (err) {
      console.error('Error fetching predictions by date:', err)
      return null
    }
  }

  const getPredictionsByMonth = async (): Promise<any[] | null> => {
    try {
      const data = await $fetch<any[]>(`${API_BASE}/api/predictions-by-month`)
      return data
    } catch (err) {
      console.error('Error fetching predictions by month:', err)
      return null
    }
  }

  const getProductScoring = async (productId: string): Promise<ProductScoringResponse | null> => {
    try {
      const data = await $fetch<ProductScoringResponse>(`${API_BASE}/api/product-scoring/${encodeURIComponent(productId)}`)
      return data
    } catch (err) {
      console.error('Error fetching product scoring:', err)
      return null
    }
  }

  const getProducts = async (): Promise<string[] | {product_id:string}[] | null> => {
    try {
      const data = await $fetch<any>(`${API_BASE}/api/products`)
      return data
    } catch (err) {
      console.error('Error fetching products list:', err)
      return null
    }
  }

  // New model endpoints
  const getModelMetrics = async (): Promise<ModelMetricsResponse | null> => {
    try {
      const data = await $fetch<ModelMetricsResponse>(`${API_BASE}/api/model/metrics`)
      return data
    } catch (err) {
      console.error('Error fetching model metrics:', err)
      return null
    }
  }

  const getModelInfo = async (): Promise<ModelInfoResponse | null> => {
    try {
      const data = await $fetch<ModelInfoResponse>(`${API_BASE}/api/model/info`)
      return data
    } catch (err) {
      console.error('Error fetching model info:', err)
      return null
    }
  }

  const getDataStats = async (): Promise<DataStatsResponse | null> => {
    try {
      const data = await $fetch<DataStatsResponse>(`${API_BASE}/api/data/stats`)
      return data
    } catch (err) {
      console.error('Error fetching data stats:', err)
      return null
    }
  }

  const getPredictionsSample = async (limit: number = 50): Promise<PredictionsSampleResponse | null> => {
    try {
      const data = await $fetch<PredictionsSampleResponse>(`${API_BASE}/api/predictions/sample?limit=${limit}`)
      return data
    } catch (err) {
      console.error('Error fetching predictions sample:', err)
      return null
    }
  }

  const predictSentiment = async ({ text, summary, modelName = 'auto' }: PredictRequestOptions): Promise<PredictResponse | null> => {
    try {
      const data = await $fetch<PredictResponse>(`${API_BASE}/api/predict`, {
        method: 'POST',
        body: {
          text,
          ...(summary?.trim() ? { summary: summary.trim() } : {}),
          model_name: modelName,
        },
        ignoreResponseError: true,
      })

      if (data.status === 'success') {
        return data
      }

      return {
        ...inferLocalSentiment({ text, summary, modelName }),
        message: data.message || data.error || 'Backend AWS indisponible, local fallback used for preview.',
      }
    } catch (err) {
      console.error('Error predicting sentiment:', err)
      return inferLocalSentiment({ text, summary, modelName })
    }
  }

  const predictSentimentSpark = async (text: string): Promise<PredictResponse | null> => {
    return await predictSentiment({ text, modelName: 'LogisticRegression_Weighted' })
  }

  const predictSentimentSmart = async (text: string): Promise<PredictResponse | null> => {
    return await predictSentiment({ text, modelName: 'auto' })
  }

  const getSentimentsDistribution = async (): Promise<SentimentsDistributionResponse | null> => {
    try {
      const data = await $fetch<SentimentsDistributionResponse>(`${API_BASE}/api/sentiments/distribution`)
      return data
    } catch (err) {
      console.error('Error fetching sentiments distribution:', err)
      return null
    }
  }

  const getBestPredictions = async (limit: number = 10): Promise<BestWorstReviewsResponse | null> => {
    try {
      const data = await $fetch<BestWorstReviewsResponse>(`${API_BASE}/api/predictions/best?limit=${limit}`)
      return data
    } catch (err) {
      console.error('Error fetching best predictions:', err)
      return null
    }
  }

  const getWorstPredictions = async (limit: number = 10): Promise<BestWorstReviewsResponse | null> => {
    try {
      const data = await $fetch<BestWorstReviewsResponse>(`${API_BASE}/api/predictions/worst?limit=${limit}`)
      return data
    } catch (err) {
      console.error('Error fetching worst predictions:', err)
      return null
    }
  }

  return {
    getStats,
    getLive,
    getOffline,
    getSentiments,
    getPredictionsByDate,
    getPredictionsByMonth,
    getProductScoring,
    getProducts,
    getModelMetrics,
    getModelInfo,
    getDataStats,
    getPredictionsSample,
    predictSentiment,
    predictSentimentSpark,
    predictSentimentSmart,
    getSentimentsDistribution,
    getBestPredictions,
    getWorstPredictions,
  }
}