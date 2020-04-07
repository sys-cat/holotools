const moment = require('moment-timezone');

const consts = require('../config/consts');

const _getYoutubeThumbnail = (videoId) => `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

const _youtubeMapper = (data) => ({
  type: consts.VIDEO_TYPES.YOUTUBE,
  id: data.ytVideoId,
  channel: data.ytChannelId,
  image: _getYoutubeThumbnail(data.ytVideoId),
  title: data.title,
  timeScheduled: moment(data.liveSchedule).unix(),
  viewers: data.liveViewers,
});

const _bilibiliMapper = (data) => ({
  type: consts.VIDEO_TYPES.BILIBILI,
  id: data.bbVideoId,
  // FIXME: not sure if that one works for bili
  channel: data.ytChannelId,
  image: data.thumbnail,
  title: data.title,
  timeScheduled: moment(data.liveSchedule).unix(),
  viewers: data.liveViewers,
});

const _getMapper = (video) => {
  if (video.ytVideoId) {
    return _youtubeMapper;
  }

  return _bilibiliMapper;
};

module.exports = (video) => {
  const mapper = _getMapper(video);

  return mapper(video);
};
