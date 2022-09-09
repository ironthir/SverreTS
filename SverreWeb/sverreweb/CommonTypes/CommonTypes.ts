export type Emoji = {
  name: string;
  roles: Array<any>;
  id: string;
  require_colons: boolean;
  managed: boolean;
  animated: boolean;
  available: boolean;
};

export type Role = {
  id: string;
  name: string;
  permissions: 104324673;
  position: number;
  color: number;
  hoist: boolean;
  managed: boolean;
  mentionable: boolean;
  icon: string | null;
  unicode_emoji: string | null;
  flags: number;
  permissions_new: string | null;
};

export type UserInfo = {
  avatar: string;
  communication_disabled_until: boolean;
  flags: any;
  is_pending: boolean;
  joined_at: Date;
  nick: string;
  pending: boolean;
  premium_since: Date | null;
  roles: string[];
  user: {
    id: string;
    username: string;
    avatar: string;
    avatar_decoration: null;
    discriminator: string;
    public_flags: number;
    bot: boolean;
  };
  mute: boolean;
  deaf: boolean;
};

export type Serverinfo = {
  id: string;
  name: string;
  icon: string;
  description: string | null;
  discovery_splash: any;
  features: Array<any>;
  emojis: Emoji[];

  stickers: any;
  banner: string | null;
  owner_id: string;
  application_id: string | null;
  region: "eu-central";
  afk_channel_id: string | null;
  afk_timeout: 300;
  system_channel_id: string | null;
  widget_enabled: boolean;
  widget_channel_id: string;
  verification_level: number;
  roles: Array<Role>;

  default_message_notifications: number;
  mfa_level: number;
  explicit_content_filter: number;
  max_presences: null;
  max_members: number;
  max_stage_video_channel_users: number;
  max_video_channel_users: number;
  vanity_url_code: string | null;
  premium_tier: number;
  premium_subscription_count: number;
  system_channel_flags: number;
  preferred_locale: string | null;
  rules_channel_id: null;
  public_updates_channel_id: null;
  hub_type: null;
  premium_progress_bar_enabled: boolean;
  nsfw_level: number;
  embed_enabled: boolean;
  embed_channel_id: string | null;
};
