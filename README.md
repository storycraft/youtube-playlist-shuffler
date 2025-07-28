# Youtube playlist shuffler
Shuffle every videos in playlist automatically via Github Actions.
The default settings shuffle the playlist daily 00:00.

> [!WARNING]
> This service uses Youtube's private API, Innertube and may stop working anytime.
> 
> Use at your own risk.

## Prerequisites
1. Acquire Youtube session cookie using guide from [Youtube.js](https://ytjs.dev/guide/authentication.html).
2. Fill Youtube session cookie to actions secret named `YT_SESSION`.
3. Create an actions secret named `SOURCE_PLAYLIST_ID` and put source playlist id in it.
4. Create an actions secret named `TARGET_PLAYLIST_ID` and put playlist id, where all shuffled videos will be placed.

> [!WARNING]
> Every videos added in `TARGET_PLAYLIST_ID` will be deleted.
> Same items will be removed and only one will remain.
>
> `SOURCE_PLAYLIST_ID` and `TARGET_PLAYLIST_ID` can be same. However videos may be lost on unexpected error.

## License
This project is licensed under MIT.
