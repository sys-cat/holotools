const { Router } = require('express');
const moment = require('moment-timezone');

const consts = require('../../config/consts');
const memcached = require('../../config/memcached');
const firestore = require('../../config/firestore');
const asyncMiddleware = require('../../middlewares/aysncMiddleware');
const videoDataMapper = require('../../utils/videoDataMapper');
const logger = require('../../utils/logger');

const router = Router();

router.get('/live', asyncMiddleware(async (req, res) => {
  const liveCache = await memcached.get('live');
  const cacheData = liveCache && JSON.parse(liveCache);

  if (cacheData) {
    cacheData.cached = true;
    logger.log('Returning cache');
    return res.json(cacheData);
  }

  const results = {
    live: [],
    upcoming: [],
  };

  logger.log('Fetching Firestore');
  const videoCollection = firestore.collection('video')
    .where('ytVideoId', '<', '\uf8ff')
    .where('status', 'in', [consts.VIDEO_STATUSES.LIVE, consts.VIDEO_STATUSES.UPCOMING]);
  const videos = await videoCollection.get();

  const nowMoment = moment();

  videos.forEach((video) => {
    const videoData = video.data();
    if (videoData.status === consts.VIDEO_STATUSES.LIVE
      || nowMoment.isSameOrAfter(moment(videoData.liveSchedule))) {
      results.live.push(videoData);
    } else if (videoData.status === consts.VIDEO_STATUSES.UPCOMING) {
      results.upcoming.push(videoData);
    }
  });

  results.live = results.live.map(videoDataMapper);
  results.upcoming = results.upcoming.map(videoDataMapper);

  logger.log('Saving cache');
  await memcached.set('live', JSON.stringify(results), consts.CACHE_LIFETIME_SECONDS);

  return res.json(results);
}));

module.exports = router;
