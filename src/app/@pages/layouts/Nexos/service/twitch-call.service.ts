import { Injectable } from '@angular/core';
declare var Twitch: any;

@Injectable({
  providedIn: 'root'
})
export class TwitchCallService {
  embed: any;
  embed_ready = false;
  cantidad_video = 0;

  constructor() { }

  public twitchInsert(channel) {
    var options = {
      width: '100%',
      height: '100%',
      channel: channel,
      controls: false,
      layout: 'video',
      muted: false,
      autoplay: true
    };
    this.embed = new Twitch.Player('twitch', options);
    this.embed.setMuted(false);
    this.embed.setVolume(1);
    this.embed.addEventListener(Twitch.Embed.VIDEO_PLAY, function () {
      this.embed_ready = true;
      this.cantidad_video++;
      if (this.cantidad_video == 2) {
        this.embed.setQuality("480p30");
      } else {
        if (this.cantidad_video == 3) {
          this.embed.setQuality("360p30");
        } else {
          if (this.cantidad_video > 3) {
            this.embed.setQuality("160p30");
          }
        }
      }
    });
    setTimeout(() => {
      this.getMuted();
    }, 5000);
    this.embed.setMuted(false);
    this.embed.setVolume(1);
    this.embed.setQuality("auto")
  }

  setVolume(volume) {
    this.embed.setMuted(false);
    this.embed.setVolume(volume);
  }

  qualityTwitch() {
    this.embed.setQuality("160p30");
  }

  getMuted() {
    var mutedStatus = this.embed.getMuted();
    return mutedStatus;
  }

  getVolume() {
    var volumen = this.embed.getVolume();
    return volumen;
  }

  public twitchInsert2(channel) {
    var options = {
      width: '100%',
      height: '100%',
      channel: channel,
      controls: false,
      layout: 'video',
      muted: false,
      autoplay: false
    };
    this.embed = new Twitch.Player('twitch-2', options);
    this.embed.setMuted(false);
    this.embed.setVolume(1);
    this.embed.addEventListener(Twitch.Embed.VIDEO_PLAY, function () {
      this.embed_ready = true;
      this.cantidad_video++;
      if (this.cantidad_video == 2) {
        this.embed.setQuality("480p30");
      } else {
        if (this.cantidad_video == 3) {
          this.embed.setQuality("360p30");
        } else {
          if (this.cantidad_video > 3) {
            this.embed.setQuality("160p30");
          }
        }
      }
    });
    this.embed.setMuted(false);
    this.embed.setVolume(1);
    this.embed.setQuality("auto")
  }
}