// =====================
// ANALYTICS SYSTEM
// =====================

const analytics = {
    sessionStart: new Date(),
    events: [],
    scrollDepth: 0,
    maxScrollDepth: 0,
    formInteractions: 0,

    /**
     * Log an event with timestamp and metadata
     * @param {string} eventName - Name of the event
     * @param {object} eventData - Event data/metadata
     */
    log(eventName, eventData = {}) {
        const timestamp = new Date().toISOString();
        const url = window.location.href;
        this.events.push({
            timestamp,
            name: eventName,
            data: eventData,
            url
        });
        console.log(`[ANALYTICS] ${eventName}`, eventData);
    },

    /**
     * Track scroll depth percentage
     */
    trackScroll() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
        this.scrollDepth = Math.round(scrollPercent);

        if (this.scrollDepth > this.maxScrollDepth) {
            this.maxScrollDepth = this.scrollDepth;

            // Log at 25%, 50%, 75%, and 100%
            if (this.maxScrollDepth === 25 || this.maxScrollDepth === 50 || this.maxScrollDepth === 75 || this.maxScrollDepth === 100) {
                this.log(`scroll_depth_${this.maxScrollDepth}`, { depth: this.maxScrollDepth });
            }
        }
    },

    /**
     * Print comprehensive session analytics summary
     */
    printSummary() {
        const sessionDuration = new Date() - this.sessionStart;
        const sessionDurationSeconds = (sessionDuration / 1000).toFixed(2);

        console.clear();
        console.log('%c=== RISE BY RICE - SESSION ANALYTICS SUMMARY ===', 'color: #D4C5A9; font-size: 16px; font-weight: bold;');
        console.log('');

        console.log('%cSESSION INFO:', 'color: #D4C5A9; font-weight: bold;');
        console.log(`Duration: ${sessionDurationSeconds} seconds`);
        console.log(`Start Time: ${this.sessionStart.toLocaleString()}`);
        console.log(`End Time: ${new Date().toLocaleString()}`);
        console.log('');

        console.log('%cUSER METRICS:', 'color: #D4C5A9; font-weight: bold;');
        console.log(`Max Scroll Depth: ${this.maxScrollDepth}%`);
        console.log(`Form Interactions: ${this.formInteractions}`);
        console.log(`Total Events Tracked: ${this.events.length}`);
        console.log(`Viewport Size: ${window.innerWidth}x${window.innerHeight}`);
        console.log('');

        console.log('%cBROWSER INFO:', 'color: #D4C5A9; font-weight: bold;');
        console.log(`User Agent: ${navigator.userAgent}`);
        console.log(`Language: ${navigator.language}`);
        console.log(`Platform: ${navigator.platform}`);
        console.log('');

        console.log('%cEVENTS TRACKED:', 'color: #D4C5A9; font-weight: bold;');
        this.events.forEach((event, index) => {
            console.log(`${index + 1}. ${event.timestamp} - ${event.name}`, event.data);
        });
        console.log('');

        console.log('%cFILTERED EVENT COUNTS:', 'color: #D4C5A9; font-weight: bold;');
        const eventCounts = {};
        this.events.forEach(event => {
            eventCounts[event.name] = (eventCounts[event.name] || 0) + 1;
        });
        Object.entries(eventCounts).forEach(([name, count]) => {
            console.log(`${name}: ${count}`);
        });
        console.log('');

        console.log('%cFULL EVENT LOG:', 'color: #D4C5A9; font-weight: bold;');
        console.table(this.events);
        console.log('');

        console.log('%c======================================', 'color: #D4C5A9;');
    },

    /**
     * Export session data as JSON
     */
    exportData() {
        return {
            session: {
                startTime: this.sessionStart.toISOString(),
                endTime: new Date().toISOString(),
                durationSeconds: ((new Date() - this.sessionStart) / 1000).toFixed(2),
                maxScrollDepth: this.maxScrollDepth,
                formInteractions: this.formInteractions
            },
            device: {
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                userAgent: navigator.userAgent,
                language: navigator.language,
                platform: navigator.platform
            },
            events: this.events
        };
    }
};

// Make analytics global
window.analytics = analytics;
