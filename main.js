// Analytics Dashboard - Main JavaScript
class AnalyticsDashboard {
    constructor() {
        this.links = [];
        this.currentPeriod = 'daily';
        this.refreshInterval = null;
        this.charts = {};
        this.lastUpdateTime = new Date();
        
        this.init();
    }

    async init() {
        await this.initializeData();
        this.setupEventListeners();
        this.initializeCharts();
        this.startAutoRefresh();
        this.updateUI();
    }

    // Initialize with mock data
    async initializeData() {
        this.links = [
            {
                id: "giris-bot",
                name: "Giriş Bot",
                shortUrl: "cutt.ly/2rJxA8Z3",
                status: "active",
                clicks: { total: , daily: , yesterday: , weekly: , monthly: },
                trend: [100, 120, 95, 110, 130, 115, 856]
            },
            {
                id: "mail-tiklanma",
                name: "Mail Tıklanma",
                shortUrl: "cutt.ly/d9lgOgD",
                status: "active",
                clicks: { total: , daily: , yesterday: , weekly: , monthly: },
                trend: [80, 90, 85, 95, 105, 98, 432]
            },
            {
                id: "fikret-data",
                name: "Fikret Data",
                shortUrl: "cutt.ly/75OTL",
                status: "active",
                clicks: { total: , daily: 0, yesterday: 0, weekly: 0, monthly: },
                trend: [45, 52, 38, 41, 48, 0, 0]
            }
        ];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    setupEventListeners() {
        // Period filter buttons
        document.querySelectorAll('[data-period]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.changePeriod(e.target.dataset.period);
            });
        });

        // Refresh button
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshData();
            });
        }

        // Add link button
        const addLinkBtn = document.getElementById('addLinkBtn');
        if (addLinkBtn) {
            addLinkBtn.addEventListener('click', () => {
                this.showAddLinkModal();
            });
        }

        // Modal close buttons
        const closeModal = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelBtn');
        if (closeModal) closeModal.addEventListener('click', () => this.hideAddLinkModal());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.hideAddLinkModal());

        // Add link form
        const addLinkForm = document.getElementById('addLinkForm');
        if (addLinkForm) {
            addLinkForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addNewLink();
            });
        }

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterLinks(e.target.value);
            });
        }

        // Status filter
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.filterByStatus(e.target.value);
            });
        }

        // Settings save button
        const saveSettings = document.getElementById('saveSettings');
        if (saveSettings) {
            saveSettings.addEventListener('click', () => {
                this.saveSettings();
            });
        }

        // Theme selection
        document.querySelectorAll('.radio-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectTheme(card.dataset.theme);
            });
        });

        // Card hover effects
        document.querySelectorAll('.card-hover').forEach(card => {
            card.addEventListener('mouseenter', () => {
                anime({
                    targets: card,
                    scale: 1.02,
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            });

            card.addEventListener('mouseleave', () => {
                anime({
                    targets: card,
                    scale: 1,
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            });
        });
    }

    initializeCharts() {
        this.initPerformanceChart();
    }

    initPerformanceChart() {
        const chartDom = document.getElementById('performanceChart');
        if (!chartDom) return;

        const myChart = echarts.init(chartDom);
        
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: 'Tıklamalar',
                    type: 'line',
                    stack: 'Total',
                    smooth: true,
                    lineStyle: {
                        width: 3,
                        color: '#4a90a4'
                    },
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: 'rgba(74, 144, 164, 0.3)'
                            }, {
                                offset: 1, color: 'rgba(74, 144, 164, 0.05)'
                            }]
                        }
                    },
                    data: this.links[0].trend
                }
            ]
        };

        myChart.setOption(option);
        this.charts.performance = myChart;

        // Make chart responsive
        window.addEventListener('resize', () => {
            myChart.resize();
        });
    }

    changePeriod(period) {
        this.currentPeriod = period;
        
        // Update active button
        document.querySelectorAll('[data-period]').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-period="${period}"]`).classList.add('active');
        
        // Update chart data based on period
        this.updateChartData(period);
    }

    updateChartData(period) {
        if (!this.charts.performance) return;
        
        let data, labels;
        
        switch(period) {
            case 'daily':
                data = this.links[0].trend;
                labels = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
                break;
            case 'weekly':
                data = [1200, 1350, 1100, 1450, 1600, 1300, 1550];
                labels = ['Hafta 1', 'Hafta 2', 'Hafta 3', 'Hafta 4', 'Hafta 5', 'Hafta 6', 'Hafta 7'];
                break;
            case 'monthly':
                data = [4500, 5200, 4800, 6100, 5800, 7200, 6900];
                labels = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem'];
                break;
        }
        
        this.charts.performance.setOption({
            xAxis: [{
                data: labels
            }],
            series: [{
                data: data
            }]
        });
    }

    refreshData() {
        // Show loading state
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.innerHTML = `
                <svg class="w-4 h-4 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
            `;
        }
        
        // Simulate refresh
        setTimeout(() => {
            this.lastUpdateTime = new Date();
            this.updateUI();
            
            // Reset refresh button
            if (refreshBtn) {
                refreshBtn.innerHTML = `
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                `;
            }
        }, 1000);
    }

    startAutoRefresh() {
        // Clear existing interval
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        
        // Set new interval (1 minute)
        this.refreshInterval = setInterval(() => {
            this.refreshData();
        }, 60000);
    }

    updateUI() {
        // Update last update time
        const lastUpdateElement = document.getElementById('lastUpdate');
        if (lastUpdateElement) {
            const now = new Date();
            const minutes = Math.floor((now - this.lastUpdateTime) / 60000);
            if (minutes === 0) {
                lastUpdateElement.textContent = 'Şimdi güncellendi';
            } else {
                lastUpdateElement.textContent = `${minutes} dakika önce güncellendi`;
            }
        }

        // Update metrics
        this.updateMetrics();
    }

    updateMetrics() {
        const totalClicks = this.links.reduce((sum, link) => sum + link.clicks.total, 0);
        const todayClicks = this.links.reduce((sum, link) => sum + link.clicks.daily, 0);
        const activeLinks = this.links.filter(link => link.status === 'active').length;

        const totalClicksElement = document.getElementById('totalClicks');
        const todayClicksElement = document.getElementById('todayClicks');
        const activeLinksElement = document.getElementById('activeLinks');
        const lastUpdateTimeElement = document.getElementById('lastUpdateTime');

        if (totalClicksElement) totalClicksElement.textContent = this.formatNumber(totalClicks);
        if (todayClicksElement) todayClicksElement.textContent = this.formatNumber(todayClicks);
        if (activeLinksElement) activeLinksElement.textContent = activeLinks;
        if (lastUpdateTimeElement) lastUpdateTimeElement.textContent = 'Şimdi';
    }

    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    showAddLinkModal() {
        const modal = document.getElementById('addLinkModal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
    }

    hideAddLinkModal() {
        const modal = document.getElementById('addLinkModal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }

    addNewLink() {
        const linkName = document.getElementById('linkName').value;
        const originalUrl = document.getElementById('originalUrl').value;
        const shortUrl = document.getElementById('shortUrl').value;

        if (!linkName || !originalUrl || !shortUrl) {
            alert('Lütfen tüm alanları doldurun!');
            return;
        }

        const newLink = {
            id: shortUrl.toLowerCase().replace(/\s+/g, '-'),
            name: linkName,
            shortUrl: `cutt.ly/${shortUrl}`,
            status: 'active',
            clicks: { total: 0, daily: 0, yesterday: 0, weekly: 0, monthly: 0 },
            trend: [0, 0, 0, 0, 0, 0, 0]
        };

        this.links.push(newLink);
        this.hideAddLinkModal();
        this.refreshData();

        // Reset form
        document.getElementById('addLinkForm').reset();

        // Show success message
        this.showSuccessMessage('Link başarıyla eklendi!');
    }

    filterLinks(searchTerm) {
        const linkCards = document.querySelectorAll('[data-link-id]');
        linkCards.forEach(card => {
            const linkName = card.querySelector('h3').textContent.toLowerCase();
            const linkUrl = card.querySelector('p').textContent.toLowerCase();
            
            if (linkName.includes(searchTerm.toLowerCase()) || linkUrl.includes(searchTerm.toLowerCase())) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    filterByStatus(status) {
        const linkCards = document.querySelectorAll('[data-link-id]');
        linkCards.forEach(card => {
            const statusElement = card.querySelector('.status-active, .status-paused, .status-inactive');
            let cardStatus = 'active';
            
            if (statusElement.classList.contains('status-paused')) {
                cardStatus = 'paused';
            } else if (statusElement.classList.contains('status-inactive')) {
                cardStatus = 'inactive';
            }

            if (status === 'all' || cardStatus === status) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    selectTheme(theme) {
        document.querySelectorAll('.radio-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-theme="${theme}"]`).classList.add('selected');
    }

    saveSettings() {
        // Simulate saving settings
        const saveBtn = document.getElementById('saveSettings');
        const originalText = saveBtn.innerHTML;
        
        saveBtn.innerHTML = `
            <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span>Kaydediliyor...</span>
        `;

        setTimeout(() => {
            saveBtn.innerHTML = originalText;
            this.showSuccessMessage('Ayarlar başarıyla kaydedildi!');
        }, 1500);
    }

    showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg success-message';
        successDiv.innerHTML = `
            <div class="flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(successDiv);

        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new AnalyticsDashboard();
});