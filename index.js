// Analytics Dashboard - Entry Point
console.log('Analytics Dashboard başlatılıyor...');

// Sayfa yüklendiğinde dashboard'ı başlat
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard hazır!');
    
    // Eğer ana sayfadaysak, metrikleri güncelle
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        updateMetrics();
    }
});

// Basit metrik güncelleme fonksiyonu
function updateMetrics() {
    const metrics = {
        totalClicks: 24847,
        todayClicks: 1429,
        activeLinks: 3,
        lastUpdate: 'Şimdi'
    };
    
    // Metrik elementlerini güncelle
    Object.keys(metrics).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.textContent = metrics[key];
        }
    });
}

// Global fonksiyonlar
window.showNotification = function(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white z-50 ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
};

// Export fonksiyonları
window.AnalyticsUtils = {
    formatNumber: function(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    },
    
    copyToClipboard: function(text) {
        navigator.clipboard.writeText(text).then(() => {
            window.showNotification('Panoya kopyalandı!');
        });
    }
};