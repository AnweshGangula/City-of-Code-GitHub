// reference: https://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/
const Cloud = function () {
    // Create an empty container that will hold the different parts of the cloud
    this.mesh = new THREE.Object3D();

    // create a cube geometry;
    // this shape will be duplicated to create the cloud
    var geom = new THREE.BoxGeometry(1, 1, 1);

    // create a material; a simple white material will do the trick
    var mat = new THREE.MeshPhongMaterial({
        color: 0xd8d0d1,
        opacity: Math.random()*0.8,
        transparent: true,
    });

    // duplicate the geometry a random number of times
    var nBlocs = 3 + Math.floor(Math.random() * 3);
    for (var i = 0; i < nBlocs; i++) {

        // create the mesh by cloning the geometry
        var m = new THREE.Mesh(geom, mat);

        // set the position and the rotation of each cube randomly
        m.position.x = i * 0.7;
        m.position.y = 2 + Math.random() * 1;
        m.position.z = Math.random() * 1;
        m.rotation.z = Math.random() * Math.PI * 2;
        m.rotation.y = Math.random() * Math.PI * 2;

        // set the size of the cube randomly
        var s = .1 + Math.random() * .9;
        m.scale.set(s, s, s);

        // allow each cube to cast and to receive shadows
        m.castShadow = true;
        m.receiveShadow = true;

        // add the cube to the container we first created
        this.mesh.add(m);
    }
    this.mesh.scale.set(0)
    const stagger = 0.05;
    gsap.to(this.mesh.scale, { duration: 2, x: 1, y: 1, z: 1, ease: "back.out(1.7)", delay: stagger * i })
}

export default Cloud;