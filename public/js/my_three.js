import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";

// import ghData from "./github.js";
import cloud from "./cloud.js"

// Toggle comment below to switch between GitHub API and static json data
import getContributions from "./github.js";
// let ghData = await getContributions("AnweshGangula")
import * as data from './my GitHub contribution.js';
const ghData = data.default;
// console.log(ghData);

const TotalContr = ghData.data.user.contributionsCollection.contributionCalendar.totalContributions;
const username = ghData.data.user.name;

let boxData = [];
let maxContr

function getCalenderData() {
    boxData = [];
    let [x, y] = [0, 0];
    const contrCalender = ghData.data.user.contributionsCollection.contributionCalendar;
    contrCalender.weeks.forEach(week => {
        let arr = [];
        week.contributionDays.forEach(day => {
            arr.push({ Count: day.contributionCount, date: day.date, x: x, y: y });
            y++;
        });
        boxData.push(arr);
        x++;
        y = 0;
    });

    const flatData = boxData.flat();
    const arrCount = [];
    flatData.forEach(key => {
        arrCount.push(key.Count);
    })
    maxContr = Math.max(...arrCount);
}
getCalenderData();

// console.log(maxContr)
const weekCount = boxData.length;
const dayCount = boxData[0].length;
const stagger = 0.05;

// -------- Three.js Start ---------

let scene, camera, renderer, cube, calenderGeom, baseGeometry, cylinder, circle, text_mesh, controls, raycaster, INTERSECTED, intersectedPoint, Clouds;
const pointer = new THREE.Vector2();

function init() {
    scene = new THREE.Scene();
    // change scene background color: https://stackoverflow.com/a/16177178/6908282
    // scene.background = new THREE.Color( 0xffffff );
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    // camera.position.z = 2;

    // Transparent background: https://stackoverflow.com/a/31636198/6908282
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("canvas").appendChild(renderer.domElement);

    raycaster = new THREE.Raycaster();
    document.addEventListener('mousemove', onPointerMove);
    document.addEventListener('click', onClick);

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
    cloudGeom();

    let cameraPos = new THREE.Vector3();
    cameraPos.addVectors(geomCenter, new THREE.Vector3(30, 20, 30));
    camera.position.copy(cameraPos);

    let camLookat = new THREE.Vector3();
    camLookat.addVectors(geomCenter, new THREE.Vector3(5, 10, 0))
    // //   camera.lookAt has no effect when using OrbitControls: https://stackoverflow.com/a/45764133/6908282
    // camera.lookAt(camLookat);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target = camLookat;
    controls.update();

    // console.log(scene);
}

function onPointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;


    // find intersections

    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects(scene.children[0].children);

    if (intersects.length > 0) {

        if (INTERSECTED != intersects[0].object) {

            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex(0xff0000);
            INTERSECTED.currOpacity = INTERSECTED.material.opacity;
            // INTERSECTED.material.opacity = 1;
            // console.log(intersects[ 0 ]);

            // intersectedPoint = intersects[0].point
            // controls.target = intersectedPoint ;
        }

    } else {

        if (INTERSECTED) {
            INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
            // INTERSECTED.material.opacity = INTERSECTED.currOpacity;

        };

        INTERSECTED = null;

    }


    let tooltip = document.getElementById("tooltip");
    if (INTERSECTED) {
        tooltip.innerHTML = `<p><b>Date</b>: ${INTERSECTED.name}</p><p><b>Contribution Count</b>: ${INTERSECTED.userData.Count}</p>`;
        tooltip.style.opacity = 1;
        tooltip.style.left = event.clientX + "px";
        tooltip.style.top = event.clientY - 45 + "px";
    } else {
        tooltip.style.opacity = 0;
    }

}

function onClick(event) {

}

function calenderGeometry() {
    calenderGeom = new THREE.Group();
    calenderGeom.name = "calenderGeometry";

    let i = 0;
    boxData.forEach(week => {
        week.forEach(box => {
            if (box.Count == 0) {
                return;
            }

            const boxgh = new THREE.BoxGeometry(0.9, box.Count, 0.9);
            boxgh.applyMatrix4(new THREE.Matrix4().makeTranslation(0.5, box.Count / 2, 0.5));
            const boxghMat = new THREE.MeshStandardMaterial({
                color: 0x00966a,
                flatShading: true,
                transparent: true,
                metalness: 0.2,
                emissive: 0x000000,
                opacity: 0.8
            });


            let cubegh = new THREE.Mesh(boxgh, boxghMat);
            cubegh.name = box.date;
            cubegh.userData = { Count: box.Count }
            calenderGeom.add(cubegh);

            //             // wireframe
            //             const edges = new THREE.EdgesGeometry( cubegh.geometry );
            //             const lineMaterial = new THREE.LineBasicMaterial( {
            //             color: 0xff00ff,
            //             transparent : true,
            //             linewidth: 1,
            //             opacity : 0.5,
            //             linecap: 'round', //ignored by WebGLRenderer
            //             linejoin:  'round' //ignored by WebGLRenderer
            //           } );
            //             let line = new THREE.LineSegments( edges, lineMaterial );
            //             // line.material.depthTest = false;
            //             line.position.x = - 4;
            //             line.position.y = -0.1;
            //             line.position.x = box.x;
            //             line.position.z = box.y;
            //             line.scale.y = 0;
            //             calenderGeom.add( line );
            //             gsap.to(line.scale, { duration: 2, y: 1, ease: "back.out(1.7)", delay: stagger * i});

            cubegh.position.y = -0.1;
            cubegh.position.x = box.x;
            cubegh.position.z = box.y;
            cubegh.scale.y = 0;

            gsap.to(cubegh.scale, { duration: 2, y: 1, ease: "expo.out(1.7)", delay: stagger * i + 1 });

            // gsap.to(cubegh.position, { duration: 2, y: box.Count / 2, ease: "back.out(1.7)", delay: stagger * i })
        });
        i++;
    });
    // console.log(calenderGeom);
    // calenderGeom.position.z = 0.5; //the box center is at 0,0,0. So moving the geometry to 1/2 to make the corner point at 0,0,0

    scene.add(calenderGeom);
}

document.querySelector('#submit_button').addEventListener('click', Update_CalGeom)

async function Update_CalGeom() {
    // window.alert("ABC");
    scene.remove(calenderGeom);
    scene.remove(Clouds)
    var user_input = document.getElementById('user_input').value
    ghData = await getContributions(user_input)

    getCalenderData();
    calenderGeometry();
    cloudGeom();

}

function baseGeom() {

    let geometry = new THREE.CylinderGeometry(1 / Math.sqrt(2), 1.05 / Math.sqrt(2), 1, 4, 1); // size of top can be changed
    const baseghMat = new THREE.MeshStandardMaterial({
        color: 0xb5b5b5,
        // flatShading : true,
        // transparent: true,
        metalness: 0.2,
        emissive: 0xffffff,
        emissiveIntensity: 0.05,
        roughness: 0.1
        // opacity: 0.8
    });

    geometry.rotateY(Math.PI / 4);
    // geometry = geometry.toNonIndexed(); // removes shared vertices
    geometry.computeVertexNormals(); // normals will be 'flat' normals

    baseGeometry = new THREE.Mesh(geometry, baseghMat);

    const baseHeight = 2
    baseGeometry.position.x = weekCount / 2;
    baseGeometry.position.y = -baseHeight / 2;
    baseGeometry.position.z = (dayCount / 2);
    baseGeometry.scale.set(weekCount * 1.05, baseHeight, dayCount * 1.3);

    scene.add(baseGeometry);

}

function cloudGeom() {
    Clouds = new THREE.Group();
    Clouds.name = "cloudsGeometry";
    for (let i = 0; i < 7; i++) {
        const c = new cloud();
        c.mesh.position.x = 7 * i + Math.random() * 10;
        c.mesh.position.y = maxContr * 0.8 + Math.random() * 5;
        c.mesh.position.z = Math.random() * 7;
        Clouds.add(c.mesh);
    }
    scene.add(Clouds);
    console.log(Clouds)
    // console.log(Clouds);
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
    const intensity = 0.9;
    const light = new THREE.PointLight(color, intensity, 500);
    light.position.set(10, 0, 25);
    scene.add(light);

    const light2 = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.8);
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
    // var edges = new THREE.EdgesGeometry(Mesh.geometry); // or WireframeGeometry
    // Mesh.add(edges);

    return Mesh;
}

function render_scene() {
    requestAnimationFrame(render_scene);
    renderer.render(scene, camera);

    //   camera.lookAt(calenderGeom.position);
    animate();
}

function animate() {

    Clouds.children.forEach(cloud => {
        let cloudRects = cloud.children
        cloudRects.forEach(rect => {
            rect.rotation.x += Math.random() * 0.01;
        });
        if (cloud.position.x <= 2) {
            gsap.to(cloud.scale, { duration: 3, x: 0, y: 0, z: 0, ease: "back.out(1.7)" });
            gsap.to(cloud.position, { duration: 1, x: 50, z: Math.random() * 7, ease: "back.out(1.7)", delay: 3 });
        }
        if (cloud.position.x >= 50) {
            gsap.to(cloud.scale, { duration: 3, x: 1, y: 1, z: 1, ease: "back.out(1.7)" });
        }
        cloud.position.x -= cloudRects.length * 0.002;
    })

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize, false);

document.body.onmousemove = function (e) {

};

init();
render_scene();
