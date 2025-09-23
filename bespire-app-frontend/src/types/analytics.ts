export interface Client {
    clientId: string;
    clientName: string;
    logoUrl: string;
}

export interface AnalyticsRecord {
    recordId: string;
    clientId: string;
    date: string;
    social_fb_likes: number;
    social_twitter_followers: number;
    social_linkedin_followers: number;
    social_instagram_followers: number;
    social_tiktok_followers: number; // Added
    seo_organic_traffic: number;
    seo_referring_domains: number;
    seo_backlinks: number;
    seo_organic_keywords: number;
    web_sessions: number;
    web_new_users: number;
    web_avg_engagement_secs: number;
    web_bounce_rate: number;
    email_total_contacts: number;
    email_open_rate: number;
    email_click_rate: number;
    email_conversion_rate: number;
}

export interface AnalyticsData {
    clients: Client[];
    analytics_records: AnalyticsRecord[];
}