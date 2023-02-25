import { Fetch } from "@/components/fetch/fetch";
import "@/styles/Home.module.css";
import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import styled from "styled-components";
import config from "@/config/app.config";
import AutocompleteInput from "@/components/Search";

export default function Home() {
  const [map, setMap] = React.useState(null);
  const [keyword, setKeyword] = React.useState("Bang sue");
  const [locationSelected, setLocationseleted] = React.useState({
    lat: 13.736717,
    lng: 100.523186,
  });
  const [resData, setResData] = React.useState([]);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  const getRestaurant = async (keyword) => {
    try {
      const res = await Fetch({
        method: "GET",
        path: "/api/restaurant/get",
        params: { keyword: keyword },
      });

      if (res.code === 200) {
        setResData(res.result);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const onLoad = (map) => setMap(map);
  const onPlacesChanged = () => {
    const service = new window.google.maps.places.PlacesService(map);
    const bounds = map.getBounds();
    const request = {
      bounds,
      type: ["restaurant"],
    };

    // Perform the search for restaurants
    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setPlaces(results);
      }
    });
  };

  React.useEffect(() => {
    getRestaurant(keyword);
  }, []);
  return (
    <>
      <main
        className="d-flex flex-column"
        style={{
          height: "100vh",
          overflow: "hidden",
          backgroundColor: "#EEEEEE",
        }}
      >
        <div className="row p-4" style={{ height: "100%" }}>
          <div className="col-6">
            <div className="row gy-3">
              <div className="col-12">
                <div
                  className="row justify-content-center"
                  style={{ width: "100%" }}
                >
                  <form className="col-12  mb-12 p-0" style={{ width: "100%" }}>
                    <div className="row bg-transparent">
                      <div className="col-md-10">
                        <div
                          class="autocomplete"
                          style={{ width: "100%", height: "50px" }}
                        >
                          <AutocompleteInput
                            setKeywordLocation={setKeyword}
                            keywordLocation={keyword}
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        <button
                          onClick={() => getRestaurant(keyword)}
                          type="button"
                          class="btn btn-primary"
                          style={{ width: "100%", height: "50px" }}
                        >
                          Search
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="col-md-12 p-2">
                <div className="row align-items-end">
                  <div className="col-md-auto">
                    <h1 style={{ lineHeight: "15px" }}>Restaurants</h1>
                  </div>
                  <div className="col-md-6 ">
                    <span style={{ lineHeight: "10px", opacity: "0.7" }}>
                      {" "}
                      ({resData?.length}) Result
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="col-12 "
                style={{
                  overflowY: "auto",
                  height: "79.5vh",
                  borderRadius: "15px",
                }}
              >
                <div className="row gy-2" style={{ height: "100%" }}>
                  {resData.map((restaurant, inx) => (
                    <ResBoxStyle
                      onClick={() =>
                        setLocationseleted({
                          lat: restaurant?.lat,
                          lng: restaurant?.lng,
                          name: restaurant?.name,
                          placeId: restaurant?.placeId,
                        })
                      }
                      key={inx}
                      className="col-md-12 bg-white"
                      style={{
                        borderRadius: "15px",
                        height: "160px",
                      }}
                    >
                      <div className="row p-1">
                        <div
                          className="col-md-3 p-0 "
                          style={{
                            overflow: "hidden",
                            height: "150px",
                            borderRadius: "10px",
                            textAlign: "center",
                            backgroundColor: "gray",
                          }}
                        >
                          <img
                            src={
                              !!restaurant?.photoReference
                                ? `${config.googlePlacePhoto}?maxwidth=400&photo_reference=${restaurant?.photoReference}&key=${apiKey}`
                                : "/3901287.jpg"
                            }
                            style={{
                              height: "100%",
                              display: "block",
                              margin: "0 auto",
                            }}
                          />
                        </div>
                        <div className="col-md-9 pt-2 pl-3 pb-2 pl-2">
                          <div className="row">
                            <span
                              className="font-weight-bold"
                              style={{ fontSize: "20px", fontWeight: "bold" }}
                            >
                              {restaurant?.name}
                            </span>
                          </div>

                          <div className="row">
                            <span
                              className="font-weight-bold"
                              style={{ fontSize: "18px", opacity: "0.7" }}
                            >
                              {restaurant?.address}
                            </span>
                          </div>
                          <div className="row">
                            <span
                              className="font-weight-bold"
                              style={{ fontSize: "18px", opacity: "0.7" }}
                            >
                              tel:{restaurant?.tel}
                            </span>
                          </div>
                        </div>
                      </div>
                    </ResBoxStyle>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div
            className="col-6 "
            style={{
              height: "100%",
            }}
          >
            <div
              className="bg-white"
              style={{
                borderRadius: "20px",
                height: "100%",
                overflow: "hidden",
              }}
            >
              <LoadScript googleMapsApiKey={apiKey}>
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={locationSelected}
                  zoom={20}
                  onLoad={onLoad}
                  onPlacesChanged={onPlacesChanged}
                >
                  <Marker
                    key={locationSelected.placeId}
                    position={{
                      lat: locationSelected.lat,
                      lng: locationSelected.lng,
                    }}
                    title={locationSelected.name}
                    label={locationSelected.name}
                  >
                    <span>{locationSelected.name}</span>
                  </Marker>
                </GoogleMap>
              </LoadScript>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
const ResBoxStyle = styled.div`
  :hover {
    cursor: pointer;
    transition: ease-in 0.2s;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  }
`;
