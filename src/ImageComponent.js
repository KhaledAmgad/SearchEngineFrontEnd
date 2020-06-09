import React from "react";
import { CardImg } from "reactstrap";

export default class ImageComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: this.props.imgUrl,
      url: this.props.url,
      search: this.props.search
    };
  }

  render() {
    return (
      <div className="column">
        <a href={this.state.url}>
          <CardImg src={this.state.imgUrl} alt="Card image cap" />
          <p className="textOverFlow">{this.state.url}</p>
        </a>
      </div>
    );
  }
}
