import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
} from "@babylonjs/core";

import { WebXRDefaultExperience } from "@babylonjs/core/XR";

async function startXR() {
  // Get the canvas element
  const canvas = document.getElementById("renderCanvas");

  // Create the Babylon.js engine
  const engine = new Engine(canvas, true);

  // Create a new scene
  const scene = new Scene(engine);

  // Set up WebXR experience
  const xr = await WebXRDefaultExperience.CreateAsync(scene, {
    uiOptions: {
      sessionMode: "immersive-ar", // Use AR session mode
    },
    optionalFeatures: ["hit-test", "dom-overlay"], // Optional features for AR
  });

  // Add a camera to the scene
  const camera = new ArcRotateCamera(
    "camera",
    Math.PI / 2,
    Math.PI / 2,
    2,
    Vector3.Zero(),
    scene
  );
  camera.attachControl(canvas, true);

  // Add a light source
  const light = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

  // Create a box (cube) and add it to the scene
  const box = MeshBuilder.CreateBox("box", { size: 0.5 }, scene);

  // Position the box in front of the user
  xr.baseExperience.sessionManager.onXRFrameObservable.add(() => {
    const xrCamera = xr.baseExperience.camera;
    box.position = xrCamera.position.add(
      xrCamera.getForwardRay().direction.scale(1)
    );
  });

  // Function to update the scene on each frame
  engine.runRenderLoop(() => {
    box.rotation.y += 0.01; // Rotate the box
    scene.render();
  });

  // Handle window resize events
  window.addEventListener("resize", function () {
    engine.resize();
  });
}

// Start the XR experience
startXR();
