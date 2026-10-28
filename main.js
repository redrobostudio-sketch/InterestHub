import * as THREE from 'https://unpkg.com/three@0.166.1/build/three.module.js';



//
// Scene
//
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202040);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
);

camera.position.set(0, 2, 10);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

document.body.appendChild(renderer.domElement);


function createSign(x, y, z, color) {

    const sign = new THREE.Mesh(
        new THREE.BoxGeometry(
            3,
            1,
            0.2
        ),
        new THREE.MeshStandardMaterial({
            color
        })
    );

    sign.position.set(
        x,
        y,
        z
    );

    scene.add(sign);

    return sign;
}

//
// Lighting
//

const ambient = new THREE.AmbientLight(
    0xffffff,
    2
);

scene.add(ambient);

//
// Main Hub Floor
//

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({
        color: 0x555555
    })
);

floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.1;

scene.add(floor);

//
// Wall Creator
//

function createWall(
    x,
    y,
    z,
    w,
    h,
    d,
    color
) {

    const wall = new THREE.Mesh(
        new THREE.BoxGeometry(
            w,
            h,
            d
        ),
        new THREE.MeshStandardMaterial({
            color
        })
    );

    wall.position.set(
        x,
        y,
        z
    );

    scene.add(wall);
}

//
// Portal Pillars
//

function createDoor(
    color,
    x
) {

    const door = new THREE.Mesh(
        new THREE.BoxGeometry(
            2,
            4,
            0.5
        ),
        new THREE.MeshStandardMaterial({
            color
        })
    );

    door.position.set(
        x,
        2,
        -10
    );

    scene.add(door);
}

createDoor(0xff8800, -12); // Helldivers
createSign(-12, 5, -10, 0xff8800);
createDoor(0x00ff00, -8);  // Books
createSign(-8, 5, -10, 0x00ff00);
createDoor(0x00ccff, -4);  // Music
createSign(-4, 5, -10, 0x00ccff);
createDoor(0xff00ff, 0);   // Projects
createSign(0, 5, -10, 0xff00ff);
createDoor(0xffff00, 4);   // Minecraft
createSign(4, 5, -10, 0xffff00);
createDoor(0xff4444, 8);   // Tech
createSign(8, 5, -10, 0xff4444);

//
// HELLDIVERS HALL
//

const hallFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(
        40,
        40
    ),
    new THREE.MeshStandardMaterial({
        color: 0xaa5500
    })
);

hallFloor.rotation.x = -Math.PI / 2;
hallFloor.position.z = -500;

scene.add(hallFloor);

//
// Hall Walls
//

createWall(
    0,
    6,
    -470,
    120,
    12,
    4,
    0x222222
);


createWall(
    0,
    4,
    -520,
    40,
    8,
    1,
    0x333333
);

createWall(
    -20,
    4,
    -500,
    1,
    8,
    40,
    0x333333
);

createWall(
    20,
    4,
    -500,
    1,
    8,
    40,
    0x333333
);

//
// SOLO SILO MONUMENT
//

const monumentBase = new THREE.Mesh(
    new THREE.CylinderGeometry(
        5, 5, 2, 32
    ),
    new THREE.MeshStandardMaterial({
        color: 0x555555
    })
);

monumentBase.position.set(
    0,
    1,
    -500
);

scene.add(monumentBase);

const monumentBody = new THREE.Mesh(
    new THREE.CylinderGeometry(
        1.5, 2, 10, 32
    ),
    new THREE.MeshStandardMaterial({
        color: 0x888888
    })
);

monumentBody.position.set(
    0,
    7,
    -500
);

scene.add(monumentBody);

const monumentTip = new THREE.Mesh(
    new THREE.ConeGeometry(
        1.5,
        4,
        32
    ),
    new THREE.MeshStandardMaterial({
        color: 0xaa0000
    })
);

monumentTip.position.set(
    0,
    14,
    -500
);

scene.add(monumentTip);


//
// Portals
//

const portals = [

    {
        name: "Helldivers",

        x: -12,
        z: -10,

        destination: {
            x: 0,
            y: 2,
            z: -490
        }
    }

];

let portalCooldown = 0;

function checkPortals() {

    if (portalCooldown > 0)
        return;

    portals.forEach(portal => {

        const dx =
            camera.position.x -
            portal.x;

        const dz =
            camera.position.z -
            portal.z;

        const distance =
            Math.sqrt(
                dx * dx +
                dz * dz
            );

        if (distance < 2) {

            camera.position.set(
                portal.destination.x,
                portal.destination.y,
                portal.destination.z
            );

            portalCooldown = 60;

            console.log(
                "Entered",
                portal.name
            );
        }

    });
}

//
// WASD Movement
//

const keys = {};

window.addEventListener(
    "keydown",
    (e) => {

        keys[
            e.key.toLowerCase()
        ] = true;
    }
);

window.addEventListener(
    "keyup",
    (e) => {

        keys[
            e.key.toLowerCase()
        ] = false;
    }
);

//
// Touch Look
//

let touchStartX = 0;
let touchStartY = 0;

let yaw = 0;
let pitch = 0;

window.addEventListener(
    "touchstart",
    (e) => {

        touchStartX =
            e.touches[0].clientX;

        touchStartY =
            e.touches[0].clientY;
    }
);

window.addEventListener(
    "touchmove",
    (e) => {

        const deltaX =
            e.touches[0].clientX -
            touchStartX;

        const deltaY =
            e.touches[0].clientY -
            touchStartY;

        yaw -= deltaX * 0.002;

        pitch -= deltaY * 0.002;

        // stop neck snapping 😆

        pitch = Math.max(
    -0.7,
    Math.min(
        0.7,
        pitch
    )
);


        camera.rotation.y =
            yaw;

        camera.rotation.x =
            pitch;

        touchStartX =
            e.touches[0].clientX;

        touchStartY =
            e.touches[0].clientY;
    }
);

//
// PC Controls Lock
//

let mouseDown = false;

window.addEventListener("mousedown", () => {
    mouseDown = true;
});

window.addEventListener("mouseup", () => {
    mouseDown = false;
});

window.addEventListener("mousemove", (e) => {

    if (!mouseDown) return;

    yaw -= e.movementX * 0.002;
    pitch -= e.movementY * 0.002;

    pitch = Math.max(
        -0.7,
        Math.min(
            0.7,
            pitch
        )
    );

    camera.rotation.y = yaw;
    camera.rotation.x = pitch;

});


//
// Main Loop
//

function animate() {

    requestAnimationFrame(
        animate
    );

    const speed = 0.15;

    if (keys["w"])
        camera.position.z -= speed;

    if (keys["s"])
        camera.position.z += speed;

    if (keys["a"])
        camera.position.x -= speed;

    if (keys["d"])
        camera.position.x += speed;

    checkPortals();

    if (portalCooldown > 0)
        portalCooldown--;

    renderer.render(
        scene,
        camera
    );
}

animate();

//
// Resize
//

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);
