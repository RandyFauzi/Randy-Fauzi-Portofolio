/**
 * ============================================================================
 * RANDY 3D INTERACTIVE RUBIK'S CUBE — HERO EMBED ENGINE
 * Pure WebGL PBR + Clearcoat Shader with Transparent Canvas
 * 6 Unique Custom-Designed Sides ("RANDY", Cyber, Mecha, Arcade, Crown, Neon)
 * ============================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
  const glCanvas = document.getElementById('heroCubeCanvas');
  const pCanvas  = document.getElementById('heroParticleCanvas');
  if (!glCanvas || !pCanvas) return;

  const gl = glCanvas.getContext('webgl', { antialias: true, alpha: true, depth: true, premultipliedAlpha: false });
  if (!gl) return;
  const pCtx = pCanvas.getContext('2d');
  gl.getExtension('OES_standard_derivatives');

  // ==========================================================================
  // 1. 6-SIDED PROCEDURAL TEXTURE ATLAS ("RANDY" + PIXEL ART)
  // ==========================================================================
  function createStickerAtlasTexture() {
    const size = 2048;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#124be0';
    ctx.fillRect(0, 0, size, size);

    const faceSize = 648;
    const pad = 20;

    const C_BLUE    = '#1554f0';
    const C_YELLOW  = '#e5ce00';
    const C_BLACK   = '#0d0f0a';
    const C_WHITE   = '#eef2f6';
    const C_OLIVE   = '#CDEA68'; // Matches Ochi Lime Green Accent!
    const C_ORANGE  = '#ff551a';
    const C_RED     = '#e6192e';
    const C_CYAN    = '#00d8ff';
    const C_MAGENTA = '#ff2a85';

    function drawSticker9x9(fx, fy, sCol, sRow, rows9, palette) {
      const sSize = faceSize / 3;
      const cell = sSize / 9;
      const ox = fx + sCol * sSize;
      const oy = fy + sRow * sSize;
      for (let r = 0; r < 9; r++) {
        const rowStr = rows9[r];
        for (let c = 0; c < 9; c++) {
          const ch = rowStr[c] || '.';
          ctx.fillStyle = palette[ch] || C_BLACK;
          ctx.fillRect(ox + c * cell, oy + r * cell, cell + 0.5, cell + 0.5);
        }
      }
    }

    // SIDE 1 (+Z FRONT): Wprime Yellow & Black Stepped Pyramids + "RANDY"
    {
      const fx = pad, fy = pad;
      const pal = { 'Y': C_YELLOW, 'B': C_BLACK, 'W': C_WHITE };
      drawSticker9x9(fx, fy, 0, 0, [
        "YYYYYYYYY","YBBBBBBYY","YBBYYYBBY","YBBYYYBBY","YBBBBBBYY","YBBYBBYYY","YBBYYBBYY","YBBYYYBBY","YYYYYYYYY"
      ], pal);
      drawSticker9x9(fx, fy, 1, 0, [
        "YYYYYYYYY","YYBBBBBYY","YBBYYYBBY","YBBYYYBBY","YBBBBBBBY","YBBYYYBBY","YBBYYYBBY","YBBYYYBBY","YYYYYYYYY"
      ], pal);
      drawSticker9x9(fx, fy, 2, 0, [
        "YYYYYYYYY","YBBYYYBBY","YBBBYYBBY","YBBBBYBBY","YBBYBBBBY","YBBYYBBBY","YBBYYYBBY","YBBYYYBBY","YYYYYYYYY"
      ], pal);
      drawSticker9x9(fx, fy, 0, 1, [
        "YYYYYYYYY","YBBBBBBYY","YBBYYYBBY","YBBYYYBBY","YBBYYYBBY","YBBYYYBBY","YBBYYYBBY","YBBBBBBYY","YYYYYYYYY"
      ], pal);
      drawSticker9x9(fx, fy, 1, 1, [
        "BBBBBBBBB","BYYBBYBYY","BYYBBYBYY","BBYYYYYBB","BBBYYYBBB","BBBYYYBBB","BBBYYYBBB","BBBYYYBBB","BBBBBBBBB"
      ], pal);
      drawSticker9x9(fx, fy, 2, 1, [
        "YYYYYYYYY","YYYYBYYYY","YYYBBBYYY","YYBBBBBYY","YBBBBBBBY","BBBBBBBBB","BBBBBBBBB","YBBBBBBBY","YYYYYYYYY"
      ], pal);
      drawSticker9x9(fx, fy, 0, 2, [
        "YYYYYYYYY","YYBBBBBYY","YBBBBBBBY","BBBBYYBBB","BBBYBYBBB","BBBBYYBBB","YBBBBBBBY","YYBBBBBYY","YYYYYYYYY"
      ], pal);
      drawSticker9x9(fx, fy, 1, 2, [
        "YYYYYYYYY","YBBBBBBBY","BBBBBBBBB","BBBBBBBBB","BBBBBBBBB","YBBBBBBBY","YYBBBBBYY","YYYBBBYYY","YYYYYYYYY"
      ], pal);
      drawSticker9x9(fx, fy, 2, 2, [
        "YYYYYYYYY","YYYYBBBYY","YYYBBBBBY","YYBBBBBBB","YBBBBBBBB","YYBBBBBBB","YYYBBBBBY","YYYYBBBYY","YYYYYYYYY"
      ], pal);
    }

    // SIDE 2 (-Z BACK): Cobalt Blue & White Pixel Matrix + Lightning 44
    {
      const fx = pad + (faceSize + pad), fy = pad;
      const pal = { 'U': C_BLUE, 'W': C_WHITE, 'B': C_BLACK };
      drawSticker9x9(fx, fy, 0, 0, [
        "UUUUUUUUU","UWWWWWWUU","UWWUUUWWU","UWWUUUWWU","UWWWWWWUU","UWWUWWUUU","UWWUUWWUU","UWWUUUWWU","UUUUUUUUU"
      ], pal);
      drawSticker9x9(fx, fy, 1, 0, [
        "UUUUUUUUU","UUUUUUUUU","UUWWWWWUU","UWWWWWWWU","WWWWWWWWW","WWWWWWWWW","UWWWWWWWU","UUUUUUUUU","UUUUUUUUU"
      ], pal);
      drawSticker9x9(fx, fy, 2, 0, [
        "UUUUUUUUU","UWWUUUWWU","UWWUUUWWU","UUWWUWWUU","UUUWWWUUU","UUUWWWUUU","UUUWWWUUU","UUUWWWUUU","UUUUUUUUU"
      ], pal);
      drawSticker9x9(fx, fy, 0, 1, [
        "UUUUUUUUU","UUWWWWWUU","UWWUUUWWU","UWWUUUWWU","UUWWWWWWU","UUUUUUWWU","UWWUUUWWU","UUWWWWWUU","UUUUUUUUU"
      ], pal);
      drawSticker9x9(fx, fy, 1, 1, [
        "WWWWWWWWW","WWWWWWWWW","WWWWWWWWW","WWWWWWWWW","WWWWWWWWW","WWWWWWWWW","WWUUWWUUW","WWUUWWUUW","WWWWWWWWW"
      ], pal);
      drawSticker9x9(fx, fy, 2, 1, [
        "UUUUUUUUU","UUUUUWWWW","UUUUWWWWW","UUUWWWWWW","UUWWWWWWW","UWWWWWWWW","WWWWWWWWW","WWWWWWWWW","UUUUUUUUU"
      ], pal);
      drawSticker9x9(fx, fy, 0, 2, [
        "UUUUUUUUU","UUWWUUWWU","UWWUUWWUU","UWWWWWWWW","UUUWWUUWW","UUWWUUWWU","UWWUUWWUU","UUUUUUUUU","UUUUUUUUU"
      ], pal);
      drawSticker9x9(fx, fy, 1, 2, [
        "WWWWWWWWW","WWWWBWWWW","WWWWBWWWW","WWBBBBBWW","WWWWBWWWW","WWWWBWWWW","WWWWWWWWW","BBBBBBBBB","BBBBBBBBB"
      ], pal);
      drawSticker9x9(fx, fy, 2, 2, [
        "BBBBBBBBB","BBBBBBBBB","BBWWWWWBB","BWWWWWWWB","WWWWWWWWW","UUUUUUUUU","UUUUUUUUU","UUUUUUUUU","UUUUUUUUU"
      ], pal);
    }

    // SIDE 3 (+X RIGHT): Mecha Industrial Orange, Black & White
    {
      const fx = pad + 2 * (faceSize + pad), fy = pad;
      const pal = { 'O': C_ORANGE, 'B': C_BLACK, 'W': C_WHITE, 'A': C_ORANGE };
      drawSticker9x9(fx, fy, 0, 0, [
        "OOOOOOOOO","OBBBBBBOO","OBBWWWBBO","OBBWWWBBO","OBBBBBBOO","OBBOBBOOO","OBBOOBBOO","OBBOOOBBO","OOOOOOOOO"
      ], pal);
      drawSticker9x9(fx, fy, 1, 0, [
        "BBBBBBBBB","BOOOOOOOB","BOBBBBBOB","BOBWWWBOB","BOBWAWBOB","BOBWWWBOB","BOBBBBBOB","BOOOOOOOB","BBBBBBBBB"
      ], pal);
      drawSticker9x9(fx, fy, 2, 0, [
        "OOOOOOOOO","OBBWWWBBO","OBBBWWBBO","OBBBBWBBO","OBBWBBBBO","OBBWWBBBO","OBBWWWBBO","OBBWWWBBO","OOOOOOOOO"
      ], pal);
      drawSticker9x9(fx, fy, 0, 1, [
        "WWWWWWWWW","WBBBBBBBW","WBOOOOOBW","WBOBBBOBW","WBOBOBOBW","WBOBBBOBW","WBOOOOOBW","WBBBBBBBW","WWWWWWWWW"
      ], pal);
      drawSticker9x9(fx, fy, 1, 1, [
        "OOOOOOOOO","OBWWBWWBO","OBWWBWWBO","OOBWWWBOO","OOOBBBOOO","OOOBBBOOO","OOOBBBOOO","OOOBBBOOO","OOOOOOOOO"
      ], pal);
      drawSticker9x9(fx, fy, 2, 1, [
        "WWWWWWWWW","WWWWBWWWW","WWWWBWWWW","WWWWBWWWW","WBBBBBBBW","WWWWBWWWW","WWWWBWWWW","WWWWBWWWW","WWWWWWWWW"
      ], pal);
      drawSticker9x9(fx, fy, 0, 2, [
        "BBBBBBBBB","BWWBBBBBB","BWWWWBBBB","BWWWWWWBB","BOOOOOOOO","BWWWWWWBB","BWWWWBBBB","BWWBBBBBB","BBBBBBBBB"
      ], pal);
      drawSticker9x9(fx, fy, 1, 2, [
        "OOOOOOOOO","OBBBOOBBO","OOBBBOOBB","OOOBBBOOB","BOOBBBOOO","BBOOBBBOO","BBBOOBBBO","OBBBOOBBO","OOOOOOOOO"
      ], pal);
      drawSticker9x9(fx, fy, 2, 2, [
        "BBBBBBBBB","BBBBBBWWB","BBBBWWWWB","BBWWWWWWB","OOOOOOOOO","BBWWWWWWB","BBBBWWWWB","BBBBBBWWB","BBBBBBBBB"
      ], pal);
    }

    // SIDE 4 (-X LEFT): Retro Arcade Pixel Art
    {
      const fx = pad, fy = pad + (faceSize + pad);
      const pal = { 'R': C_RED, 'B': C_BLACK, 'W': C_WHITE, 'Y': C_YELLOW, 'C': C_CYAN };
      drawSticker9x9(fx, fy, 0, 0, [
        "BBBBBBBBB","BBRRRRRBB","BRRRRRRRB","BRWWRWWRB","BRRRRRRRB","BBRRYRRBB","BRRBBBRRB","BBRBBRBRB","BBBBBBBBB"
      ], pal);
      drawSticker9x9(fx, fy, 1, 0, [
        "RRRRRRRRR","RWWWWWWWR","RWBBBBBWR","RWBYYYWBR","RWBYRYWBR","RWBYYYWBR","RWBBBBBWR","RWWWWWWWR","RRRRRRRRR"
      ], pal);
      drawSticker9x9(fx, fy, 2, 0, [
        "BBBBBBBBB","BYYBBBYYB","YYYYBYYYY","YYYYYYYYY","YYYYYYYYY","BYYYYYYYB","BBYYYYYBB","BBBYYYBBB","BBBBYBBBB"
      ], pal);
      drawSticker9x9(fx, fy, 0, 1, [
        "RRRRRRRRR","RBBBBBBBR","RBWWWWBBR","RBWBBWBBR","RBWWWWBBR","RBWBBWBRR","RBWBBWWBR","RBBBBBBBR","RRRRRRRRR"
      ], pal);
      drawSticker9x9(fx, fy, 1, 1, [
        "BBBBBBBBB","BYYYYYYYB","BYRRRRRYB","BYRWWWRYB","BYRWYWRYB","BYRWWWRYB","BYRRRRRYB","BYYYYYYYB","BBBBBBBBB"
      ], pal);
      drawSticker9x9(fx, fy, 2, 1, [
        "RRRRRRRRR","RBBBBBBBR","RBWBBBWBR","RBWBBBWBR","RBBWWWBRR","RBBBWBBBR","RBBBWBBBR","RBBBBBBBR","RRRRRRRRR"
      ], pal);
      drawSticker9x9(fx, fy, 0, 2, [
        "WWWWWWWWW","WBBBBBBBW","WBRRRRRBW","WBRWWWRBW","WBRWRWRBW","WBRWWWRBW","WBRRRRRBW","WBBBBBBBW","WWWWWWWWW"
      ], pal);
      drawSticker9x9(fx, fy, 1, 2, [
        "RRRRRRRRR","RYYYYYYYR","RYBYYYBYR","RYBYYYBYR","RYYYYYYYR","RYBYYYBYR","RYYBBBYYR","RYYYYYYYR","RRRRRRRRR"
      ], pal);
      drawSticker9x9(fx, fy, 2, 2, [
        "WWWWWWWWW","WBBBBBBBW","WBCCCCCBW","WBCBBBCBW","WBCBYBCBW","WBCBBBCBW","WBCCCCCBW","WBBBBBBBW","WWWWWWWWW"
      ], pal);
    }

    // SIDE 5 (+Y TOP): Ochi Lime Green, White & Black Crown Architecture
    {
      const fx = pad + (faceSize + pad), fy = pad + (faceSize + pad);
      const pal = { 'O': C_OLIVE, 'B': C_BLACK, 'W': C_WHITE, 'U': C_BLUE, 'Y': C_YELLOW };
      drawSticker9x9(fx, fy, 0, 0, [
        "WWWWWWWWW","WWWWWWWWW","WWUUUUUWW","WUUUUUUUW","UUUUUUUUU","UUUUUUUUU","UUUUUUUUU","UUUUUUUUU","UUUUUUUUU"
      ], pal);
      drawSticker9x9(fx, fy, 1, 0, [
        "OOOOOOOOO","OOBBBBBOO","OBBBBBBBO","BBBBBBBBB","BBBBWBBBB","BBBWWBBBB","BBBBBBBBB","WWWWWWWWW","WWWWWWWWW"
      ], pal);
      drawSticker9x9(fx, fy, 2, 0, [
        "WWWWWWWWW","WWWWWWWWW","WWWWBBBBB","WWWBBBBBB","WWBBBBBBB","WBBBBBBBB","BBBBBBBBB","BBBBBBBBB","BBBBBBBBB"
      ], pal);
      drawSticker9x9(fx, fy, 0, 1, [
        "OOOOOOOOO","OBBBBBBOO","OBBWWWBBO","OBBWWWBBO","OBBBBBBOO","OBBOBBOOO","OBBOOBBOO","OBBOOOBBO","OOOOOOOOO"
      ], pal);
      drawSticker9x9(fx, fy, 1, 1, [
        "BBBBBBBBB","BYYBYYBYY","BYYYYYYYB","BYYYYYYYB","BYBBYBBYB","BYYYYYYYB","BWWWWWWWB","BBBBBBBBB","BBBBBBBBB"
      ], pal);
      drawSticker9x9(fx, fy, 2, 1, [
        "OOOOOOOOO","OBBOOOBBO","OBBOOOBBO","OOBBOBBOO","OOOBBBOOO","OOOBBBOOO","OOOBBBOOO","OOOBBBOOO","OOOOOOOOO"
      ], pal);
      drawSticker9x9(fx, fy, 0, 2, [
        "BBBBBBBBB","BBBBBBBBB","BBBBBBWWW","BBBBBWWWW","BBBBWWWWW","BBBWWWWWW","BBWWWWWWW","WWWWWWWWW","WWWWWWWWW"
      ], pal);
      drawSticker9x9(fx, fy, 1, 2, [
        "WWWWWWWWW","WWWWWWWWW","WWBBBBBWW","WBBBBBBBW","BBBBBBBBB","BBBBBBBBB","OOOOOOOOO","OOOOOOOOO","OOOOOOOOO"
      ], pal);
      drawSticker9x9(fx, fy, 2, 2, [
        "OOOOOOOOO","OOOOOOOOO","OOBBBBBOO","OBBBBBBBO","BBBBBBBBB","BBBBBBBBB","WWWWWWWWW","WWWWWWWWW","WWWWWWWWW"
      ], pal);
    }

    // SIDE 6 (-Y BOTTOM): Cyber-Neon Synthwave Matrix
    {
      const fx = pad + 2 * (faceSize + pad), fy = pad + (faceSize + pad);
      const pal = { 'B': C_BLACK, 'C': C_CYAN, 'M': C_MAGENTA, 'Y': C_YELLOW, 'W': C_WHITE, 'D': C_CYAN };
      drawSticker9x9(fx, fy, 0, 0, [
        "BBBBBBBBB","BCCCCCCBB","BCCBBBCCB","BCCBBBCCB","BCCCCCCBB","BCCBCCBBB","BCCBBCCBB","BCCBBBCCB","BBBBBBBBB"
      ], pal);
      drawSticker9x9(fx, fy, 1, 0, [
        "BBBBBBBBB","BBMMMMMBB","BMMBBBMMB","BMMBBBMMB","BMMMMMMMB","BMMBBBMMB","BMMBBBMMB","BMMBBBMMB","BBBBBBBBB"
      ], pal);
      drawSticker9x9(fx, fy, 2, 0, [
        "BBBBBBBBB","BCCBBBCCB","BCCCBBCCB","BCCCCBCCB","BCCBCCCCB","BCCBBCCCB","BCCBBBCCB","BCCBBBCCB","BBBBBBBBB"
      ], pal);
      drawSticker9x9(fx, fy, 0, 1, [
        "BBBBBBBBB","BMMMMMMBB","BMMBBBMMB","BMMBBBMMB","BMMBBBMMB","BMMBBBMMB","BMMBBBMMB","BMMMMMMBB","BBBBBBBBB"
      ], pal);
      drawSticker9x9(fx, fy, 1, 1, [
        "CCCCCCCCC","CBBBBBBBC","CBYYBYYBC","CBYYBYYBC","CBBYYYBBC","CBBBYYBBC","CBBBYYBBC","CBBBBBBBC","CCCCCCCCC"
      ], pal);
      drawSticker9x9(fx, fy, 2, 1, [
        "BBBBBBBBB","BMMMMMMMB","BMCCCCCBM","BMCBBBCBM","BMCBYBCBM","BMCBBBCBM","BMCCCCCBM","BMMMMMMMB","BBBBBBBBB"
      ], pal);
      drawSticker9x9(fx, fy, 0, 2, [
        "BBBBBBBBB","BCCCCCCCB","BCBBBBBCB","BCBMMMBCD","BCBMWMBCB","BCBMMMBCD","BCBBBBBCB","BCCCCCCCB","BBBBBBBBB"
      ], pal);
      drawSticker9x9(fx, fy, 1, 2, [
        "BBBBBBBBB","BYYYBYYYB","BYYYBYYYB","BBBBBBBBB","BYYYBYYYB","BYYYBYYYB","BBBBBBBBB","BMMMMMMMB","BBBBBBBBB"
      ], pal);
      drawSticker9x9(fx, fy, 2, 2, [
        "BBBBBBBBB","BCCCCCCCB","BCBBBBBCB","BCBYYYBCB","BCBYWYBCB","BCBYYYBCB","BCBBBBBCB","BCCCCCCCB","BBBBBBBBB"
      ], pal);
    }

    for (let f = 0; f < 6; f++) {
      const fCol = f % 3, fRow = Math.floor(f / 3);
      const fx = pad + fCol * (faceSize + pad), fy = pad + fRow * (faceSize + pad);
      const sSize = faceSize / 3;
      for (let sr = 0; sr < 3; sr++) {
        for (let sc = 0; sc < 3; sc++) {
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.18)';
          ctx.lineWidth = 4;
          ctx.strokeRect(fx + sc * sSize + 2, fy + sr * sSize + 2, sSize - 4, sSize - 4);
        }
      }
    }

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    return { tex, faceSize, pad, atlasSize: size };
  }

  const atlasInfo = createStickerAtlasTexture();

  // ==========================================================================
  // 2. WEBGL PBR SHADERS
  // ==========================================================================
  const vsSource = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec2 aUV;
    attribute float aMaterialId;

    uniform mat4 uProjection;
    uniform mat4 uView;
    uniform mat4 uWorld;
    uniform mat4 uCubieMatrix;

    varying vec3 vWorldPos;
    varying vec3 vNormal;
    varying vec2 vUV;
    varying float vMatId;
    varying vec3 vLocalPos;

    void main() {
      vec4 cubiePos = uCubieMatrix * vec4(aPosition, 1.0);
      vec4 worldPos = uWorld * cubiePos;
      vWorldPos = worldPos.xyz;
      vLocalPos = aPosition;

      mat3 normalMat = mat3(uWorld * uCubieMatrix);
      vNormal = normalize(normalMat * aNormal);
      vUV = aUV;
      vMatId = aMaterialId;

      gl_Position = uProjection * uView * worldPos;
    }
  `;

  const fsSource = `
    #extension GL_OES_standard_derivatives : enable
    precision highp float;

    varying vec3 vWorldPos;
    varying vec3 vNormal;
    varying vec2 vUV;
    varying float vMatId;
    varying vec3 vLocalPos;

    uniform sampler2D uAtlas;
    uniform vec3 uCameraPos;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
        f.y
      );
    }

    float distributionGGX(vec3 N, vec3 H, float roughness) {
      float a = roughness * roughness;
      float a2 = a * a;
      float NdotH = max(dot(N, H), 0.0);
      float NdotH2 = NdotH * NdotH;
      float denom = (NdotH2 * (a2 - 1.0) + 1.0);
      denom = 3.14159265 * denom * denom;
      return a2 / max(denom, 0.0001);
    }

    float geometrySchlickGGX(float NdotV, float roughness) {
      float r = (roughness + 1.0);
      float k = (r * r) / 8.0;
      return NdotV / (NdotV * (1.0 - k) + k);
    }

    vec3 sampleStudioEnv(vec3 R, float roughness) {
      float up = R.y * 0.5 + 0.5;
      vec3 sky = mix(vec3(0.45, 0.48, 0.34), vec3(0.90, 0.94, 1.0), smoothstep(0.2, 0.9, up));

      vec3 box1Dir = normalize(vec3(-0.6, 0.75, 0.5));
      float box1 = smoothstep(0.82 - roughness * 0.3, 0.96, dot(R, box1Dir));

      vec3 box2Dir = normalize(vec3(0.85, 0.25, 0.45));
      float box2 = smoothstep(0.86 - roughness * 0.3, 0.98, dot(R, box2Dir));

      vec3 box3Dir = normalize(vec3(0.0, -0.85, 0.4));
      float box3 = smoothstep(0.80, 0.96, dot(R, box3Dir)) * 0.45;

      return sky * 0.45 + vec3(1.0, 0.99, 0.95) * (box1 * 1.9 + box2 * 1.5 + box3);
    }

    void main() {
      vec3 N = normalize(vNormal);
      vec3 V = normalize(uCameraPos - vWorldPos);
      if (dot(N, V) < 0.0) N = -N;

      vec3 plasticColor = vec3(0.055, 0.26, 0.94);
      vec3 baseColor = plasticColor;
      float microGrain = noise(vUV * 360.0);

      if (vMatId > 1.5) {
        float gridPattern = step(0.12, fract(vUV.x * 6.0)) * step(0.12, fract(vUV.y * 6.0));
        baseColor = mix(vec3(0.04, 0.14, 0.55), vec3(0.08, 0.09, 0.12), gridPattern);
      } else if (vMatId > 0.5) {
        vec4 texSample = texture2D(uAtlas, vUV);
        baseColor = texSample.rgb;
        float luma = dot(baseColor, vec3(0.299, 0.587, 0.114));
        float dLx = dFdx(luma);
        float dLy = dFdy(luma);
        N = normalize(N + vec3(dLx, dLy, 0.0) * 1.45);
      } else {
        N = normalize(N + (microGrain - 0.5) * 0.015);
      }

      float uGloss = 0.94;
      float roughness = mix(0.36, 0.06, uGloss);
      if (vMatId > 0.5 && vMatId < 1.5) {
        roughness = mix(0.38, 0.09, uGloss) + microGrain * 0.02;
      }

      vec3 L1 = normalize(vec3(-0.75, 0.8, 0.6));
      vec3 L2 = normalize(vec3(0.85, -0.25, 0.55));
      vec3 L3 = normalize(vec3(-0.3, -0.8, -0.6));

      vec3 lightColors[3];
      lightColors[0] = vec3(1.0, 0.98, 0.94) * 2.25;
      lightColors[1] = vec3(0.75, 0.85, 1.0) * 1.4;
      lightColors[2] = vec3(0.80, 0.91, 0.40) * 0.85;

      vec3 lights[3];
      lights[0] = L1;
      lights[1] = L2;
      lights[2] = L3;

      vec3 Lo = vec3(0.0);
      float NdotV = max(dot(N, V), 0.001);

      vec3 F0 = vec3(0.048);
      vec3 F = F0 + (1.0 - F0) * pow(1.0 - NdotV, 5.0);

      for (int i = 0; i < 3; i++) {
        vec3 L = lights[i];
        vec3 H = normalize(V + L);
        float NdotL = max(dot(N, L), 0.0);

        vec3 diffuse = baseColor / 3.14159265;
        if (vMatId < 0.5) {
          float wrap = max(0.0, (dot(N, L) + 0.3) / 1.3);
          diffuse = baseColor * wrap * 0.48;
        }

        float D = distributionGGX(N, H, roughness);
        float G = geometrySchlickGGX(NdotV, roughness) * geometrySchlickGGX(max(dot(N, L), 0.001), roughness);
        vec3 spec = (D * G * F) / max(4.0 * NdotV * NdotL, 0.001);

        float D_coat = distributionGGX(N, H, 0.045);
        vec3 specCoat = D_coat * F * 0.38 * uGloss;

        Lo += (diffuse * (1.0 - F) + spec + specCoat) * lightColors[i] * NdotL;
      }

      vec3 R = reflect(-V, N);
      vec3 envLight = sampleStudioEnv(R, roughness);

      vec3 absLocal = abs(vLocalPos);
      float edgeDist = max(max(absLocal.x, absLocal.y), absLocal.z);
      float seamAO = smoothstep(0.495, 0.42, edgeDist) * 0.25 + 0.75;

      vec3 ambient = baseColor * vec3(0.62, 0.65, 0.58) * 0.78 * seamAO;
      vec3 color = ambient + Lo + envLight * F * uGloss * 0.92;

      if (vMatId < 0.5) {
        float rim = pow(1.0 - NdotV, 3.2);
        color += vec3(0.24, 0.52, 1.0) * rim * 0.42;
      }

      color = (color * (2.51 * color + 0.03)) / (color * (2.43 * color + 0.59) + 0.14);
      color = pow(clamp(color, 0.0, 1.0), vec3(1.0 / 2.15));

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  function compileShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  const prog = gl.createProgram();
  gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, vsSource));
  gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, fsSource));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const loc = {
    aPosition: gl.getAttribLocation(prog, 'aPosition'),
    aNormal: gl.getAttribLocation(prog, 'aNormal'),
    aUV: gl.getAttribLocation(prog, 'aUV'),
    aMaterialId: gl.getAttribLocation(prog, 'aMaterialId'),
    uProjection: gl.getUniformLocation(prog, 'uProjection'),
    uView: gl.getUniformLocation(prog, 'uView'),
    uWorld: gl.getUniformLocation(prog, 'uWorld'),
    uCubieMatrix: gl.getUniformLocation(prog, 'uCubieMatrix'),
    uAtlas: gl.getUniformLocation(prog, 'uAtlas'),
    uCameraPos: gl.getUniformLocation(prog, 'uCameraPos')
  };

  // ==========================================================================
  // 3. CUBIE GEOMETRY BUILDER
  // ==========================================================================
  function buildCubieGeometry(ix, iy, iz) {
    const positions = [], normals = [], uvs = [], matIds = [], indices = [];
    const halfSize = 0.482;
    const bevelRadius = 0.082;
    const inner = halfSize - bevelRadius;
    const gridN = 10;
    let vertOffset = 0;

    function addRoundedFacePatch(uAxis, vAxis, wAxis, wSign) {
      const startIdx = vertOffset;
      for (let j = 0; j <= gridN; j++) {
        const v = (j / gridN) * 2 - 1;
        for (let i = 0; i <= gridN; i++) {
          const u = (i / gridN) * 2 - 1;
          function mapCoord(t) {
            const at = Math.abs(t);
            const flatZone = 0.76;
            if (at <= flatZone) return (t / flatZone) * inner;
            const ang = ((at - flatZone) / (1.0 - flatZone)) * (Math.PI * 0.5);
            return Math.sign(t) * (inner + Math.sin(ang) * bevelRadius);
          }

          const p = [0, 0, 0];
          p[uAxis] = mapCoord(u);
          p[vAxis] = mapCoord(v);

          const dx = Math.max(0, Math.abs(p[0]) - inner);
          const dy = Math.max(0, Math.abs(p[1]) - inner);
          const dz = Math.max(0, Math.abs(p[2]) - inner);
          const r2 = Math.max(0, bevelRadius * bevelRadius - dx * dx - dy * dy - dz * dz);
          p[wAxis] = wSign * (inner + Math.sqrt(r2));

          const cx = Math.min(inner, Math.max(-inner, p[0]));
          const cy = Math.min(inner, Math.max(-inner, p[1]));
          const cz = Math.min(inner, Math.max(-inner, p[2]));
          let nx = p[0] - cx, ny = p[1] - cy, nz = p[2] - cz;
          const len = Math.hypot(nx, ny, nz) || 1;
          positions.push(p[0], p[1], p[2]);
          normals.push(nx / len, ny / len, nz / len);
          uvs.push(i / gridN, j / gridN);
          matIds.push(0.0);
          vertOffset++;
        }
      }

      for (let j = 0; j < gridN; j++) {
        for (let i = 0; i < gridN; i++) {
          const a = startIdx + j * (gridN + 1) + i;
          const b = a + 1;
          const c = a + (gridN + 1);
          const d = c + 1;
          indices.push(a, b, c, b, d, c);
        }
      }
    }

    addRoundedFacePatch(0, 1, 2,  1);
    addRoundedFacePatch(0, 1, 2, -1);
    addRoundedFacePatch(2, 1, 0,  1);
    addRoundedFacePatch(2, 1, 0, -1);
    addRoundedFacePatch(0, 2, 1,  1);
    addRoundedFacePatch(0, 2, 1, -1);

    function addFacePlate(isExterior, faceId, uAxis, vAxis, wAxis, wSign, sCol, sRow, flipU, flipV) {
      const stickerHalf = 0.402;
      const cornerRad = 0.042;
      const lift = halfSize + 0.004;

      const { faceSize, pad, atlasSize } = atlasInfo;
      const fCol = faceId % 3, fRow = Math.floor(faceId / 3);
      const fx = pad + fCol * (faceSize + pad), fy = pad + fRow * (faceSize + pad);
      const subSize = faceSize / 3.0;

      const u0 = (fx + sCol * subSize + 2.0) / atlasSize;
      const u1 = (fx + (sCol + 1) * subSize - 2.0) / atlasSize;
      const v0 = (fy + sRow * subSize + 2.0) / atlasSize;
      const v1 = (fy + (sRow + 1) * subSize - 2.0) / atlasSize;

      const sGrid = 6;
      const startIdx = vertOffset;
      const sInner = stickerHalf - cornerRad;

      for (let j = 0; j <= sGrid; j++) {
        const v = (j / sGrid) * 2 - 1;
        for (let i = 0; i <= sGrid; i++) {
          const u = (i / sGrid) * 2 - 1;
          let px = u * stickerHalf, py = v * stickerHalf;
          const dx = Math.max(0, Math.abs(px) - sInner);
          const dy = Math.max(0, Math.abs(py) - sInner);
          if (dx > 0 && dy > 0) {
            const d = Math.hypot(dx, dy);
            const clamped = Math.min(cornerRad, d);
            px = Math.sign(px) * (sInner + (dx / d) * clamped);
            py = Math.sign(py) * (sInner + (dy / d) * clamped);
          }

          const p = [0, 0, 0];
          p[uAxis] = px; p[vAxis] = py; p[wAxis] = wSign * lift;
          const n = [0, 0, 0];
          n[wAxis] = wSign;

          const normU = (px / stickerHalf) * 0.5 + 0.5;
          const normV = (py / stickerHalf) * 0.5 + 0.5;
          const finalU = flipU ? (1.0 - normU) : normU;
          const finalV = flipV ? normV : (1.0 - normV);

          positions.push(p[0], p[1], p[2]);
          normals.push(n[0], n[1], n[2]);
          if (isExterior) {
            uvs.push(u0 + finalU * (u1 - u0), v0 + finalV * (v1 - v0));
            matIds.push(1.0);
          } else {
            uvs.push(normU, normV);
            matIds.push(2.0);
          }
          vertOffset++;
        }
      }

      for (let j = 0; j < sGrid; j++) {
        for (let i = 0; i < sGrid; i++) {
          const a = startIdx + j * (sGrid + 1) + i;
          const b = a + 1;
          const c = a + (sGrid + 1);
          const d = c + 1;
          indices.push(a, b, c, b, d, c);
        }
      }
    }

    addFacePlate(iz ===  1, 0, 0, 1, 2,  1, ix + 1, 1 - iy, false, false);
    addFacePlate(iz === -1, 1, 0, 1, 2, -1, 1 - ix, 1 - iy, true,  false);
    addFacePlate(ix ===  1, 2, 2, 1, 0,  1, 1 - iz, 1 - iy, true,  false);
    addFacePlate(ix === -1, 3, 2, 1, 0, -1, iz + 1, 1 - iy, false, false);
    addFacePlate(iy ===  1, 4, 0, 2, 1,  1, ix + 1, iz + 1, false, true);
    addFacePlate(iy === -1, 5, 0, 2, 1, -1, ix + 1, 1 - iz, false, false);

    function makeBuf(target, data, usage = gl.STATIC_DRAW) {
      const b = gl.createBuffer();
      gl.bindBuffer(target, b);
      gl.bufferData(target, data, usage);
      return b;
    }

    return {
      posBuf:  makeBuf(gl.ARRAY_BUFFER, new Float32Array(positions)),
      normBuf: makeBuf(gl.ARRAY_BUFFER, new Float32Array(normals)),
      uvBuf:   makeBuf(gl.ARRAY_BUFFER, new Float32Array(uvs)),
      matBuf:  makeBuf(gl.ARRAY_BUFFER, new Float32Array(matIds)),
      idxBuf:  makeBuf(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices)),
      count: indices.length
    };
  }

  // ==========================================================================
  // 4. MATRIX MATH
  // ==========================================================================
  function mat4Identity() {
    return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
  }

  function mat4Multiply(a, b) {
    const out = new Float32Array(16);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        out[j * 4 + i] =
          a[0 * 4 + i] * b[j * 4 + 0] +
          a[1 * 4 + i] * b[j * 4 + 1] +
          a[2 * 4 + i] * b[j * 4 + 2] +
          a[3 * 4 + i] * b[j * 4 + 3];
      }
    }
    return out;
  }

  function mat4FromRotationAxis(axis, angle) {
    const [x, y, z] = axis;
    const c = Math.cos(angle), s = Math.sin(angle), t = 1 - c;
    return new Float32Array([
      t*x*x + c,   t*x*y + s*z, t*x*z - s*y, 0,
      t*x*y - s*z, t*y*y + c,   t*y*z + s*x, 0,
      t*x*z + s*y, t*y*z - s*x, t*z*z + c,   0,
      0,           0,           0,           1
    ]);
  }

  function mat4FromTranslation(tx, ty, tz) {
    return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, tx,ty,tz,1]);
  }

  function mat4Perspective(fovy, aspect, near, far) {
    const f = 1.0 / Math.tan(fovy / 2), nf = 1 / (near - far);
    return new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) * nf, -1,
      0, 0, (2 * far * near) * nf, 0
    ]);
  }

  function mat4LookAt(eye, center, up) {
    const zx = eye[0] - center[0], zy = eye[1] - center[1], zz = eye[2] - center[2];
    let len = Math.hypot(zx, zy, zz);
    const z0 = zx / len, z1 = zy / len, z2 = zz / len;
    const xx = up[1] * z2 - up[2] * z1, xy = up[2] * z0 - up[0] * z2, xz = up[0] * z1 - up[1] * z0;
    len = Math.hypot(xx, xy, xz);
    const x0 = xx / len, x1 = xy / len, x2 = xz / len;
    const y0 = z1 * x2 - z2 * x1, y1 = z2 * x0 - z0 * x2, y2 = z0 * x1 - z1 * x0;
    return new Float32Array([
      x0, y0, z0, 0,
      x1, y1, z1, 0,
      x2, y2, z2, 0,
      -(x0 * eye[0] + x1 * eye[1] + x2 * eye[2]),
      -(y0 * eye[0] + y1 * eye[1] + y2 * eye[2]),
      -(z0 * eye[0] + z1 * eye[1] + z2 * eye[2]),
      1
    ]);
  }

  function mat4Invert(m) {
    const inv = new Float32Array(16);
    inv[0] = m[5]*m[10]*m[15] - m[5]*m[11]*m[14] - m[9]*m[6]*m[15] + m[9]*m[7]*m[14] + m[13]*m[6]*m[11] - m[13]*m[7]*m[10];
    inv[4] = -m[4]*m[10]*m[15] + m[4]*m[11]*m[14] + m[8]*m[6]*m[15] - m[8]*m[7]*m[14] - m[12]*m[6]*m[11] + m[12]*m[7]*m[10];
    inv[8] = m[4]*m[9]*m[15] - m[4]*m[11]*m[13] - m[8]*m[5]*m[15] + m[8]*m[7]*m[13] + m[12]*m[5]*m[11] - m[12]*m[7]*m[9];
    inv[12] = -m[4]*m[9]*m[14] + m[4]*m[10]*m[13] + m[8]*m[5]*m[14] - m[8]*m[6]*m[13] - m[12]*m[5]*m[10] + m[12]*m[6]*m[9];
    inv[1] = -m[1]*m[10]*m[15] + m[1]*m[11]*m[14] + m[9]*m[2]*m[15] - m[9]*m[3]*m[14] - m[13]*m[2]*m[11] + m[13]*m[3]*m[10];
    inv[5] = m[0]*m[10]*m[15] - m[0]*m[11]*m[14] - m[8]*m[2]*m[15] + m[8]*m[3]*m[14] + m[12]*m[2]*m[11] - m[12]*m[3]*m[10];
    inv[9] = -m[0]*m[9]*m[15] + m[0]*m[11]*m[13] + m[8]*m[1]*m[15] - m[8]*m[3]*m[13] - m[12]*m[1]*m[11] + m[12]*m[3]*m[9];
    inv[13] = m[0]*m[9]*m[14] - m[0]*m[10]*m[13] - m[8]*m[1]*m[14] + m[8]*m[2]*m[13] + m[12]*m[1]*m[10] - m[12]*m[2]*m[9];
    inv[2] = m[1]*m[6]*m[15] - m[1]*m[7]*m[14] - m[5]*m[2]*m[15] + m[5]*m[3]*m[14] + m[13]*m[2]*m[7] - m[13]*m[3]*m[6];
    inv[6] = -m[0]*m[6]*m[15] + m[0]*m[7]*m[14] + m[4]*m[2]*m[15] - m[4]*m[3]*m[14] - m[12]*m[2]*m[7] + m[12]*m[3]*m[6];
    inv[10] = m[0]*m[5]*m[15] - m[0]*m[7]*m[13] - m[4]*m[1]*m[15] + m[4]*m[3]*m[13] + m[12]*m[1]*m[7] - m[12]*m[3]*m[5];
    inv[14] = -m[0]*m[5]*m[14] + m[0]*m[6]*m[13] + m[4]*m[1]*m[14] - m[4]*m[2]*m[13] - m[12]*m[1]*m[6] + m[12]*m[2]*m[5];
    inv[3] = -m[1]*m[6]*m[11] + m[1]*m[7]*m[10] + m[5]*m[2]*m[11] - m[5]*m[3]*m[10] - m[9]*m[2]*m[7] + m[9]*m[3]*m[6];
    inv[7] = m[0]*m[6]*m[11] - m[0]*m[7]*m[10] - m[4]*m[2]*m[11] + m[4]*m[3]*m[10] + m[8]*m[2]*m[7] - m[8]*m[3]*m[6];
    inv[11] = -m[0]*m[5]*m[11] + m[0]*m[7]*m[9] + m[4]*m[1]*m[11] - m[4]*m[3]*m[9] - m[8]*m[1]*m[7] + m[8]*m[3]*m[5];
    inv[15] = m[0]*m[5]*m[10] - m[0]*m[6]*m[9] - m[4]*m[1]*m[10] + m[4]*m[2]*m[9] + m[8]*m[1]*m[6] - m[8]*m[2]*m[5];
    let det = m[0]*inv[0] + m[1]*inv[4] + m[2]*inv[8] + m[3]*inv[12];
    if (Math.abs(det) < 1e-8) return mat4Identity();
    det = 1.0 / det;
    for (let i = 0; i < 16; i++) inv[i] *= det;
    return inv;
  }

  function transformVec3(m, v, w = 1.0) {
    return [
      m[0]*v[0] + m[4]*v[1] + m[8]*v[2]  + m[12]*w,
      m[1]*v[0] + m[5]*v[1] + m[9]*v[2]  + m[13]*w,
      m[2]*v[0] + m[6]*v[1] + m[10]*v[2] + m[14]*w
    ];
  }

  function snapRotationMatrix(m) {
    const out = mat4Identity();
    for (let i = 0; i < 12; i++) out[i] = Math.round(m[i]);
    return out;
  }

  // ==========================================================================
  // 5. STATE & AUTO-CHOREOGRAPHY
  // ==========================================================================
  const cubies = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        cubies.push({
          gridPos: [x, y, z],
          rotMat: mat4Identity(),
          mesh: buildCubieGeometry(x, y, z)
        });
      }
    }
  }

  const moveHistory = [];
  const moveQueue = [];
  let activeTwist = null;
  let autoLoopEnabled = true;
  let autoPhase = 'PAUSE_SOLVED';
  let autoTimer = 1.2;
  let explodeAmount = 0.0;
  let targetExplode = 0.0;

  function enqueueTwist(axis, slice, dir, speed = 5.2, record = true) {
    moveQueue.push({
      axis: [...axis],
      slice: Math.round(slice),
      dir: dir >= 0 ? 1 : -1,
      angle: 0,
      targetAngle: Math.PI * 0.5,
      speed,
      record
    });
  }

  function commitTwist(twist) {
    const { axis, slice, dir, record } = twist;
    const axisIdx = axis[0] !== 0 ? 0 : (axis[1] !== 0 ? 1 : 2);
    const stepRot = mat4FromRotationAxis(axis, dir * Math.PI * 0.5);

    for (const c of cubies) {
      if (Math.round(c.gridPos[axisIdx]) === slice) {
        const newPos = transformVec3(stepRot, c.gridPos, 0.0);
        c.gridPos = [Math.round(newPos[0]), Math.round(newPos[1]), Math.round(newPos[2])];
        c.rotMat = snapRotationMatrix(mat4Multiply(stepRot, c.rotMat));
      }
    }

    if (record) {
      const last = moveHistory[moveHistory.length - 1];
      if (last &&
          last.axis[0] === axis[0] &&
          last.axis[1] === axis[1] &&
          last.axis[2] === axis[2] &&
          last.slice === slice &&
          last.dir === -dir) {
        moveHistory.pop();
      } else {
        moveHistory.push({ axis: [...axis], slice, dir });
      }
    }
    spawnBurst(12);
  }

  function triggerSolveRandy(speed = 6.5) {
    moveQueue.length = 0;
    while (moveHistory.length > 0) {
      const m = moveHistory.pop();
      enqueueTwist(m.axis, m.slice, -m.dir, speed, false);
    }
  }

  function triggerScramble(count = 6) {
    const axes = [[1,0,0], [0,1,0], [0,0,1]];
    const slices = [-1, 0, 1];
    const dirs = [-1, 1];
    for (let i = 0; i < count; i++) {
      enqueueTwist(
        axes[Math.floor(Math.random() * 3)],
        slices[Math.floor(Math.random() * 3)],
        dirs[Math.floor(Math.random() * 2)],
        6.8,
        true
      );
    }
  }

  // ==========================================================================
  // 6. INTERACTIVE RAYCASTING & CAMERA ORBIT
  // ==========================================================================
  let worldRotX = 0.48;
  let worldRotY = -0.62;
  let worldRotZ = -0.52;
  let camZoom = 8.5; // Optimal zoom ensuring full cube & exploded core fits safely inside canvas without clipping edges

  let isOrbiting = false;
  let isDraggingSlice = false;
  let pointerStart = [0, 0];
  let hitInfo = null;

  function getWorldMatrix() {
    const rx = mat4FromRotationAxis([1, 0, 0], worldRotX);
    const ry = mat4FromRotationAxis([0, 1, 0], worldRotY);
    const rz = mat4FromRotationAxis([0, 0, 1], worldRotZ);
    return mat4Multiply(rz, mat4Multiply(rx, ry));
  }

  function raycastCube(clientX, clientY) {
    const rect = glCanvas.getBoundingClientRect();
    const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
    const ndcY = 1 - ((clientY - rect.top) / rect.height) * 2;

    const aspect = rect.width / rect.height;
    const proj = mat4Perspective(Math.PI / 4.2, aspect, 0.1, 100.0);
    const view = mat4LookAt([0, 0, camZoom], [0, 0, 0], [0, 1, 0]);
    const world = getWorldMatrix();
    const invVPW = mat4Invert(mat4Multiply(proj, mat4Multiply(view, world)));

    function unproject(nx, ny, nz) {
      const m = invVPW;
      const w = m[3]*nx + m[7]*ny + m[11]*nz + m[15];
      return [
        (m[0]*nx + m[4]*ny + m[8]*nz + m[12]) / w,
        (m[1]*nx + m[5]*ny + m[9]*nz + m[13]) / w,
        (m[2]*nx + m[6]*ny + m[10]*nz + m[14]) / w
      ];
    }

    const pNear = unproject(ndcX, ndcY, -1);
    const pFar  = unproject(ndcX, ndcY,  1);
    const dir = [pFar[0] - pNear[0], pFar[1] - pNear[1], pFar[2] - pNear[2]];
    const len = Math.hypot(dir[0], dir[1], dir[2]);
    dir[0] /= len; dir[1] /= len; dir[2] /= len;

    const bound = 1.48 + explodeAmount * 0.65;
    let tMin = -Infinity, tMax = Infinity;
    let hitAxis = 0, hitSign = 1;

    for (let a = 0; a < 3; a++) {
      const invD = 1.0 / (Math.abs(dir[a]) < 1e-6 ? 1e-6 : dir[a]);
      let t0 = (-bound - pNear[a]) * invD;
      let t1 = ( bound - pNear[a]) * invD;
      let s = -1;
      if (invD < 0) { const tmp = t0; t0 = t1; t1 = tmp; s = 1; }
      if (t0 > tMin) { tMin = t0; hitAxis = a; hitSign = s; }
      if (t1 < tMax) tMax = t1;
      if (tMax < tMin) return null;
    }
    if (tMin < 0) return null;

    const hitPt = [
      pNear[0] + dir[0] * tMin,
      pNear[1] + dir[1] * tMin,
      pNear[2] + dir[2] * tMin
    ];

    const scale = 1.0 + explodeAmount * 0.45;
    const gridCoord = [
      Math.max(-1, Math.min(1, Math.round(hitPt[0] / scale))),
      Math.max(-1, Math.min(1, Math.round(hitPt[1] / scale))),
      Math.max(-1, Math.min(1, Math.round(hitPt[2] / scale)))
    ];

    const normalLocal = [0, 0, 0];
    normalLocal[hitAxis] = hitSign;
    return { hitPt, gridCoord, normalLocal, hitAxis };
  }

  function projectLocalToScreen(ptLocal) {
    const rect = glCanvas.getBoundingClientRect();
    const aspect = rect.width / rect.height;
    const proj = mat4Perspective(Math.PI / 4.2, aspect, 0.1, 100.0);
    const view = mat4LookAt([0, 0, camZoom], [0, 0, 0], [0, 1, 0]);
    const world = getWorldMatrix();
    const mvp = mat4Multiply(proj, mat4Multiply(view, world));

    const x = mvp[0]*ptLocal[0] + mvp[4]*ptLocal[1] + mvp[8]*ptLocal[2] + mvp[12];
    const y = mvp[1]*ptLocal[0] + mvp[5]*ptLocal[1] + mvp[9]*ptLocal[2] + mvp[13];
    const w = mvp[3]*ptLocal[0] + mvp[7]*ptLocal[1] + mvp[11]*ptLocal[2] + mvp[15];

    return [
      ((x / w) * 0.5 + 0.5) * rect.width,
      (0.5 - (y / w) * 0.5) * rect.height
    ];
  }

  let idleTimeout = null;
  function pauseAutoTemporarily() {
    autoLoopEnabled = false;
    if (idleTimeout) clearTimeout(idleTimeout);
    idleTimeout = setTimeout(() => {
      autoLoopEnabled = true;
      autoPhase = moveHistory.length > 0 ? 'SOLVING' : 'SCRAMBLING';
      if (moveHistory.length > 0) triggerSolveRandy(5.8);
    }, 3200);
  }

  glCanvas.addEventListener('dblclick', () => {
    targetExplode = targetExplode > 0.1 ? 0.0 : 0.65;
    spawnBurst(32);
  });

  glCanvas.addEventListener('pointerdown', (e) => {
    pointerStart = [e.clientX, e.clientY];
    pauseAutoTemporarily();
    if (e.button === 2 || e.shiftKey) {
      isOrbiting = true;
      return;
    }
    const hit = raycastCube(e.clientX, e.clientY);
    if (hit && !activeTwist && moveQueue.length === 0) {
      hitInfo = hit;
      isDraggingSlice = true;
    } else {
      isOrbiting = true;
    }
  });

  window.addEventListener('pointermove', (e) => {
    const dx = e.clientX - pointerStart[0];
    const dy = e.clientY - pointerStart[1];

    if (isOrbiting) {
      worldRotY += dx * 0.008;
      worldRotX += dy * 0.008;
      pointerStart = [e.clientX, e.clientY];
      return;
    }

    if (isDraggingSlice && hitInfo && !activeTwist) {
      const dragDist = Math.hypot(dx, dy);
      if (dragDist > 14) {
        const hAxis = hitInfo.hitAxis;
        const tangentAxes = [0, 1, 2].filter(a => a !== hAxis);
        const p0Screen = projectLocalToScreen(hitInfo.hitPt);

        let bestTangent = tangentAxes[0], bestScore = -1, bestSign = 1;
        for (const tAxis of tangentAxes) {
          const testPt = [...hitInfo.hitPt];
          testPt[tAxis] += 0.5;
          const p1Screen = projectLocalToScreen(testPt);
          let vx = p1Screen[0] - p0Screen[0], vy = p1Screen[1] - p0Screen[1];
          const vLen = Math.hypot(vx, vy) || 1;
          vx /= vLen; vy /= vLen;
          const dot = (dx * vx + dy * vy) / dragDist;
          if (Math.abs(dot) > bestScore) {
            bestScore = Math.abs(dot);
            bestTangent = tAxis;
            bestSign = dot >= 0 ? 1 : -1;
          }
        }

        const rotAxisIdx = [0, 1, 2].find(a => a !== hAxis && a !== bestTangent);
        const rotAxis = [0, 0, 0];
        rotAxis[rotAxisIdx] = 1;

        const tVec = [0, 0, 0];
        tVec[bestTangent] = bestSign;
        const nVec = hitInfo.normalLocal;
        const cross = [
          nVec[1]*tVec[2] - nVec[2]*tVec[1],
          nVec[2]*tVec[0] - nVec[0]*tVec[2],
          nVec[0]*tVec[1] - nVec[1]*tVec[0]
        ];
        const rotDir = cross[rotAxisIdx] >= 0 ? 1 : -1;
        const sliceIdx = hitInfo.gridCoord[rotAxisIdx];

        enqueueTwist(rotAxis, sliceIdx, rotDir, 8.2, true);
        isDraggingSlice = false;
        hitInfo = null;
      }
    }
  });

  window.addEventListener('pointerup', () => {
    isOrbiting = false;
    isDraggingSlice = false;
    hitInfo = null;
  });

  glCanvas.addEventListener('contextmenu', e => e.preventDefault());

  // ==========================================================================
  // 7. PARTICLES & MINI HUD CONTROLS
  // ==========================================================================
  const particles = [];
  for (let i = 0; i < 28; i++) {
    particles.push({
      x: Math.random() * 550,
      y: Math.random() * 550,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.4 - 0.1,
      size: Math.random() * 5 + 2,
      color: ['#212121', '#CDEA68', '#1554f0', '#e5ce00'][Math.floor(Math.random() * 4)],
      alpha: Math.random() * 0.5 + 0.2,
      isAmbient: true,
      rot: Math.random() * Math.PI
    });
  }

  function spawnBurst(count = 24) {
    const cx = pCanvas.width * 0.5;
    const cy = pCanvas.height * 0.5;
    const colors = ['#CDEA68', '#1554f0', '#e5ce00', '#ff551a', '#212121'];
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = Math.random() * 5 + 1.5;
      particles.push({
        x: cx, y: cy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        size: Math.random() * 6 + 3,
        color: colors[i % colors.length],
        alpha: 1.0,
        life: 1.0,
        decay: Math.random() * 0.02 + 0.015,
        isAmbient: false,
        rot: Math.random() * Math.PI
      });
    }
  }

  const btnHeroAuto = document.getElementById('btnHeroAuto');
  const btnHeroScramble = document.getElementById('btnHeroScramble');
  const btnHeroSolve = document.getElementById('btnHeroSolve');
  const btnHeroExplode = document.getElementById('btnHeroExplode');

  if (btnHeroAuto) {
    btnHeroAuto.addEventListener('click', () => {
      autoLoopEnabled = !autoLoopEnabled;
      btnHeroAuto.classList.toggle('active', autoLoopEnabled);
    });
  }
  if (btnHeroScramble) {
    btnHeroScramble.addEventListener('click', () => {
      triggerScramble(7);
    });
  }
  if (btnHeroSolve) {
    btnHeroSolve.addEventListener('click', () => {
      triggerSolveRandy(7.0);
      spawnBurst(36);
    });
  }
  if (btnHeroExplode) {
    btnHeroExplode.addEventListener('click', () => {
      targetExplode = targetExplode > 0.1 ? 0.0 : 0.65;
      btnHeroExplode.classList.toggle('active', targetExplode > 0.1);
      spawnBurst(30);
    });
  }

  // ==========================================================================
  // 8. RESIZE & ANIMATION LOOP
  // ==========================================================================
  function resizeCanvas() {
    const rect = glCanvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(300, rect.width || 600);
    const h = Math.max(300, rect.height || 600);
    glCanvas.width = Math.round(w * dpr);
    glCanvas.height = Math.round(h * dpr);
    gl.viewport(0, 0, glCanvas.width, glCanvas.height);
    pCanvas.width = Math.round(w);
    pCanvas.height = Math.round(h);
  }

  window.addEventListener('resize', resizeCanvas);
  setTimeout(resizeCanvas, 50);

  let lastTime = performance.now();

  function animate(now) {
    requestAnimationFrame(animate);
    const dt = Math.min(0.05, (now - lastTime) * 0.001);
    lastTime = now;

    explodeAmount += (targetExplode - explodeAmount) * Math.min(1, dt * 8);

    if (autoLoopEnabled && !isOrbiting && !isDraggingSlice) {
      worldRotY += dt * 0.38;
      worldRotX = 0.46 + Math.sin(now * 0.001) * 0.24;
      worldRotZ = -0.44 + Math.cos(now * 0.0008) * 0.18;
    }

    if (!activeTwist && moveQueue.length > 0) {
      activeTwist = moveQueue.shift();
    }

    if (activeTwist) {
      activeTwist.angle += dt * activeTwist.speed;
      if (activeTwist.angle >= activeTwist.targetAngle) {
        commitTwist(activeTwist);
        activeTwist = null;
      }
    }

    // Auto-Choreography Loop
    if (autoLoopEnabled && !activeTwist && moveQueue.length === 0 && !isDraggingSlice) {
      autoTimer += dt;
      if (autoPhase === 'SCRAMBLING') {
        if (moveHistory.length < 5) {
          if (autoTimer > 0.14) {
            autoTimer = 0;
            const axes = [[1,0,0], [0,1,0], [0,0,1]];
            const slices = [-1, 0, 1];
            const dirs = [-1, 1];
            enqueueTwist(
              axes[Math.floor(Math.random() * 3)],
              slices[Math.floor(Math.random() * 3)],
              dirs[Math.floor(Math.random() * 2)],
              4.6,
              true
            );
          }
        } else {
          autoPhase = 'PAUSE_SCRAMBLED';
          autoTimer = 0;
        }
      } else if (autoPhase === 'PAUSE_SCRAMBLED') {
        if (autoTimer > 0.8) {
          autoTimer = 0;
          autoPhase = 'SOLVING';
          triggerSolveRandy(5.4);
        }
      } else if (autoPhase === 'SOLVING') {
        if (moveHistory.length === 0) {
          autoPhase = 'PAUSE_SOLVED';
          autoTimer = 0;
          spawnBurst(32);
        }
      } else if (autoPhase === 'PAUSE_SOLVED') {
        if (autoTimer > 2.4) {
          autoTimer = 0;
          autoPhase = 'SCRAMBLING';
        }
      }
    }

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);

    const aspect = glCanvas.width / glCanvas.height;
    const proj = mat4Perspective(Math.PI / 4.2, aspect, 0.1, 100.0);
    const camPos = [0, 0, camZoom];
    const view = mat4LookAt(camPos, [0, 0, 0], [0, 1, 0]);
    const world = getWorldMatrix();

    gl.useProgram(prog);
    gl.uniformMatrix4fv(loc.uProjection, false, proj);
    gl.uniformMatrix4fv(loc.uView, false, view);
    gl.uniformMatrix4fv(loc.uWorld, false, world);
    gl.uniform3fv(loc.uCameraPos, camPos);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, atlasInfo.tex);
    gl.uniform1i(loc.uAtlas, 0);

    for (const c of cubies) {
      const spacing = 1.0 + explodeAmount * 0.55;
      const transMat = mat4FromTranslation(
        c.gridPos[0] * spacing,
        c.gridPos[1] * spacing,
        c.gridPos[2] * spacing
      );
      let cubieMat = mat4Multiply(transMat, c.rotMat);

      if (activeTwist) {
        const axisIdx = activeTwist.axis[0] !== 0 ? 0 : (activeTwist.axis[1] !== 0 ? 1 : 2);
        if (Math.round(c.gridPos[axisIdx]) === activeTwist.slice) {
          const t = Math.min(1.0, activeTwist.angle / activeTwist.targetAngle);
          const easedT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          const twistRot = mat4FromRotationAxis(
            activeTwist.axis,
            activeTwist.dir * easedT * activeTwist.targetAngle
          );
          cubieMat = mat4Multiply(twistRot, cubieMat);
        }
      }

      gl.uniformMatrix4fv(loc.uCubieMatrix, false, cubieMat);

      const m = c.mesh;
      gl.bindBuffer(gl.ARRAY_BUFFER, m.posBuf);
      gl.enableVertexAttribArray(loc.aPosition);
      gl.vertexAttribPointer(loc.aPosition, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, m.normBuf);
      gl.enableVertexAttribArray(loc.aNormal);
      gl.vertexAttribPointer(loc.aNormal, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, m.uvBuf);
      gl.enableVertexAttribArray(loc.aUV);
      gl.vertexAttribPointer(loc.aUV, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, m.matBuf);
      gl.enableVertexAttribArray(loc.aMaterialId);
      gl.vertexAttribPointer(loc.aMaterialId, 1, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, m.idxBuf);
      gl.drawElements(gl.TRIANGLES, m.count, gl.UNSIGNED_SHORT, 0);
    }

    // Render Particles
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.rot += 0.03;
      if (p.isAmbient) {
        if (p.y < -10) p.y = pCanvas.height + 10;
        if (p.x < -10) p.x = pCanvas.width + 10;
        if (p.x > pCanvas.width + 10) p.x = -10;
      } else {
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.life -= p.decay;
        p.alpha = Math.max(0, p.life);
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
      }
      pCtx.save();
      pCtx.globalAlpha = p.alpha;
      pCtx.translate(p.x, p.y);
      pCtx.rotate(p.rot);
      pCtx.fillStyle = p.color;
      pCtx.fillRect(-p.size * 0.5, -p.size * 0.5, p.size, p.size);
      pCtx.restore();
    }
  }

  requestAnimationFrame(animate);
});
