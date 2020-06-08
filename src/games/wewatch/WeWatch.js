import GameComponent from "../../GameComponent.js";
import React from "react";
import YouTube from "react-youtube";
import SocialUI from "./SocialUI.js";
import VoteUI from "./VoteUI.js";
import "./wewatch.css";

export default class WeWatch extends GameComponent {
  constructor(props) {
    super(props);
    let users = this.getSessionUserIds();
    let userCount = users.length;
    this.state = {
      eventLog: ["Welcome! There are " + userCount + " users in the room"],
      firebaseData: {
        playing: false,
        timestamp: 0,
        user_id: this.getMyUserId(),
        like_count: 0,
        dislike_count: 0,
        playlist: []
      }
    };
  }

  onVideoReady(e) {
    console.log("Video ready", e);
    let player = e.target;
    this.setState({ videoPlayer: player });
    if (this.state.firebaseData.playing) {
      console.log("Auto playing video");
      player.seekTo(this.state.firebaseData.timestamp, true);
      player.playVideo();
    }
  }

  onVideoPlay(e) {
    if (!this.state.firebaseData.playing) {
      console.log("Pressed play", e);
      this.getSessionDatabaseRef().update({
        playing: true,
        timestamp: e.target.getCurrentTime(),
        user_id: this.getMyUserId()
      });
    }
  }

  onVideoPause(e) {
    if (this.state.firebaseData.playing) {
      console.log("Pressed pause", e);
      this.getSessionDatabaseRef().update({
        playing: false,
        timestamp: e.target.getCurrentTime(),
        user_id: this.getMyUserId()
      });
    }
  }

  onSessionDataChanged(data) {
    let mergedData = Object.assign(this.state.firebaseData, data);
    // Check if Firebase data is missing playlist
    if (!("playlist" in data)) {
      mergedData.playlist = [];
    }
    this.setState({ firebaseData: mergedData });

    if (data.user_id === this.getMyUserId()) {
      console.log("Not updating video player: you made the change");
      return;
    }
    if (mergedData.playlist.length === 0) {
      console.log("Not updating video player: playlist is empty");
      return;
    }
    if (!this.state.videoPlayer) {
      console.log("Not updating video player: video player not ready yet");
      return;
    }
    if (!this.state.videoPlayer.getVideoUrl()) {
      console.log("Not updating video player: no video URL");
      return;
    }

    console.log("Video player URL", this.state.videoPlayer.getVideoUrl());
    console.log("Video player status", this.state.videoPlayer.getPlayerState());

    if (data.playing === true) {
      // video should play (someone else pressed play)
      console.log("Firebase change: video now playing");
      try {
        this.state.videoPlayer.seekTo(data.timestamp, true);
        this.state.videoPlayer.playVideo();
      } catch (err) {
        console.log("Warning: tried playing an unloaded video");
      }
    } else {
      // video should pause (someone else pressed pause)
      console.log("Firebase change: video now paused");
      try {
        this.state.videoPlayer.pauseVideo();
      } catch (err) {
        console.log("Warning: tried pausing an unloaded video");
      }
    }
  }

  handleLikePressed() {
    // Update the firebase database count of likes
    let currentLikeCount = this.state.firebaseData.like_count;
    this.getSessionDatabaseRef().update({
      like_count: currentLikeCount + 1,
      user_id: this.getMyUserId()
    });
  }

  handleDislikePressed() {
    // Update the firebase database count of dislikes
    let currentDislikeCount = this.state.firebaseData.dislike_count;
    this.getSessionDatabaseRef().update({
      dislike_count: currentDislikeCount + 1,
      user_id: this.getMyUserId()
    });
  }

  handleVideoAdd(title, url) {
    let new_playlist_item = {
      title: title,
      url: url
    };
    let playlist = this.state.firebaseData.playlist;
    playlist.push(new_playlist_item);
    this.getSessionDatabaseRef().update({
      playlist: playlist,
      user_id: this.getMyUserId()
    });
  }

  handleNextVideo() {
    // Remove playlist item from front of playlist array.
    let playlist = this.state.firebaseData.playlist;
    playlist.shift();
    this.getSessionDatabaseRef().update({
      playlist: playlist,
      like_count: 0,
      dislike_count: 0,
      playing: false,
      timestamp: 0,
      user_id: this.getMyUserId()
    });
  }

  isVideoPlaylistEmpty() {
    if (this.state.firebaseData.playlist.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  getNextVideoTitle() {
    let playlist = this.state.firebaseData.playlist;
    if (playlist.length < 2) {
      return "";
    } else {
      return playlist[1].title; // Return second item's title.
    }
  }

  render() {
    let opts = {
      width: "100%",
      height: "100%",
      playerVars: {
        controls: 0,
        modestbranding: 1
      }
    };

    let youtubeElement;
    if (this.isVideoPlaylistEmpty()) {
      youtubeElement = <div />;
    } else {
      let urlString = this.state.firebaseData.playlist[0].url;
      let url = new URL(urlString);
      let videoId = url.searchParams.get("v");
      youtubeElement = (
        <YouTube
          containerClassName="player"
          videoId={videoId}
          opts={opts}
          onPlay={e => this.onVideoPlay(e)}
          onPause={e => this.onVideoPause(e)}
          onReady={e => this.onVideoReady(e)}
        />
      );
    }

    return (
      <div className="wewatch">
        <VoteUI
          like={this.state.firebaseData.like_count}
          dislike={this.state.firebaseData.dislike_count}
          onLikePressed={e => this.handleLikePressed()}
          onDislikePressed={e => this.handleDislikePressed()}
        />
        <SocialUI
          onNextVideo={() => this.handleNextVideo()}
          onVideoAdd={(title, url) => this.handleVideoAdd(title, url)}
          nextVideoTitle={this.getNextVideoTitle()}
          eventLog={this.state.eventLog}
        />
        {youtubeElement}
      </div>
    );
  }
}
