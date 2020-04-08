const {Router} = require('express');
const moment = require('moment-timezone');
const {HoloVideo} = require('../../classes');
const {consts, Firestore, Memcached, log} = require('../../library');

const router = new Router();

router.get('/', (req, res) => {
  (async () => {
    const liveCache = await Memcached.get('live')
        .catch((err) => {
          log.ward('Unable to get cache.');
          return null;
        });
    const cacheData = liveCache && JSON.parse(liveCache);

    if (cacheData) {
      cacheData.cached = true;
      log.info('Returning cache');
      return res.json(cacheData);
    }

    const results = {
      live: [],
      upcoming: [],
    };

    log.info('Fetching Firestore');
    const videoCollection = Firestore.collection('video')
        .where('ytVideoId', '<', '\uf8ff')
        .where('status', 'in', [consts.VIDEO_STATUSES.LIVE, consts.VIDEO_STATUSES.UPCOMING]);
    const videos = await videoCollection.get();

    const nowMoment = moment();

    videos.forEach((video) => {
      const videoData = video.data();
      const videoObj = new HoloVideo(videoData);
      if (videoData.status === consts.VIDEO_STATUSES.LIVE || nowMoment.isSameOrAfter(moment(videoData.liveSchedule))) {
        results.live.push(videoObj.toJSON());
      } else if (videoData.status === consts.VIDEO_STATUSES.UPCOMING) {
        results.upcoming.push(videoObj.toJSON());
      }
    });

    // log.info('Saving cache');
    Memcached.set('live', JSON.stringify(results), consts.CACHE_LIFETIME_SECONDS);

    return results;
  })()
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.json({error: err.message});
      });
});

module.exports = router;
