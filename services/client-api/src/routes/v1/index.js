const { Router } = require('express');
const { Firestore } = require('@google-cloud/firestore');
const moment = require('moment-timezone');

const consts = require('../../config/consts');
const memcached = require('../../config/memcached');
const asyncMiddleware = require('../../middlewares/aysncMiddleware');
const videoDataMapper = require('../../utils/videoDataMapper');

const CLIENT_SECRET = JSON.parse(process.env.GOOGLE_SERVICE_JSON);

const router = Router();

const firestore = new Firestore({
  projectId: CLIENT_SECRET.project_id,
  credentials: {
    client_email: CLIENT_SECRET.client_email,
    private_key: CLIENT_SECRET.private_key,
  },
});

router.get('/live', asyncMiddleware(async (req, res) => {
  const liveCache = await memcached.get('live');
  const cacheData = liveCache && JSON.parse(liveCache);

  if (cacheData) {
    cacheData.cached = true;
    return res.json(cacheData);
  }

  const results = {
    live: [],
    upcoming: [],
  };

  console.log('FIRESTORE CALL');
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

  await memcached.set('live', JSON.stringify(results), consts.CACHE_LIFETIME_SECONDS);

  return res.json(results);
}));

module.exports = router;
