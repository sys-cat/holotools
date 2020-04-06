const moment = require('moment-timezone');

const consts = require('../config/consts');
const Video = require('./Video');

class YoutubeVideo extends Video {
  constructor(data) {
    super();
    this.type = consts.VIDEO_TYPES.YOUTUBE;
    // TODO: parse at data convert step
    this.status = 'live/upcoming';
    this.id = data.ytVideoId;
    this.channel = data.ytChannelId;
    this.image = YoutubeVideo._getYoutubeThumbnail(data.ytVideoId);
    this.title = data.title;
    this.timeScheduled = moment(data.liveSchedule).unix();
    this.viewers = data.liveViewers;
  }

  static _getYoutubeThumbnail(videoId) {
    return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  }

  // eslint-disable-next-line class-methods-use-this
  toJSON() {
    throw new Error('Not implemented');
  }
}

module.exports = YoutubeVideo;
