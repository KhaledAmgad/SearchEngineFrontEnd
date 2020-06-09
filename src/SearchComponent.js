import React from "react";
export default class SearchComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      header: this.props.header,
      url: this.props.url,
      snippets: this.props.snippets,
      search: this.props.search,
      client: this.props.client
    };
  }

  render() {
    return (
      <div className="searchComponent">
        <a
          href={this.state.url}
          onClick={() =>
            this.state.client.handleSiteClick(this.state.url, this.state.search)
          }
        >
          <h4>{this.state.header}</h4>
          <h5>{this.state.url}</h5>
        </a>
        <h6>{this.state.snippets} ...</h6>
      </div>
    );
  }
}
