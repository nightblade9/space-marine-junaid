import React from 'react';

class Tile extends React.Component {
    
    constructor(props) {
        super(props);

        // x, y coordinates just make it easier to debug
        this.state = {"x": props.x, "y": props.y, "contents": "empty", "player": props.player};

        if ("contents" in props) {
            // "Contents" is an instance of TileModel
            var tileModel = this.props["contents"];
            var type = tileModel.type.toLowerCase();
            if (type in Tile.VALID_STATES_DISPLAY) {
                this.state["data"] = tileModel;
            } else {
                throw new Error("Invalid tile type: " + type);
            }            
        }
    }

    render() {
        // This is probably an anti-pattern.
        var distanceToPlayer = Math.sqrt(Math.pow(this.state["x"] - this.state["player"].x, 2) + Math.pow(this.state["y"] - this.state["player"].y, 2));
        var sightRadius = this.state["player"].sightRadius;
        
        // setState here causes infinite recursion
        // eslint-disable-next-line
        this.state["isVisible"] = (distanceToPlayer <= sightRadius);

        return (
            <div style={{background: "black", display: "inline", "color": this.getColour()}}>{this.getCharacter()}</div>
        );
    }

    getCharacter() {        
        var stateData = this.state["data"];       

        if (!this.state["isVisible"]) {
            if (stateData.discovered === true) {
                // Invisible but discovered: show wall/floor/etc
                return Tile.VALID_STATES_DISPLAY[stateData.type];
            } else {
                // Rendering a space here, doesn't render the element; &nbsp; doesn't render decoded either.
                // So, we render an arbitrary character; colour will hide it anyway.
                return '_'; 
            }
        } else {
            if (stateData.occupant != null) {
                return stateData.occupant.DISPLAY_CHARACTER;
            } else {
                return Tile.VALID_STATES_DISPLAY[stateData.type];
            }
        }
    }

    getColour() {
        var stateData = this.state["data"];

        if (this.state["isVisible"]) {
            if (stateData.occupant != null) {
                return stateData.occupant.BASE_COLOUR;
            } else {
                return Tile.TYPE_COLOURS[stateData.type];
            }
        } else {
            if (stateData.discovered === true) {
                // return based on floor/wall/etc
                return "#444";
            } else {
                return "black";
            }
        }
    }
}

// Valid contents, and what they display as
Tile.VALID_STATES_DISPLAY = {
    "floor": '.',
    "wall": '#'
}

Tile.TYPE_COLOURS = {
    "floor": "#888",
    "wall": "#bbb"
}

export default Tile;