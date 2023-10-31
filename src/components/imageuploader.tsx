import { ImageUploaderState, defaultState } from "../types";
import React, { useState, useRef } from "react";
import Modal from "react-modal";
import Dropzone, { FileRejection, DropzoneState } from "react-dropzone";
import Webcam from "react-webcam";

Modal.setAppElement("#root");

type ImageUploaderProps = {};

const ImageUploader: React.FC<ImageUploaderProps> = () => {
  const [state1, setState1] = useState<ImageUploaderState>(defaultState);
  const webcamRef = useRef<Webcam | null>(null);
  const [state2, setState2] = useState<ImageUploaderState>(defaultState);
  const [isloading, setisLoading] = useState<boolean>(false);
  const onDrop = (
    acceptedFiles: File[],
    fileRejections: FileRejection[],
    isfirst: boolean
  ) => {
    if (isfirst) {
      if (fileRejections.length > 0) {
        alert("Please upload only one image.");
      } else if (acceptedFiles.length === 1) {
        const file = acceptedFiles[0];
        const imageUrl = URL.createObjectURL(file);
        setState1({ ...state1, image: imageUrl, modalIsOpen: false }); // Close the modal
      }
    } else {
      if (fileRejections.length > 0) {
        alert("Please upload only one image.");
      } else if (acceptedFiles.length === 1) {
        const file = acceptedFiles[0];
        const imageUrl = URL.createObjectURL(file);
        setState2({ ...state2, image: imageUrl, modalIsOpen: false }); // Close the modal
      }
    }
  };

  const captureImage = (isfirst: boolean) => {
    if (isfirst) {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot() as string;
        setState1({ ...state1, image: imageSrc, modalIsOpen: false }); // Close the modal
      }
    } else {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot() as string;
        setState2({ ...state2, image: imageSrc, modalIsOpen: false }); // Close the modal
      }
    }
  };

  const removeImage = (isfirst: boolean) => {
    if (isfirst) {
      setState1({ ...state1, image: null });
    } else {
      setState2({ ...state2, image: null });
    }
  };

  async function submitHandler() {
    setisLoading(true);
    const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");

    const data = await res.json();
    if (data) {
      setTimeout(() => {
        setisLoading(false);
      }, 2000);
    }
  }

  return (
    <div className="flex flex-col md:flex-col justify-center items-center">
      <h1 className="text-3xl font-bold m-4 text-center">Face Matcher</h1>
      <div>
        <div className="flex flex-col justify-center items-center md:flex-row md:flex md:justify-center md:items-center">
          {/* The first image upload */}
          <div className="mt-6 md:mb-0 mb-10">
            {!state1.image ? (
              <div className="w-[250px] h-[300px] md:w-[400px] md:h-[350px] justify-center m-4 flex flex-col items-center ">
                <div
                  className="md:w-[360px] md:h-[280px] w-[250px] h-[250px] my-4 md:mt-0 bg-gray-200 hover:border-2 border-black rounded-xl flex justify-center items-center"
                  onClick={() => setState1({ ...state1, modalIsOpen: true })}
                >
                  Upload Image
                </div>
                <button
                  className="w-40 bg-blue-400 h-10 m-2 rounded-xl hover:shadow-xl"
                  onClick={() => setState1({ ...state1, modalIsOpen: true })}
                >
                  Upload Image
                </button>
              </div>
            ) : (
              <div className="flex flex-col w-[250px] h-[300px] m-4 md:w-[400px] md:h-[350px] items-center">
                <img
                  className="md:w-[360px] md:h-[280px] w-[250px] h-[250px] rounded-lg my-4 md:mt-0"
                  src={state1.image}
                  alt="Uploaded"
                />
                <button
                  className=" w-40 bg-red-400 h-10 m-2 rounded-lg hover:shadow-xl"
                  onClick={() => {
                    removeImage(true);
                  }}
                >
                  Remove Image
                </button>
              </div>
            )}
            <Modal
              style={{
                overlay: {
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "auto",
                },
                content: {
                  width: "80%",
                  display: "flex",
                  flexWrap: "wrap",
                  flexDirection: "column",
                  margin: "auto",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "20px",
                },
              }}
              shouldCloseOnEsc
              isOpen={state1.modalIsOpen}
              onRequestClose={() =>
                setState1({ ...state1, modalIsOpen: false })
              }
              contentLabel="Upload Image Modal"
            >
              <div className="flex justify-end my-2">
                <button
                  className="mt-[-20px] mr-[-10px]"
                  onClick={() => setState1({ ...state1, modalIsOpen: false })}
                >
                  X
                </button>
              </div>
              <h1 className="text-center text-3xl font-bold">
                Upload an Image
              </h1>
              <div className="flex flex-row justify-around m-2">
                <label>
                  <input
                    type="radio"
                    name="source"
                    value="computer"
                    className="mx-2"
                    checked={state1.source === "computer"}
                    onChange={() =>
                      setState1({ ...state1, source: "computer" })
                    }
                  />
                  Upload from Computer
                </label>
                <label>
                  <input
                    className="mx-2"
                    type="radio"
                    name="source"
                    value="webcam"
                    checked={state1.source === "webcam"}
                    onChange={() => setState1({ ...state1, source: "webcam" })}
                  />
                  Capture with Webcam
                </label>
              </div>
              {state1.source === "computer" && (
                <Dropzone
                  onDrop={(acceptedFiles, fileRejections) => {
                    onDrop(acceptedFiles, fileRejections, true);
                  }}
                >
                  {({ getRootProps, getInputProps }: DropzoneState) => (
                    <div
                      {...getRootProps()}
                      className="dropzone flex h-[200px] md:h-[400px] w-full justify-center"
                    >
                      <input {...getInputProps()} accept="image/*" />
                      <p>Drag & drop an image here, or click to select one.</p>
                    </div>
                  )}
                </Dropzone>
              )}
              {state1.source === "webcam" && (
                <div className=" flex justify-center items-center flex-col">
                  <div className="w-[320px] h-[240px]">
                    <Webcam
                      audio={false}
                      ref={webcamRef as unknown as React.RefObject<Webcam>}
                      screenshotFormat="image/jpeg"
                    />
                  </div>
                  <button
                    className="top-6 relative w-40 h-10 bg-blue-400 rounded-xl"
                    onClick={() => {
                      captureImage(true);
                    }}
                  >
                    Capture Image
                  </button>
                </div>
              )}
            </Modal>
          </div>
          {/* the separator */}
          <div className="h-[2px] bg-black w-[300px] md:w-[2px] md:h-[350px]"></div>
          {/* the second upload */}
          <div className="mt-6 md:mb-0 mb-6">
            {!state2.image ? (
              <div className="w-[250px] h-[300px] md:w-[400px] md:h-[350px] justify-center m-4 flex flex-col items-center ">
                <div
                  className="md:w-[360px] md:h-[280px] w-[250px] h-[250px] my-4 md:mt-0 bg-gray-200 hover:border-2 border-black rounded-xl flex justify-center items-center"
                  onClick={() => setState2({ ...state2, modalIsOpen: true })}
                >
                  Upload Image
                </div>
                <button
                  className="w-40 bg-blue-400 h-10 m-2 rounded-xl hover:shadow-xl"
                  onClick={() => setState2({ ...state2, modalIsOpen: true })}
                >
                  Upload Image
                </button>
              </div>
            ) : (
              <div className="flex flex-col w-[250px] h-[300px] m-4 md:w-[400px] md:h-[350px] items-center">
                <img
                  className="md:w-[360px] md:h-[280px] w-[250px] h-[250px] rounded-lg my-4 md:mt-0"
                  src={state2.image}
                  alt="Uploaded"
                />
                <button
                  className=" w-40 bg-red-400 h-10 m-2 rounded-lg hover:shadow-xl"
                  onClick={() => {
                    removeImage(false);
                  }}
                >
                  Remove Image
                </button>
              </div>
            )}
            <Modal
              style={{
                overlay: {
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "auto",
                },
                content: {
                  width: "80%",
                  display: "flex",
                  flexWrap: "wrap",
                  flexDirection: "column",
                  margin: "auto",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "20px",
                },
              }}
              isOpen={state2.modalIsOpen}
              onRequestClose={() =>
                setState2({ ...state2, modalIsOpen: false })
              }
              contentLabel="Upload Image Modal"
            >
              <div className="flex justify-end my-2">
                <button
                  className="mt-[-20px] mr-[-10px]"
                  onClick={() => setState2({ ...state2, modalIsOpen: false })}
                >
                  X
                </button>
              </div>
              <h1 className="text-center text-3xl font-bold">
                Upload an Image
              </h1>
              <div className="flex flex-row justify-around m-2">
                <label>
                  <input
                    type="radio"
                    name="source"
                    value="computer"
                    className="mx-2"
                    checked={state2.source === "computer"}
                    onChange={() =>
                      setState2({ ...state2, source: "computer" })
                    }
                  />
                  Upload from Computer
                </label>
                <label>
                  <input
                    className="mx-2"
                    type="radio"
                    name="source"
                    value="webcam"
                    checked={state2.source === "webcam"}
                    onChange={() => setState2({ ...state2, source: "webcam" })}
                  />
                  Capture with Webcam
                </label>
              </div>
              {state2.source === "computer" && (
                <Dropzone
                  onDrop={(acceptedFiles, fileRejections) => {
                    onDrop(acceptedFiles, fileRejections, false);
                  }}
                >
                  {({ getRootProps, getInputProps }: DropzoneState) => (
                    <div
                      {...getRootProps()}
                      className="dropzone flex h-[200px] md:h-[400px] w-full justify-center"
                    >
                      <input {...getInputProps()} accept="image/*" />
                      <p>Drag & drop an image here, or click to select one.</p>
                    </div>
                  )}
                </Dropzone>
              )}
              {state2.source === "webcam" && (
                <div className=" flex justify-center items-center flex-col">
                  <div className="w-[320px] h-[240px]">
                    <Webcam
                      audio={false}
                      ref={webcamRef as unknown as React.RefObject<Webcam>}
                      screenshotFormat="image/jpeg"
                    />
                  </div>
                  <button
                    className="top-6 relative w-40 h-10 bg-blue-400 rounded-xl"
                    onClick={() => {
                      captureImage(false);
                    }}
                  >
                    Capture Image
                  </button>
                </div>
              )}
            </Modal>
          </div>
        </div>
      </div>
      <button
        className="bg-blue-300 w-40 h-10 rounded-xl hover:shadow-xl disabled:cursor-not-allowed disabled:bg-gray-300"
        disabled={isloading}
        onClick={() => {
          console.log(state1.image, state2.image);
          submitHandler();
        }}
      >
        {isloading ? (
          <div className="flex flex-row justify-center mx-auto">
            <div className="spinner mx-2"></div> Loading
          </div>
        ) : (
          "Submit"
        )}
      </button>
    </div>
  );
};

export default ImageUploader;
