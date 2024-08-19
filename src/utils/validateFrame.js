import Ajv from "ajv";

const ajv = new Ajv({ allErrors: true });

const childrenInnerProps = {
  type: ["array", "null"],
  items: {
    type: "object",
    properties: {
      height: { type: ["string", "number", "null"] },
      width: { type: ["string", "number", "null"] },
      heightValue: { type: ["string", "number", "null"] },
      widthValue: { type: ["string", "number", "null"] },
      dfModelIndex: { type: ["number", "null"] },
    },
    required: ["dfModelIndex"],
  },
};

const stackInnerProps = {
  type: ["array", "null"],
  items: {
    type: "object",
    properties: {
      name: {
        type: "string",
        enum: ["HWindow", "VWindow"],
      },
      props: {
        type: "object",
        properties: {
          equal: { type: "boolean" },
          heightValue: { type: ["number", "null"] },
          widthValue: { type: ["number", "null"] },
          height: { type: ["string", "number", "null"] },
          width: { type: ["string", "number", "null"] },
          length: { type: "number" },
        },
        required: ["length"],
      },
      childrenInnerProps,
    },
  },
};

const schema = {
  type: "object",
  properties: {
    name: { type: "string" },
    props: {
      type: "object",
      properties: {
        splitDirection: { type: "string", enum: ["h", "v"] },
        equal: { type: "boolean" },
        heightValue: { type: ["number", "null"], exclusiveMinimum: 300 },
        widthValue: { type: ["number", "null"], exclusiveMinimum: 300 },
        height: { type: ["number", "null", "string"] },
        width: { type: ["number", "null", "string"] },
        length: { type: "number" },
      },
      required: ["splitDirection", "equal", "length"],
    },
    stackInnerProps,
  },
  required: ["name", "props", "stackInnerProps"],
};

// Example JSON data

// Validate JSON data against the schema
export default function isValidJson(jsonData) {
  const isValid = ajv.validate(schema, jsonData);

  if (isValid) {
    console.log("JSON is valid according to the schema:", jsonData);
  } else {
    console.error("JSON is not valid:", ajv.errors);
  }
}
