var canvas = document.getElementById("logoRenderCanvas");

var startRenderLoop = function (engine, canvas) {
  engine.runRenderLoop(function () {
    if (sceneToRender && sceneToRender.activeCamera) {
      sceneToRender.render();
    }
  });
};

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function () {
  return new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false,
  });
};
var createScene = function () {
  var scene = new BABYLON.Scene(engine);
  // scene.clearColor = BABYLON.Color3.White();
  scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
  var light = new BABYLON.HemisphericLight(
    "light1",
    new BABYLON.Vector3(1, 1, 0),
    scene
  );
  light.intensity = 2;

  var camera = new BABYLON.ArcRotateCamera(
    "cam1",
    1.5,
    1.2,
    3.5,
    new BABYLON.Vector3(0, 0, 0),
    scene
  );

  camera.attachControl();
  camera.inputs.remove(camera.inputs.attached.mousewheel);

  // scene.environmentTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("/textures/environment.dds", scene);

  var sphere = BABYLON.MeshBuilder.CreateSphere(
    "sphere",
    { diameter: 0.01 },
    scene
  );

  camera.target = sphere;

  sphere.position.y = 0.3;
  sphere.position.x = 0.1;
  sphere.position.z = -0.2;
  sphere.material = new BABYLON.StandardMaterial("mat1", scene);
  sphere.material.diffuseColor = new BABYLON.Color3.Black();

  var pbr = new BABYLON.PBRMaterial("pbr", scene);
  // sphere.material = pbr;
  const hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
    "assets/textures/hdr_texture.hdr",
    scene
  );
  pbr.reflectionTexture = hdrTexture;
  pbr.metallic = 0.0;
  pbr.roughness = 0;

  pbr.subSurface.isTranslucencyEnabled = true;
  var pbr2 = new BABYLON.PBRMaterial("pbr2", scene);
  // sphere.material = pbr;
  // pbr2.reflectionTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("/textures/environment.dds", scene);
  pbr2.reflectionTexture = hdrTexture;

  pbr2.metallic = 0.3;
  pbr2.roughness = 0.6;
  // pbr2.albedoColor = new BABYLON.Color3(0.56, 0, 1);
  pbr2.albedoColor = new BABYLON.Color3.Teal();
  pbr2.subSurface.isTranslucencyEnabled = true;
  var logo;
  BABYLON.SceneLoader.ImportMesh(
    "",
    "assets/models/",
    "groupedlogo.glb",
    scene,
    function (meshes) {
      logo = meshes[0];
      console.log({ logo });
      // Scale the logo
      const scale = 1.2;
      logo.scaling = new BABYLON.Vector3(scale, scale, scale); // Adjust the scale as needed

      // Position and rotate the logo if necessary
      logo.position = new BABYLON.Vector3(0, 0, 0);

      // camera.target = logo;
      // logo.rotation = new BABYLON.Vector3(0, 0, 0);
      logo.getChildMeshes().forEach((element, idx) => {
        const darkMatMeshes = [0, 6, 7, 8]; // Meshes with dark blue color
        if (!darkMatMeshes.includes(idx) && idx < 9) {
          element.material = pbr2;
          console.log(idx, element.material);
        }
      });
    }
  );

  var fact = 3500; // density
  var scaleX = 0.0;
  var scaleY = 0.0;
  var scaleZ = 0.0;
  var grey = 0.0;
  // custom position function
  var myPositionFunction = function (particle, i, s) {
    scaleX = Math.random() * 2 + 0.8;
    scaleY = Math.random() + 0.8;
    scaleZ = Math.random() * 2 + 0.8;
    particle.scale.x = scaleX;
    particle.scale.y = scaleY;
    particle.scale.z = scaleZ;
    particle.position.x = (Math.random() - 0.5) * fact;
    particle.position.y = (Math.random() - 0.5) * fact;
    particle.position.z = (Math.random() - 0.5) * fact;
    particle.rotation.x = Math.random() * 3.5;
    particle.rotation.y = Math.random() * 3.5;
    particle.rotation.z = Math.random() * 3.5;
    grey = 1.0 - Math.random() * 0.3;
    particle.color = new BABYLON.Color4(grey, grey, grey, 1);
  };

  var myVertexFunction = function (particle, vertex, i) {
    vertex.x *= Math.random() + 1;
    vertex.y *= Math.random() + 1;
    vertex.z *= Math.random() + 1;
  };

  var SPS = new BABYLON.SolidParticleSystem("SPS", scene, { updatable: false });
  // SPS.addShape(sphere, 1, {
  //   positionFunction: myPositionFunction,
  //   vertexFunction: myVertexFunction,
  // });
  // var mesh = SPS.buildMesh();
  // mesh.material = pbr;
  // sphere.dispose();

  // camera.target = logo;
  // scene.createDefaultCamera(true, true, true);
  var k = Date.now();
  var a = 0;
  scene.registerBeforeRender(function () {
    // pl.position = camera.position;
    // SPS.mesh.rotation.y += 0.005;
    // SPS.mesh.rotation.x = 0.1;
    // SPS.mesh.position.y = Math.sin((k - Date.now()) / 1000) * 2;
    if (logo) {
      logo.position = new BABYLON.Vector3(
        0,
        Math.sin((k - Date.now()) / 1000) * 0.1,
        0
      );
      logo.rotation = new BABYLON.Vector3(0, k, 0);
    }
    k += 0.009;

    a += 0.005;

    var colorValue = (Math.sin(a) + 1) * 0.5; // Value between 0 and 1
    var interpolatedColor = BABYLON.Color3.Lerp(
      new BABYLON.Color3(0.29, 0.62, 0.57),
      new BABYLON.Color3(0.93, 0.74, 0.74),
      colorValue
    );
    pbr.albedoColor = interpolatedColor;
  });

  // scene.createDefaultSkybox(scene.environmentTexture);

  return scene;
};
window.initFunction = async function () {
  var asyncEngineCreation = async function () {
    try {
      return createDefaultEngine();
    } catch (e) {
      console.log(
        "the available createEngine function failed. Creating the default engine instead"
      );
      return createDefaultEngine();
    }
  };

  window.engine = await asyncEngineCreation();
  if (!engine) throw "engine should not be null.";
  startRenderLoop(engine, canvas);
  window.scene = createScene();
};
initFunction().then(() => {
  sceneToRender = scene;
});

// Resize
window.addEventListener("resize", function () {
  engine.resize();
});
