// ================= ESCENA =================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505);

// ================= CAMARA =================
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0,2,6);

// ================= RENDER =================
const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

// ================= CONTROLES =================
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// ================= LUCES PRO =================
scene.add(new THREE.AmbientLight(0xffffff,0.4));

const light1 = new THREE.DirectionalLight(0xffffff,1);
light1.position.set(5,5,5);
scene.add(light1);

const light2 = new THREE.PointLight(0x00ffff,2,10);
light2.position.set(0,3,3);
scene.add(light2);

// ================= MATERIAL PRO =================
const material = new THREE.MeshPhysicalMaterial({
  color:0xffffff,
  roughness:0.1,
  metalness:0,
  transmission:0.3,
  thickness:0.5,
  clearcoat:1
});

// ================= BAYMAX =================
const baymax = new THREE.Group();
scene.add(baymax);

// cuerpo
const body = new THREE.Mesh(new THREE.SphereGeometry(1.4,64,64),material);
body.scale.y = 1.3;
baymax.add(body);

// cabeza
const head = new THREE.Mesh(new THREE.SphereGeometry(0.7,64,64),material);
head.position.y=2;
baymax.add(head);

// ojos
const eyeMat = new THREE.MeshBasicMaterial({color:0x000000});
const eye1 = new THREE.Mesh(new THREE.SphereGeometry(0.1,32,32),eyeMat);
eye1.position.set(-0.25,2,0.6);

const eye2 = new THREE.Mesh(new THREE.SphereGeometry(0.1,32,32),eyeMat);
eye2.position.set(0.25,2,0.6);

baymax.add(eye1,eye2);

// ================= ANIMACIONES =================
let time=0, waving=false, medical=false;

function animate(){
 requestAnimationFrame(animate);
 time+=0.03;

 // respirar
 let s=1+Math.sin(time)*0.03;
 baymax.scale.set(s,s,s);

 // emoción (color)
 if(medical) material.color.set(0x99ccff);
 else material.color.set(0xffffff);

 renderer.render(scene,camera);
}
animate();

// ================= VOZ =================
function speak(text){
 const msg = new SpeechSynthesisUtterance(text);
 msg.lang="es-ES";
 speechSynthesis.speak(msg);
}

// ================= RECONOCIMIENTO =================
function startListening(){
 const rec = new(window.SpeechRecognition || window.webkitSpeechRecognition)();
 rec.lang="es-ES";

 rec.onresult = (e)=>{
   let text = e.results[0][0].transcript.toLowerCase();
   document.getElementById("log").innerText="Escuché: "+text;

   if(text.includes("hola")){
     speak("Hola soy healthbot, tu asistente medico personal.");
   }

   if(text.includes("escanéame")){
     scanHealth();
   }

   if(text.includes("modo médico")){
     toggleMode();
   }
 };

 rec.start();
}

// ================= SALUDO =================
function waveHand(){
 speak("Hola soy healthbot, tu asistente medico personal.");
}

// ================= MODO =================
function toggleMode(){
 medical=!medical;
 speak(medical ? "Modo médico activado" : "Modo normal");
}

// ================= ESCANEO IA =================
function scanHealth(){
 let heart = Math.floor(Math.random()*40+60);
 let temp = (Math.random()*1.5+36).toFixed(1);

 let estado="Salud estable";
 let consejo="Todo parece estar bien.";

 if(heart>90){
   estado="Estrés";
   consejo="Te recomiendo respirar profundamente.";
}

 if(temp>37){
   estado="Posible fiebre";
   consejo="Debes descansar e hidratarte.";
}

 document.getElementById("resultados").innerHTML=`
 <p>❤️ ${heart} bpm</p>
 <p>🌡️ ${temp} °C</p>
 <p>📊 ${estado}</p>
 <p>💡 ${consejo}</p>
 `;

 speak("Escaneo completo. "+estado);
 speak(consejo);
}

