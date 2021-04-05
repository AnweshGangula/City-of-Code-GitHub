import ghData from './github.js'

const TotalContr = ghData.data.user.contributionsCollection.contributionCalendar.totalContributions
const username = ghData.data.user.name
const boxHeight = TotalContr / 100

const contrCalender = ghData.data.user.contributionsCollection.contributionCalendar
let boxData = [];
let [x, y] = [0, 0]
contrCalender.weeks.forEach(week => {
    let arr = []
    week.contributionDays.forEach(day => {
        arr.push({ "Count": day.contributionCount, "x": x, "y": y })
        y++
    });
    boxData.push(arr)
    x++
    y = 0
});

let scene, camera, renderer, cube, cylinder, circle, text_mesh
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    // camera.position.z = 2;
    camera.position.set(1, 1, 2);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor("#e5e5e5");

    renderer.setSize(window.innerWidth * 0.95, window.innerHeight * 0.9);
    document.body.appendChild(renderer.domElement);

    geometry()


    lights()

    var loader = new THREE.FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {

        var text_material = new THREE.MeshNormalMaterial();

        let fMesh = getTextMesh(username, text_material, font)
        fMesh.position.x = 0;
        fMesh.position.y = 0.25;
        fMesh.position.z = 0.01;
        scene.add(fMesh);
    });


    var controls = new THREE.OrbitControls(camera, renderer.domElement);
}

function geometry() {

    const box = new THREE.BoxGeometry(1, 1, 1)
    const boxMat = new THREE.MeshNormalMaterial();
    cube = new THREE.Mesh(box, boxMat);
    scene.add(cube);

    cube.position.y = boxHeight / 2

    boxData.forEach(week => {
        week.forEach(box => {
            if (box.Count == 0) { return }

            const boxgh = new THREE.BoxGeometry(1, box.Count, 1)
            const boxghMat = new THREE.MeshNormalMaterial();
            let cubegh = new THREE.Mesh(boxgh, boxghMat);
            scene.add(cubegh);

            cubegh.position.y = box.Count / 2;
            cubegh.position.x = box.x;
            cubegh.position.z = box.y;
        });
    });
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
    var textgeometry = new THREE.TextBufferGeometry(
        text,
        {
            font: font,
            size: 0.2,
            height: 0.01,
            curveSegments: 2,
            // bevelEnabled: true,
            // bevelThickness: 0.01,
            // bevelSize: 0.01,
            // bevelOffset: 0,
            // bevelSegments: 1
        }
    );
    textgeometry.center();
    let Mesh = new THREE.Mesh(textgeometry, material);
    // wireframe
    var edges = new THREE.EdgesGeometry(Mesh.geometry); // or WireframeGeometry
    Mesh.add(edges);

    return Mesh;
};



function render_scene() {
    requestAnimationFrame(render_scene);
    renderer.render(scene, camera);

    // camera.lookAt(cube.position);
    animate();
};

function animate() {
    // let height = cube.geometry.parameters.height;
    if (cube.scale.y < 3) {
        cube.scale.y += 0.01;
        cube.position.y += 0.01 / 2
    }
    // cylinder.rotation.x += 0.01;
    cube.rotation.y += 0.001;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth * 0.95, window.innerHeight * 0.9);
};

window.addEventListener('resize', onWindowResize, false);

document.body.onmousemove = function (e) {
    cube.rotation.y = e.pageX / 500;
    // cube.rotation.x = e.pageY / 100;
};

init();
render_scene();
