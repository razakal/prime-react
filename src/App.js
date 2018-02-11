import React, { Component } from 'react';
import axios from 'axios';
axios.defaults.timeout = 5000;

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            URL: 'http://35.190.66.78/?n=2000',
            speed: 150,
            interval: undefined,
            responses: [],
            results: {}
        };

        // Bind methods so that in a callback we will the context (this)
        this.setURL = this.setURL.bind(this);
        this.setSpeed = this.setSpeed.bind(this);
        this.onStart = this.onStart.bind(this);
        this.onStop = this.onStop.bind(this);
    }

    setURL(event) {
        this.setState({
            URL: event.target.value
        });
    }

    setSpeed(event) {
        this.setState({
            speed: event.target.value
        });
    }

    onStart() {
        let interval = setInterval(() => {
            this.calculatePrime();
        }, this.state.speed);

        this.setState({
            interval: interval
        });
    }

    onStop() {
        clearInterval(this.state.interval);

        this.setState({
            interval: undefined
        });
    }

    calculatePrime() {
        const self = this;

        axios.get(this.state.URL)
            .then(function (response) {
                self.handleResponse(response.data);
            })
            .catch(function (error) {
                self.handleResponse({
                    host: 'failed',
                    duration: 5000,
                    result: -1
                });
            });
    }

    handleResponse(response) {
        // Get the last 100 responses including the new response
        let responses = this.state.responses.slice();
        if(responses.length > 99) {
            responses = responses.slice(responses.length - 99);
        }
        responses.push(response);

        // Calculate results
        let results = {};
        for(let i=0; i<responses.length; i++) {
            const responseTmp = responses[i];

            if(results[responseTmp.host] === undefined) {
                results[responseTmp.host] = 0;
            }

            results[responseTmp.host]++;
        }

        // Update state
        this.setState({
            responses: responses,
            results: results
        });
    }

    getAction() {
        if(this.state.interval) {
            return  {
                'label': 'Stop',
                'action': this.onStop
            }
        } else {
            return  {
                'label': 'Start',
                'action': this.onStart
            }
        }
    }

    render() {
        const action = this.getAction();

        return (
            <div className="app">
                <h1 className="title">Calculate Primes</h1>
                <p className="top">
                    <label htmlFor="url">URL:</label> <input id="url" type="text" size="50" value={this.state.URL} onChange={this.setURL} /><br />
                    <label htmlFor="speed">Speed:</label> <input id="speed" type="number" size="10" value={this.state.speed} onChange={this.setSpeed} />< br/>
                    <button onClick={action.action}>{action.label}</button>
                </p>

                <h2>Last 100 results</h2>
                <ul className="list">
                    {Object.keys(this.state.results).sort().map((key) => <li>{key}: {this.state.results[key]}</li>)}
                </ul>
            </div>
        );
    }
}

export default App;
