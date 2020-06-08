import React, { ReactDOM } from "react";

export default class CardComponent extends React.Component {
  // Here's a sample on how to hide the card, with explanation
  hideCard() {
    // First, find the root node for this card component
    const rootEl = ReactDOM.findDOMNode(this);

    // Then, search within this card component for the element you want.
    // You can search by tag name, like I did, class name, or id.
    // By using this components root element, querySelector only looks
    // at elements that are children (or grandchildren) of root El.
    // The opposite would be document.querySelector.  Document is the
    // root element for the entire page, so that will search through
    // all HTML elements.
    const imageEl = rootEl.querySelector("img");

    // Then hide the element
    imageEl.hidden = true;
  }
  showCard() {
    const rootEl = ReactDOM.findDOMNode(this);
    const imageEl = rootEl.querySelector("img");
    imageEl.visible = true;
  }
  render() {
    randomImages = [
      "https://i.picsum.photos/id/1066/200/300.jpg",
      "https://i.picsum.photos/id/192/200/300.jpg",
      "https://i.picsum.photos/id/556/200/300.jpg",
      "https://i.picsum.photos/id/1068/200/300.jpg",
      "https://i.picsum.photos/id/852/200/300.jpg"
    ];
    console.log("Props is:" + this.props.image);
    return (
      <div class="img-con">
        <img src={this.props.image} />
      </div>
    );
    // const img-con{
    //   height
    // }
  }
}
//https://picsum.photos/200/300
