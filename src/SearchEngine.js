import React from "react";
import { Button, Spinner } from "reactstrap";
import ProgressBar from "react-bootstrap/ProgressBar";
import Client from "./Client";
import SearchComponent from "./SearchComponent";
import ImageComponent from "./ImageComponent";
import PropTypes from "prop-types";
import SpeechRecognition from "react-speech-recognition";

const propTypes = {
  // Props injected by SpeechRecognition
  transcript: PropTypes.string,
  resetTranscript: PropTypes.func,
  startListening: PropTypes.func,
  stopListening: PropTypes.func
};

class SearchEngine extends React.Component {
  constructor(props) {
    super(props);
    this.client = new Client();
    this.state = {
      search: "",
      page: 1,
      page_Images: 1,
      img: false,
      searchList: [],
      imageList: [],
      AutoCompleteList: [],
      NumberOfPages: 0,
      NumberOfPages_Images: 0,
      listening: false,
      selectCountry: "Egypt",
      countries: ["Egypt", "UK", "USA", "Germany"],
      loading: false,
      showTrends: false,
      trends: []
    };
  }

  toggleListen = () => {
    this.setState(
      {
        listening: !this.state.listening
      },
      this.handleListen
    );
  };

  handleListen = () => {
    if (this.state.listening) {
      this.props.startListening();
    } else {
      this.setState(
        {
          search: this.state.search + " " + this.props.transcript
        },
        this.props.resetTranscript(),
        this.props.stopListening()
      );
    }
  };

  setSearchResult = e => {
    this.client.handleSubmitSearch(this.state).then(r => {
      this.setState({
        searchList: r.searchList,
        imageList: r.imageList,
        NumberOfPages: r.NumberOfPages,
        NumberOfPages_Images: r.NumberOfPages_Images,
        loading: false
      });
      window.scrollTo(0, 0);
    });
  };

  getTrends = e => {
    if (this.state.showTrends) {
      this.setState(
        {
          loading: true
        },
        () => {
          this.client.getTrends(this.state.selectCountry).then(r => {
            this.setState({
              trends: r.trends,
              loading: false
            });
            window.scrollTo(0, 0);
          });
        }
      );
    } else {
      this.setState({
        loading: false
      });
    }
  };

  textChangeAutoComplete = e => {
    this.setState({ search: e.target.value });
    this.client.handleAutoComplete(e.target.value).then(r => {
      this.setState({ AutoCompleteList: r.AutoCompleteList });
    });
  };

  SubmitSearch = e => {
    this.setState({ page: 1, page_Images: 1, loading: true }, () => {
      this.setSearchResult();
    });
  };
  setImagesBool = e => {
    this.setState(
      { img: !this.state.img, page: 1, page_Images: 1, loading: true },
      () => {
        this.setSearchResult();
      }
    );
  };

  setShowTrendsBool = e => {
    this.setState(
      {
        showTrends: !this.state.showTrends
      },
      () => {
        this.getTrends();
      }
    );
  };

  getAnotherPage = e => {
    if (this.state.img) {
      this.setState(
        { page_Images: parseInt(e.target.value, 10), page: 1, loading: true },
        () => {
          this.setSearchResult();
        }
      );
    } else {
      this.setState(
        { page: parseInt(e.target.value, 10), page_Images: 1, loading: true },
        () => {
          this.setSearchResult();
        }
      );
    }
  };

  searchOrSearchImagesOrTrends() {
    if (this.state.showTrends) {
      return (
        <div>
          {this.state.trends.map((e, i) => {
            return (
              <div className="trend" key={e.name + i}>
                <h5>{e.id + ". "}</h5>
                <h6>{e.name}</h6>
                <h6>{" (" + e.freq + ") Searches"}</h6>
                <ProgressBar
                  className="ProgressBar"
                  now={e.percentage}
                  label={e.percentage + "%"}
                />
              </div>
            );
          })}
        </div>
      );
    } else {
      if (this.state.img) {
        return (
          <div>
            <div className="row">
              {this.state.imageList.map((e, i) => {
                return (
                  <ImageComponent
                    key={e.imgUrl + i}
                    imgUrl={e.imgUrl}
                    url={e.url}
                  />
                );
              })}
            </div>
            {Array.apply(null, { length: this.state.NumberOfPages_Images }).map(
              (e, i) => {
                return this.state.page_Images !== i + 1 ? (
                  <Button
                    className="pageButton"
                    color="light"
                    key={i}
                    value={i + 1}
                    onClick={this.getAnotherPage}
                  >
                    {i + 1}
                  </Button>
                ) : (
                  <Button
                    className="pageButton"
                    color="dark"
                    key={i}
                    value={i + 1}
                  >
                    {i + 1}
                  </Button>
                );
              }
            )}
          </div>
        );
      }
      return (
        <div>
          {this.state.searchList.map((e, i) => {
            return (
              <SearchComponent
                key={e.url + i}
                header={e.header}
                url={e.url}
                snippets={e.snippets}
                search={this.state.search}
                client={this.client}
              />
            );
          })}

          {Array.apply(null, { length: this.state.NumberOfPages }).map(
            (e, i) => {
              return this.state.page !== i + 1 ? (
                <Button
                  className="pageButton"
                  color="light"
                  key={i}
                  value={i + 1}
                  onClick={this.getAnotherPage}
                >
                  {i + 1}
                </Button>
              ) : (
                <Button
                  className="pageButton"
                  color="dark"
                  key={i}
                  value={i + 1}
                >
                  {i + 1}
                </Button>
              );
            }
          )}
        </div>
      );
    }
  }
  renderVoiceOrStop = () => {
    if (this.state.listening === false) {
      return "Voice";
    }
    return "Stop";
  };

  renderImagesOrAll = () => {
    if (this.state.img === false) {
      return "Images";
    }
    return "All";
  };

  renderTrendsOrSearch = () => {
    if (this.state.showTrends === false) {
      return "Trends";
    }
    return "Search";
  };
  renderHeaderOrNot = () => {
    if (this.state.showTrends === false) {
      return (
        <div className="inline">
          <Button className="margin" color="light" onClick={this.setImagesBool}>
            {this.renderImagesOrAll()}
          </Button>
          <Button className="margin" color="light" onClick={this.toggleListen}>
            {this.renderVoiceOrStop()}
          </Button>
          <Button className="margin" color="light" onClick={this.SubmitSearch}>
            Search
          </Button>
          {this.renderLoadingOrNot()}

          <p className="margin">{this.props.transcript}</p>

          <input
            type="text"
            className="inputWidth"
            list="AutoCompleteList"
            name="searchInput"
            value={this.state.search}
            autoComplete="off"
            onChange={this.textChangeAutoComplete}
            onKeyPress={event => {
              if (event.key === "Enter") {
                this.SubmitSearch();
              }
            }}
          />
          <datalist id="AutoCompleteList">
            {this.state.AutoCompleteList.map((e, i) => {
              return <option color="link" key={i} value={e} />;
            })}
          </datalist>
        </div>
      );
    }
    return this.renderLoadingOrNot();
  };
  renderLoadingOrNot = () => {
    if (this.state.loading === false) {
      return null;
    }
    return (
      <Button className="margin" color="light" disabled={true}>
        <Spinner size="sm" animation="border" />
      </Button>
    );
  };

  render() {
    return (
      <div>
        <div className="headerFixed">
          <select
            className="selectCountry"
            value={this.state.selectCountry}
            onChange={e =>
              this.setState({ selectCountry: e.target.value }, () => {
                this.getTrends();
              })
            }
          >
            {this.state.countries.map(country => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>

          <Button
            className="margin"
            color="light"
            onClick={this.setShowTrendsBool}
          >
            {this.renderTrendsOrSearch()}
          </Button>
          {this.renderHeaderOrNot()}
        </div>
        {this.searchOrSearchImagesOrTrends()}
      </div>
    );
  }
}

SearchEngine.propTypes = propTypes;
const options = {
  autoStart: false
};

export default SpeechRecognition(options)(SearchEngine);
