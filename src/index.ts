import { cleanEnv, str } from 'envalid';
import { Innertube, UniversalCache, type YTNodes } from 'youtubei.js';
import 'dotenv/config';

const env = cleanEnv(process.env, {
  YT_SESSION: str(),
  SOURCE_PLAYLIST_ID: str(),
  TARGET_PLAYLIST_ID: str(),
});

const innerTube = await Innertube.create({
  cookie: env.YT_SESSION,
  cache: new UniversalCache(
    true,
    './.cache',
  ),
});

const list = await allPlaylistVideos(env.SOURCE_PLAYLIST_ID);
// for (const video of list) {
//   console.debug(`${video.index.text || ''}: ${video.author.name} - ${video.title.text || ''}`);
// }
console.info(`Fetched ${String(list.length)} items in playlist`);

const shuffled = list.slice(0);
shuffle(shuffled);
console.info(`Shuffled fetched playlist items`);

// add videos first, in case of unrecoverable errors
const targetPlaylist = await allPlaylistVideos(env.TARGET_PLAYLIST_ID);
await innerTube.playlist.addVideos(env.TARGET_PLAYLIST_ID, shuffled.map(video => video.id));

if (targetPlaylist.length > 0) {
  await innerTube.playlist.removeVideos(
    env.TARGET_PLAYLIST_ID,
    targetPlaylist.map(video => video.set_video_id || ''),
    true,
  );
}
console.info('Shuffled playlist items');

async function allPlaylistVideos(playlistId: string): Promise<YTNodes.PlaylistVideo[]> {
  const list: YTNodes.PlaylistVideo[] = [];

  let part = await innerTube.getPlaylist(playlistId);
  for (; ;) {
    for (const video of part.videos) {
      list.push(video as YTNodes.PlaylistVideo);
    }

    if (!part.has_continuation) {
      break;
    }
    part = await part.getContinuation();
  }

  return list;
}

function shuffle(array: unknown[]) {
  let currentIndex = array.length;

  while (currentIndex != 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}
