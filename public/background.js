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
  const directionalLight = new THREE.DirectionalLight(0xffcc00, 0.3);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  
  // Create DNA helix
  const dnaGroup = new THREE.Group();
  scene.add(dnaGroup);
  
  // DNA parameters
  const helixRadius = 3;
  const helixHeight = 15;
  const helixTurns = 5;
  const helixPoints = 40;
  const sphereRadius = 0.15;
  
  // Create DNA strands
  const strand1Material = new THREE.MeshPhongMaterial({ 
    color: 0xffcc00, 
    shininess: 100,
    emissive: 0x332200,
    emissiveIntensity: 0.3
  });
  
  const strand2Material = new THREE.MeshPhongMaterial({ 
    color: 0xe6b800, 
    shininess: 100,
    emissive: 0x332200,
    emissiveIntensity: 0.3
  });
  
  const connectionMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x444444, 
    shininess: 30,
    transparent: true,
    opacity: 0.7
  });
  
  const sphereGeometry = new THREE.SphereGeometry(sphereRadius, 8, 8);
  const cylinderGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
  
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
    
    // Second strand (opposite side)
    const x2 = Math.cos(angle + Math.PI) * helixRadius;
    const z2 = Math.sin(angle + Math.PI) * helixRadius;
    
    const sphere2 = new THREE.Mesh(sphereGeometry, strand2Material);
    sphere2.position.set(x2, y, z2);
    dnaGroup.add(sphere2);
    
    // Add connections every few points
    if (i % 2 === 0 && i < helixPoints - 1) {
      // Create connection between strands
      const connection = new THREE.Mesh(cylinderGeometry, connectionMaterial);
      
      // Position at midpoint
      connection.position.set((x1 + x2) / 2, y, (z1 + z2) / 2);
      
      // Calculate rotation to point from one sphere to the other
      connection.lookAt(new THREE.Vector3(x2, y, z2));
      connection.rotateX(Math.PI / 2);
      
      // Scale to correct length
      const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(z2 - z1, 2));
      connection.scale.set(1, distance, 1);
      
      dnaGroup.add(connection);
    }
  }
  
  // Add floating medical symbols
  const symbols = [];
  
  // Create a cross
  function createCross(color) {
    const crossGroup = new THREE.Group();
    
    const verticalBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 1, 0.2),
      new THREE.MeshPhongMaterial({ 
        color: color,
        emissive: color,
        emissiveIntensity: 0.3
      })
    );
    crossGroup.add(verticalBar);
    
    const horizontalBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.2, 0.2),
      new THREE.MeshPhongMaterial({ 
        color: color,
        emissive: color,
        emissiveIntensity: 0.3
      })
    );
    crossGroup.add(horizontalBar);
    
    return crossGroup;
  }
  
  // Create a heart
  function createHeart(color) {
    const heartShape = new THREE.Shape();
    
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, -0.5, -1, -0.5, -1, 0);
    heartShape.bezierCurveTo(-1, 0.5, 0, 1, 0, 1.5);
    heartShape.bezierCurveTo(0, 1, 1, 0.5, 1, 0);
    heartShape.bezierCurveTo(1, -0.5, 0, -0.5, 0, 0);
    
    const geometry = new THREE.ExtrudeGeometry(heartShape, {
      depth: 0.2,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.1,
      bevelThickness: 0.1
    });
    
    const heart = new THREE.Mesh(
      geometry,
      new THREE.MeshPhongMaterial({ 
        color: color,
        emissive: color,
        emissiveIntensity: 0.3
      })
    );
    
    heart.scale.set(0.3, 0.3, 0.3);
    return heart;
  }
  
  // Add several symbols
  for (let i = 0; i < 10; i++) {
    let symbol;
    
    if (i % 2 === 0) {
      symbol = createCross(0xffcc00);
    } else {
      symbol = createHeart(0xffcc00);
      symbol.rotation.z = Math.PI;
    }
    
    // Random position
    symbol.position.set(
      (Math.random() - 0.5) * 15,
      (Math.random() - 0.5) * 15,
      (Math.random() - 0.5) * 15
    );
    
    // Random rotation
    symbol.rotation.x = Math.random() * Math.PI;
    symbol.rotation.y = Math.random() * Math.PI;
    
    // Random scale
    const scale = 0.5 + Math.random() * 0.5;
    symbol.scale.set(scale, scale, scale);
    
    scene.add(symbol);
    symbols.push({
      mesh: symbol,
      rotationSpeed: {
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.01
      },
      movementSpeed: {
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.01
      }
    });
  }
  
  // Add matrix-like falling particles
  const particlesCount = 1000;
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: 0xffcc00,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true
  });
  
  const positions = new Float32Array(particlesCount * 3);
  const velocities = new Float32Array(particlesCount);
  const sizes = new Float32Array(particlesCount);
  
  for (let i = 0; i < particlesCount; i++) {
    // Position
    positions[i * 3] = (Math.random() - 0.5) * 30;     // x
    positions[i * 3 + 1] = Math.random() * 30 - 15;    // y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30; // z
    
    // Velocity (falling speed)
    velocities[i] = 0.05 + Math.random() * 0.1;
    
    // Size variation
    sizes[i] = Math.random() * 2;
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);
  
  // Add background grid
  const gridSize = 30;
  const gridDivisions = 30;
  const gridMaterial = new THREE.LineBasicMaterial({ 
    color: 0x222222,
    transparent: true,
    opacity: 0.3
  });
  
  // Create horizontal grid
  const horizontalGrid = new THREE.GridHelper(gridSize, gridDivisions, 0x222222, 0x222222);
  horizontalGrid.position.y = -10;
  horizontalGrid.material = gridMaterial;
  scene.add(horizontalGrid);
  
  // Create vertical grid
  const verticalGrid = new THREE.GridHelper(gridSize, gridDivisions, 0x222222, 0x222222);
  verticalGrid.rotation.x = Math.PI / 2;
  verticalGrid.position.z = -10;
  verticalGrid.material = gridMaterial;
  scene.add(verticalGrid);
  
  // Position camera
  camera.position.z = 10;
  
  // Animation
  const animate = () => {
    requestAnimationFrame(animate);
    
    // Rotate DNA
    dnaGroup.rotation.y += 0.005;
    
    // Animate symbols
    symbols.forEach(symbol => {
      symbol.mesh.rotation.x += symbol.rotationSpeed.x;
      symbol.mesh.rotation.y += symbol.rotationSpeed.y;
      symbol.mesh.rotation.z += symbol.rotationSpeed.z;
      
      symbol.mesh.position.x += symbol.movementSpeed.x;
      symbol.mesh.position.y += symbol.movementSpeed.y;
      symbol.mesh.position.z += symbol.movementSpeed.z;
      
      // Boundary check and reverse direction if needed
      if (Math.abs(symbol.mesh.position.x) > 10) symbol.movementSpeed.x *= -1;
      if (Math.abs(symbol.mesh.position.y) > 10) symbol.movementSpeed.y *= -1;
      if (Math.abs(symbol.mesh.position.z) > 10) symbol.movementSpeed.z *= -1;
    });
    
    // Animate matrix particles
    const positions = particlesGeometry.attributes.position.array;
    
    for (let i = 0; i < particlesCount; i++) {
      // Update y position (falling effect)
      positions[i * 3 + 1] -= velocities[i];
      
      // Reset position when particle falls below the view
      if (positions[i * 3 + 1] < -15) {
        positions[i * 3 + 1] = 15;
        positions[i * 3] = (Math.random() - 0.5) * 30;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
      }
    }
    
    particlesGeometry.attributes.position.needsUpdate = true;
    
    // Rotate grids slowly
    horizontalGrid.rotation.z += 0.0005;
    verticalGrid.rotation.y += 0.0005;
    
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
    camera.position.x = mousePosition.x * 0.5;
    camera.position.y = mousePosition.y * 0.5;
    camera.lookAt(scene.position);
  });
}); 