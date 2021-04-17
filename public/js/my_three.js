// import ghData from "./github.js";
import * as data from './my GitHub contribution.js';
const ghData = data.default;
// console.log(ghData);

const TotalContr = ghData.data.user.contributionsCollection.contributionCalendar.totalContributions;
const username = ghData.data.user.name;
const contrCalender = ghData.data.user.contributionsCollection.contributionCalendar;

let boxData = [];
let [x, y] = [0, 0];
contrCalender.weeks.forEach(week => {
    let arr = [];
    week.contributionDays.forEach(day => {
        arr.push({ Count: day.contributionCount, x: x, y: y });
        y++;
    });
    boxData.push(arr);
    x++;
    y = 0;
});
const weekCount = boxData.length;
const dayCount = boxData[0].length;
const stagger = 0.05;

// -------- Three.js Start ---------

let scene, camera, renderer, cube, calenderGeom, baseGeometry, cylinder, circle, text_mesh, controls;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    // camera.position.z = 2;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor("#e5e5e5");

    renderer.setSize(window.innerWidth * 0.95, window.innerHeight * 0.9);
    document.body.appendChild(renderer.domElement);

    calenderGeometry();
    baseGeom();

    lights();

    //   calenderGeom.position.copy(intPosition.clone().add(new THREE.Vector3(0.5, 0.5, 0.5));
    let geomCenter = new THREE.Vector3();
    let geomLen = calenderGeom.children.length;
    geomCenter.addVectors(
        calenderGeom.children[0].position,
        calenderGeom.children[geomLen - 1].position
    );

    geomCenter.divideScalar(2);

    {   //another way to get center of geometry. But this doesn't consider if there's any missing geomemtry at the end.
        var box = new THREE.Box3().setFromObject(calenderGeom);
        var sizeX = box.getSize().x;
        var sizeY = box.getSize().y;
        var sizeZ = box.getSize().z;

        var center = new THREE.Vector3();
        // calenderGeom.computeBoundingBox();
        box.getCenter(center);
        // const geomCenter = box.getCenter 
    }

    usernameGeom();

    let cameraPos = new THREE.Vector3();
    cameraPos.addVectors(geomCenter, new THREE.Vector3(30, 20, 30));
    camera.position.copy(cameraPos);

    //   camera.lookAt has no effect when using OrbitControls: https://stackoverflow.com/a/45764133/6908282
    // camera.lookAt(geomCenter);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target = geomCenter;
    controls.update();
}

function calenderGeometry() {
    calenderGeom = new THREE.Group();

    let i = 0;
    boxData.forEach(week => {
        week.forEach(box => {
            if (box.Count == 0) {
                return;
            }

            const boxgh = new THREE.BoxGeometry(0.9, box.Count, 0.9);
            const boxghMat = new THREE.MeshNormalMaterial();
            let cubegh = new THREE.Mesh(boxgh, boxghMat);
            calenderGeom.add(cubegh);

            cubegh.position.y = -0.1;
            cubegh.position.x = box.x;
            cubegh.position.z = box.y;
            cubegh.scale.y = 0;

            gsap.to(cubegh.scale, { duration: 2, y: 1, ease: "back.out(1.7)", delay: stagger * i })
            gsap.to(cubegh.position, { duration: 2, y: box.Count / 2, ease: "back.out(1.7)", delay: stagger * i })
        });
        i++;
    });
    // console.log(calenderGeom);
    calenderGeom.position.z = 0.5; //the box center is at 0,0,0. So moving the geometry to 1/2 to make the corner point at 0,0,0

    scene.add(calenderGeom);
}

function baseGeom() {

    let geometry = new THREE.CylinderGeometry(1 / Math.sqrt(2), 1.05 / Math.sqrt(2), 1, 4, 1); // size of top can be changed
    const baseghMat = new THREE.MeshLambertMaterial();

    geometry.rotateY(Math.PI / 4);
    geometry = geometry.toNonIndexed(); // removes shared vertices
    geometry.computeVertexNormals(); // normals will be 'flat' normals

    baseGeometry = new THREE.Mesh(geometry, baseghMat);

    const baseHeight = 2
    baseGeometry.position.x = weekCount / 2;
    baseGeometry.position.y = -baseHeight / 2;
    baseGeometry.position.z = (dayCount / 2);
    baseGeometry.scale.set(weekCount * 1.05, baseHeight, dayCount * 1.3);

    scene.add(baseGeometry);

}

function usernameGeom() {
    var loader = new THREE.FontLoader();
    loader.load(
        "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
        function (font) {
            var text_material = new THREE.MeshToonMaterial();
            text_material.color = new THREE.Color(0xff0000);

            let fMesh = getTextMesh(username, text_material, font);
            fMesh.position.x = weekCount / 2;
            fMesh.position.y = -1;
            fMesh.position.z = dayCount * 1.3;

            fMesh.rotation.x = -Math.PI / 8;

            fMesh.scale.set(10, 10, 20);
            scene.add(fMesh);

        }
    );
}

function lights() {
    const color = 0xffffff;
    const intensity = 0.2;
    const light = new THREE.PointLight(color, intensity, 500);
    light.position.set(10, 0, 25);
    scene.add(light);

    const light2 = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    scene.add(light2);
}

function getTextMesh(text, material, font) {
    //Number
    var textgeometry = new THREE.TextBufferGeometry(text, {
        font: font,
        size: 0.2,
        height: 0.01,
        curveSegments: 2
        // bevelEnabled: true,
        // bevelThickness: 0.01,
        // bevelSize: 0.01,
        // bevelOffset: 0,
        // bevelSegments: 1
    });
    textgeometry.center();
    let Mesh = new THREE.Mesh(textgeometry, material);
    // wireframe
    var edges = new THREE.EdgesGeometry(Mesh.geometry); // or WireframeGeometry
    Mesh.add(edges);

    return Mesh;
}

function render_scene() {
    requestAnimationFrame(render_scene);
    renderer.render(scene, camera);

    //   camera.lookAt(calenderGeom.position);
    animate();
}

function animate() {

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth * 0.95, window.innerHeight * 0.9);
}

window.addEventListener("resize", onWindowResize, false);

document.body.onmousemove = function (e) {

};

init();
render_scene();
