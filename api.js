// public/js/api.js  (browser side)
// Bu dosya Cuttly API ile bağlantı kurmak için kullanılır
// Not: Gerçek kullanım için Firebase Functions yapılandırması gerekir

// Mock API fonksiyonu - Gerçek kullanım için yorum satırına alın
export async function fetchLinkAnalytics(shortLink) {
  // Simüle edilmiş veri döndür
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    total: Math.floor(Math.random() * 10000) + 1000,
    daily: Math.floor(Math.random() * 500) + 50,
    yesterday: Math.floor(Math.random() * 400) + 40,
    weekly: Math.floor(Math.random() * 3000) + 500,
    monthly: Math.floor(Math.random() * 10000) + 2000,
    allTime: Math.floor(Math.random() * 15000) + 3000,
    trend: Array.from({length: 7}, () => Math.floor(Math.random() * 200) + 50)
  };
}

/* 
// Gerçek API kullanımı için (Firebase Functions gerektirir):
import { httpsCallable, getFunctions } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-functions.js";

const functions = getFunctions();
const getCuttlyStats = httpsCallable(functions, 'getCuttlyStats');

export async function fetchLinkAnalytics(shortLink) {
  try {
    const { data } = await getCuttlyStats({ short: shortLink });
    return {
      total       : data.stats?.clicks          || 0,
      daily       : data.stats?.clicksToday     || 0,
      yesterday   : data.stats?.clicksYesterday || 0,
      weekly      : data.stats?.clicksWeek      || 0,
      monthly     : data.stats?.clicksMonth     || 0,
      allTime     : data.stats?.clicks          || 0,
      trend       : data.stats?.dailyClicks     || []
    };
  } catch (error) {
    console.error('API Hatası:', error);
    // Hata durumunda mock veri döndür
    return {
      total: 0, daily: 0, yesterday: 0, weekly: 0, monthly: 0, allTime: 0, trend: []
    };
  }
}
*/