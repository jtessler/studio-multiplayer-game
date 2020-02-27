import React, { Component } from "react";
import "./style.css";
import Grid from "@material-ui/core/Grid";

export default class LandingPage extends Component {
  landingPageRender() {
    return (
      <div class="main">
        <div id="drag" />
        <Grid container spacing={12}>
          <Grid item xs={4}>
            4
          </Grid>
          <Grid item xs={4}>
            <img src="https://media0.giphy.com/media/8UHxg3Cn2A2kP74zrk/source.gif" />
          </Grid>
          <Grid item xs={4}>
            4
          </Grid>
          <Grid container spacing={12}>
            <Grid item xs={4}>
              4
            </Grid>
            <Grid item xs={4}>
              <button id="NewSession">Submit tea</button>
            </Grid>
            <Grid item xs={4}>
              4
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}
