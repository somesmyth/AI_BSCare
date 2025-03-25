document.addEventListener('DOMContentLoaded', () => {
  // Three.js setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  document.body.insertBefore(renderer.domElement, document.body.firstChild);
  
  // Style the canvas
  renderer.domElement.style.position = 'fixed';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.left = '0';
  renderer.domElement.style.zIndex = '-1';
  
  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0x222222);
  scene.add(ambientLight);
  
  // Add directional light
  const directionalLight = new THREE.DirectionalLight(0xffcc00, 0.5);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  
  // Create a network of connected nodes representing a health network
  const networkGroup = new THREE.Group();
  scene.add(networkGroup);
  
  // Node parameters
  const nodeCount = 50;
  const nodePositions = [];
  const nodes = [];
  const connections = [];
  const maxDistance = 5; // Maximum distance for connections
  
  // Create nodes
  const nodeMaterial = new THREE.MeshPhongMaterial({
    color: 0xffcc00,
    emissive: 0x332200,
    emissiveIntensity: 0.3,
    shininess: 100
  });
  
  const nodeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
  
  for (let i = 0; i < nodeCount; i++) {
    // Create random position within a sphere
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const radius = 5 + Math.random() * 5;
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    
    const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
    node.position.set(x, y, z);
    
    // Store position for connection calculations
    nodePositions.push({ x, y, z });
    nodes.push(node);
    networkGroup.add(node);
  }
  
  // Create connections between nearby nodes
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xffcc00,
    transparent: true,
    opacity: 0.3
  });
  
  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      const dx = nodePositions[i].x - nodePositions[j].x;
      const dy = nodePositions[i].y - nodePositions[j].y;
      const dz = nodePositions[i].z - nodePositions[j].z;
      
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      
      if (distance < maxDistance) {
        const geometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(nodePositions[i].x, nodePositions[i].y, nodePositions[i].z),
          new THREE.Vector3(nodePositions[j].x, nodePositions[j].y, nodePositions[j].z)
        ]);
        
        const line = new THREE.Line(geometry, lineMaterial);
        connections.push({
          line,
          startNode: i,
          endNode: j,
          pulsePosition: 0,
          pulseSpeed: 0.02 + Math.random() * 0.03,
          active: Math.random() > 0.7 // Only some connections are active initially
        });
        
        networkGroup.add(line);
      }
    }
  }
  
  // Create pulsing data particles that travel along connections
  const pulseGeometry = new THREE.SphereGeometry(0.05, 8, 8);
  const pulseMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    emissive: 0xffcc00,
    emissiveIntensity: 0.7,
    transparent: true,
    opacity: 0.8
  });
  
  const pulses = [];
  
  // Create floating health icons
  const iconGroup = new THREE.Group();
  scene.add(iconGroup);
  
  // Create a heart icon
  function createHeartIcon() {
    const heartShape = new THREE.Shape();
    
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, -0.5, -1, -0.5, -1, 0);
    heartShape.bezierCurveTo(-1, 0.5, 0, 1, 0, 1.5);
    heartShape.bezierCurveTo(0, 1, 1, 0.5, 1, 0);
    heartShape.bezierCurveTo(1, -0.5, 0, -0.5, 0, 0);
    
    const extrudeSettings = {
      depth: 0.2,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.1,
      bevelThickness: 0.1
    };
    
    const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    const material = new THREE.MeshPhongMaterial({
      color: 0xff3366,
      emissive: 0x661122,
      emissiveIntensity: 0.5,
      shininess: 100
    });
    
    const heart = new THREE.Mesh(geometry, material);
    heart.scale.set(0.3, 0.3, 0.3);
    
    return heart;
  }
  
  // Create a DNA icon
  function createDNAIcon() {
    const dnaGroup = new THREE.Group();
    
    const helixRadius = 0.5;
    const helixHeight = 1.5;
    const helixTurns = 2;
    const helixPoints = 20;
    
    const strand1Material = new THREE.MeshPhongMaterial({
      color: 0xffcc00,
      emissive: 0x332200,
      emissiveIntensity: 0.3
    });
    
    const strand2Material = new THREE.MeshPhongMaterial({
      color: 0x00ccff,
      emissive: 0x002233,
      emissiveIntensity: 0.3
    });
    
    const sphereGeometry = new THREE.SphereGeometry(0.08, 8, 8);
    
    for (let i = 0; i < helixPoints; i++) {
      const t = i / helixPoints;
      const angle = t * Math.PI * 2 * helixTurns;
      const y = (t - 0.5) * helixHeight;
      
      // First strand
      const x1 = Math.cos(angle) * helixRadius;
      const z1 = Math.sin(angle) * helixRadius;
      
      const sphere1 = new THREE.Mesh(sphereGeometry, strand1Material);
      sphere1.position.set(x1, y, z1);
      dnaGroup.add(sphere1);
      
      // Second strand
      const x2 = Math.cos(angle + Math.PI) * helixRadius;
      const z2 = Math.sin(angle + Math.PI) * helixRadius;
      
      const sphere2 = new THREE.Mesh(sphereGeometry, strand2Material);
      sphere2.position.set(x2, y, z2);
      dnaGroup.add(sphere2);
    }
    
    return dnaGroup;
  }
  
  // Create a pill icon
  function createPillIcon() {
    const pillGroup = new THREE.Group();
    
    // Pill body
    const geometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 16);
    geometry.rotateX(Math.PI / 2);
    
    // Round the ends
    const sphereGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    
    const material1 = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      emissive: 0x333333,
      emissiveIntensity: 0.2
    });
    
    const material2 = new THREE.MeshPhongMaterial({
      color: 0x00ccff,
      emissive: 0x002233,
      emissiveIntensity: 0.3
    });
    
    const cylinder = new THREE.Mesh(geometry, material1);
    pillGroup.add(cylinder);
    
    const sphere1 = new THREE.Mesh(sphereGeometry, material1);
    sphere1.position.set(0, 0, 0.5);
    pillGroup.add(sphere1);
    
    const sphere2 = new THREE.Mesh(sphereGeometry, material2);
    sphere2.position.set(0, 0, -0.5);
    pillGroup.add(sphere2);
    
    return pillGroup;
  }
  
  // Add icons to the scene
  const icons = [];
  const iconTypes = [createHeartIcon, createDNAIcon, createPillIcon];
  
  for (let i = 0; i < 10; i++) {
    const createIcon = iconTypes[Math.floor(Math.random() * iconTypes.length)];
    const icon = createIcon();
    
    // Position randomly in a larger sphere
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const radius = 8 + Math.random() * 7;
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    
    icon.position.set(x, y, z);
    icon.rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    );
    
    iconGroup.add(icon);
    
    icons.push({
      mesh: icon,
      rotationSpeed: {
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.01
      },
      movementSpeed: {
        x: (Math.random() - 0.5) * 0.005,
        y: (Math.random() - 0.5) * 0.005,
        z: (Math.random() - 0.5) * 0.005
      }
    });
  }
  
  // Add background stars
  const starsGeometry = new THREE.BufferGeometry();
  const starsCount = 1000;
  
  const positions = new Float32Array(starsCount * 3);
  const sizes = new Float32Array(starsCount);
  
  for (let i = 0; i < starsCount; i++) {
    // Position stars in a sphere around the scene
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const radius = 30 + Math.random() * 20;
    
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
    
    // Vary star sizes
    sizes[i] = Math.random() * 2;
  }
  
  starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starsGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  
  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.05,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true
  });
  
  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);
  
  // Position camera
  camera.position.z = 15;
  
  // Animation
  let frame = 0;
  const animate = () => {
    requestAnimationFrame(animate);
    frame++;
    
    // Rotate the entire network
    networkGroup.rotation.y += 0.002;
    networkGroup.rotation.x += 0.001;
    
    // Animate nodes (subtle pulsing)
    nodes.forEach((node, i) => {
      const scale = 1 + 0.1 * Math.sin(frame * 0.05 + i);
      node.scale.set(scale, scale, scale);
    });
    
    // Animate connections and create pulses
    connections.forEach((connection, i) => {
      if (connection.active) {
        connection.pulsePosition += connection.pulseSpeed;
        
        // Reset pulse and randomly deactivate
        if (connection.pulsePosition > 1) {
          connection.pulsePosition = 0;
          connection.active = Math.random() > 0.3; // 70% chance to remain active
        }
        
        // Create new pulse at the start of the path
        if (connection.pulsePosition < 0.1 && Math.random() > 0.7 && pulses.length < 100) {
          const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
          
          const startNode = nodePositions[connection.startNode];
          const endNode = nodePositions[connection.endNode];
          
          pulse.position.set(startNode.x, startNode.y, startNode.z);
          
          pulses.push({
            mesh: pulse,
            connection: connection,
            progress: 0,
            speed: connection.pulseSpeed * 1.5
          });
          
          networkGroup.add(pulse);
        }
      } else if (Math.random() > 0.99) {
        // Randomly activate inactive connections
        connection.active = true;
        connection.pulsePosition = 0;
      }
    });
    
    // Animate pulses
    for (let i = pulses.length - 1; i >= 0; i--) {
      const pulse = pulses[i];
      pulse.progress += pulse.speed;
      
      if (pulse.progress >= 1) {
        // Remove pulse when it reaches the end
        networkGroup.remove(pulse.mesh);
        pulses.splice(i, 1);
      } else {
        // Move pulse along the connection
        const startNode = nodePositions[pulse.connection.startNode];
        const endNode = nodePositions[pulse.connection.endNode];
        
        pulse.mesh.position.x = startNode.x + (endNode.x - startNode.x) * pulse.progress;
        pulse.mesh.position.y = startNode.y + (endNode.y - startNode.y) * pulse.progress;
        pulse.mesh.position.z = startNode.z + (endNode.z - startNode.z) * pulse.progress;
      }
    }
    
    // Animate icons
    icons.forEach(icon => {
      icon.mesh.rotation.x += icon.rotationSpeed.x;
      icon.mesh.rotation.y += icon.rotationSpeed.y;
      icon.mesh.rotation.z += icon.rotationSpeed.z;
      
      icon.mesh.position.x += icon.movementSpeed.x;
      icon.mesh.position.y += icon.movementSpeed.y;
      icon.mesh.position.z += icon.movementSpeed.z;
      
      // Boundary check and reverse direction if needed
      if (Math.abs(icon.mesh.position.x) > 15) icon.movementSpeed.x *= -1;
      if (Math.abs(icon.mesh.position.y) > 15) icon.movementSpeed.y *= -1;
      if (Math.abs(icon.mesh.position.z) > 15) icon.movementSpeed.z *= -1;
    });
    
    // Rotate stars slightly
    stars.rotation.y += 0.0001;
    
    renderer.render(scene, camera);
  };
  
  animate();
  
  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  
  // Add mouse interaction
  const mousePosition = new THREE.Vector2();
  
  window.addEventListener('mousemove', (event) => {
    mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Subtle camera movement based on mouse position
    camera.position.x = mousePosition.x * 2;
    camera.position.y = mousePosition.y * 2;
    camera.lookAt(scene.position);
  });
}); 