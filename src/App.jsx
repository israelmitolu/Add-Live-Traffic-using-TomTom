import { useEffect, useState, useRef } from "react";
import "./App.css";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import * as ttmaps from "@tomtom-international/web-sdk-maps";
import tt from "@tomtom-international/web-sdk-services";

function App() {
  const mapElement = useRef();
  const [map, setMap] = useState({});

  //Initial state for search
  const [query, setQuery] = useState("");
  const [result, setResult] = useState({});

  const [MapLongitude, setMapLongitude] = useState(-122.4194);
  const [MapLatitude, setMapLatitude] = useState(37.7749);

  useEffect(() => {
    let map = ttmaps.map({
      key: "nG6oY1L34rbTfoLz0D205CrB42a3mf8m",
      container: "map-area",
      center: [MapLongitude, MapLatitude],
      zoom: 18,
      style: {
        map: "basic_main",
        poi: "poi_main",
        trafficIncidents: "incidents_day",
        trafficFlow: "flow_relative",
      },
      styleVisibility: {
        trafficFlow: true,
        trafficIncidents: true,
      },
    });
    setMap(map);
    return () => {
      map.remove();
    };
  }, []);

  //Animate movement of map to new location
  const moveMapTo = (newLoc) => {
    map.flyTo({
      center: newLoc,
      zoom: 15,
    });
  };

  // Search Location
  const fuzzySearch = (query) => {
    tt.services
      .fuzzySearch({
        key: "nG6oY1L34rbTfoLz0D205CrB42a3mf8m",
        query: query,
      })
      .then((res) => {
        const amendRes = res.results;
        setResult(amendRes);
        moveMapTo(res.results[0].position);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Result box
  const ResultBox = ({ result }) => (
    <div
      className="result"
      onClick={(e) => {
        moveMapTo(result.position);
      }}
    >
      {result.address.freeformAddress}, {result.address.country}
    </div>
  );

  return (
    <div className="App">
      <div className="control">
        <h2>Map Controls</h2>
        <div className="search-wrapper">
          <div className="search-control">
            <input
              className="input"
              type="text"
              placeholder="Search Location"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  fuzzySearch(query);
                }
              }}
              required
            />
            <button type="submit" onClick={() => fuzzySearch(query)}>
              Search
            </button>
          </div>

          <div className="results">
            {result.length > 0 ? (
              result.map((resultItem) => (
                <ResultBox result={resultItem} key={resultItem.id} />
              ))
            ) : (
              <h4>No locations</h4>
            )}
          </div>
        </div>
      </div>
      <div ref={mapElement} id="map-area"></div>
    </div>
  );
}

export default App;
