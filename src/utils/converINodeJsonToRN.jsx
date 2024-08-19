import React from "react";
import { Svg, G, Path, Rect, Circle, Line } from "react-native-svg";

const convertINodeJsonToReactNative = (iNode) => {
    const { name, attributes, children } = iNode;

    const props = {}; 

    for (const key in attributes) {
        props[key] = attributes[key];
        if (key === "width") props[key] = "100%";
        if (key === "height") props[key] = "100%";
    }

    props["preserveAspectRatio"] = "none";

    switch (name) {
        case "svg":
            return (
                <Svg {...props}>
                    {children.map((child, index) =>
                        convertINodeJsonToReactNative(child)
                    )}
                </Svg>
            );
        case "g":
            return (
                <G {...attributes}>
                    {children.map((child, index) =>
                        convertINodeJsonToReactNative(child)
                    )}
                </G>
            );
        case "path":
            return <Path {...attributes} />;
        case "rect":
            return <Rect {...attributes} />;
        case "circle":
            return <Circle {...attributes} />;
        case "line":
            return <Line {...attributes} />;
        default:
            return null;
    }
};

export default convertINodeJsonToReactNative;


