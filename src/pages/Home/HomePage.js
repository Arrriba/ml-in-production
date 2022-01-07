import React, { useState, useEffect } from "react";
import DigitCanvas from "../../components/Canvas";
import DigitCard from "../../components/DigitCard";
import * as tf from "@tensorflow/tfjs";
import "./home.css";

const HomePage = (props) => {
  const [mnistModel, setMnistModel] = useState(null);
  const [predictedResult, setPredictedResult] = useState(null);

  const predictDigit = async (data) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };

    fetch('https://us-central1-chrome-flight-337209.cloudfunctions.net/function-1', requestOptions)
      .then((response) => {
        if (!response.ok) throw new Error(response.json())
        else return response.json()
      })
      .then((data) =>{
          const predictions = data
          if (predictions) {
            const predictedDigit = predictions.indexOf(Math.max(...predictions));
            setPredictedResult(predictedDigit);
            console.log("Predicted result: ", predictedDigit);
          }
      })
      .catch((err) => console.log(err))
  };

  const predictFromApi = (data) => {
    data.array().then((array) => {
      const body = {
        instances: array
      };

      const params = {
        method: "POST",
        body: JSON.stringify(body)
      };

      fetch('https://storage.googleapis.com/soa-bucket/model/saved_model.pb', params)
        .then((res) => res.json())
        .then((data) => {
          const predictions = data.predictions && data.predictions[0];
          if (predictions) {
            const predictedDigit = predictions.indexOf(Math.max(...predictions));
            console.log("Predicted result: ", predictedDigit);
          }
        })
        .catch((err) => {
          console.error("Error: ", err);
        });
    });
  };

  useEffect(() => {
    // async function loadModel() {
    //   const model = await tf.loadLayersModel('https://storage.googleapis.com/soa-bucket/model/saved_model.pb');
    //   setMnistModel(model);
    // }
    // loadModel();
  }, []);

  return (
    <div className="home-container">
      <div className="inner-container">
        <div style={{ width: "50%", minWidth: "300px" }}>
          <DigitCanvas predictDigit={predictDigit} />

        </div>
        <div style={{ width: "50%", minWidth: "300px" }}>
          <DigitCard digit={predictedResult} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
