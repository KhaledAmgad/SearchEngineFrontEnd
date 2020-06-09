//const domain = "https://20a2a789d195.ngrok.io/";
const domain = "http://localhost:8080/";
export default class Client {
  handleAutoComplete(e) {
    let result = new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
      if (e === "") {
        request.open("GET", domain + "AutoComplete?search='");
      } else {
        request.open("GET", domain + "AutoComplete?search=" + e);
      }

      request.onreadystatechange = () => {
        let raw = request.responseText;
        let objectfied = JSON.parse(raw);
        resolve(objectfied);
      };

      request.send();
    });

    return result;
  }
  getTrends(e) {
    let result = new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
      request.open("GET", domain + "getTrends?selectCountry=" + e);

      request.onreadystatechange = () => {
        let raw = request.responseText;
        let objectfied = JSON.parse(raw);
        resolve(objectfied);
      };

      request.send();
    });

    return result;
  }

  handleSubmitSearch(e) {
    let result = new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();

      if (e.img) {
        request.open(
          "GET",
          domain +
            "SearchImages?" +
            "search=" +
            e.search +
            "&page_Images=" +
            e.page_Images +
            "&selectCountry=" +
            e.selectCountry
        );
      } else {
        request.open(
          "GET",
          domain +
            "SearchAll?" +
            "search=" +
            e.search +
            "&page=" +
            e.page +
            "&selectCountry=" +
            e.selectCountry
        );
      }

      request.onreadystatechange = () => {
        let raw = request.responseText;
        let objectfied = JSON.parse(raw);
        resolve(objectfied);
      };

      request.send();
    });

    return result;
  }
  handleSiteClick(url, search) {
    new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
      request.open(
        "GET",
        domain + "LinkClick?url=" + url + "&search=" + search
      );
      request.send();
    });
  }
}
