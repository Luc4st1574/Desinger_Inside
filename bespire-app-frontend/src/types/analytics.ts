export interface Client {
    clientId: string;
    clientName: string;
    logoUrl: string;
}

export interface AnalyticsRecord {
    recordId: string;
    clientId: string;
    date: string | null;
    social_fb_likes: number | null;
    social_twitter_followers: number | null;
    social_linkedin_followers: number | null;
    social_instagram_followers: number | null;
    social_tiktok_followers: number | null;
    seo_organic_traffic: number | null;
    seo_referring_domains: number | null;
    seo_backlinks: number | null;
    seo_organic_keywords: number | null;
    web_sessions: number | null;
    web_new_users: number | null;
    web_avg_engagement_secs: number | null;
    web_bounce_rate: number | null;
    email_total_contacts: number | null;
    email_open_rate: number | null;
    email_click_rate: number | null;
    email_conversion_rate: number | null;
}

export interface AnalyticsData {
    clients: Client[];
    analytics_records: AnalyticsRecord[];
}