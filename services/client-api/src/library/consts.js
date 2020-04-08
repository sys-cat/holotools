module.exports = () => {
  return {
    VIDEO_STATUSES: {
      LIVE: 'live',
      UPCOMING: 'upcoming',
      PAST: 'past',
      DEAD: 'dead',
    },
    VIDEO_TYPES: {
      YOUTUBE: 'youtube',
      BILIBILI: 'bilibili',
    },
    CACHE_LIFETIME_SECONDS: 15,
    VIDEOS_PAST_HOURS: 6,
  };
};
