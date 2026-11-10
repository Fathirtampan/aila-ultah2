const introScreen = document.querySelector("#intro-screen");
const cakeScreen = document.querySelector("#cake-screen");
const photoSequence = document.querySelector("#photo-sequence");
const sequenceSlides = document.querySelectorAll("[data-sequence-slide]");
const celebrationScreen = document.querySelector("#celebration-screen");
const openButton = document.querySelector("#open-button");
const miniCountdownTime = document.querySelector("#mini-countdown-time");
const cakeCandles = document.querySelectorAll("[data-candle]");
const micButton = document.querySelector("#mic-button");
const micStatus = document.querySelector("#mic-status");
const starLayer = document.querySelector("#star-layer");
const confettiLayer = document.querySelector("#confetti-layer");
const cakeMomentGlow = document.querySelector("#cake-moment-glow");
const softFlash = document.querySelector("#soft-flash");
const toast = document.querySelector("#toast");
const introCard = document.querySelector("#intro-card");
const heroCard = document.querySelector("#hero-card");
const heroBadge = document.querySelector("#hero-badge");
const badgeCore = document.querySelector("#badge-core");
const musicPanel = document.querySelector("#music-panel");
const musicToggle = document.querySelector("#music-toggle");
const trackStatus = document.querySelector("#track-status");
const trackProgressFill = document.querySelector("#track-progress-fill");
const birthdayAudio = document.querySelector("#birthday-audio");
const photoOpenButtons = document.querySelectorAll("[data-photo-open]");
const photoLightbox = document.querySelector("#photo-lightbox");
const photoLightboxImage = document.querySelector("#photo-lightbox-image");
const photoLightboxClose = document.querySelector("#photo-lightbox-close");
const lyricsCopy = document.querySelector("#lyrics-copy");
const lyricLines = document.querySelectorAll(".lyric-line");
const lyricSpotlight = document.querySelector("#lyric-spotlight");
const secretNote = document.querySelector("#secret-note");
const glowLeft = document.querySelector(".glow-left");
const glowRight = document.querySelector(".glow-right");
const magneticButtons = document.querySelectorAll(".button");
const heroTitle = document.querySelector(".hero-card h2");
const mainMessage = document.querySelector("#main-message");
const closingLine = document.querySelector("#closing-line");
const revealItems = document.querySelectorAll(".reveal");
const memoryPortrait = document.querySelector(".memory-portrait");

let toastTimer;
let countdownTimer;
let blownCandles = 0;
let audioContext;
let analyser;
let microphoneStream;
let micSource;
let micDataArray;
let micListening = false;
let micCooldown = false;
let micFrameId;
let typingTimer;
let secretTapCount = 0;
let secretTapTimer;
let secretNoteTimer;
let lastLyricIndex = -1;
let volumeFadeFrame = null;
let sequenceStepTimer;
let sequenceFinishTimer;
let sequenceStageTimer;
const prefersTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
const flowTimings = {
  introToast: 260,
  cakeToSequence: 940,
  sequenceStageIn: 380,
  sequenceSecondSlide: 1980,
  sequenceFinish: 4380,
  revealStep: 120,
  photoReveal: 240,
  closingLine: 1360,
  audioFadeIn: 1250,
  typingSpeed: 22
};

const lyricCuePoints = [
  { time: 0.8, index: 0 },
  { time: 4.0, index: 1 },
  { time: 7.0, index: 2 },
  { time: 10.4, index: 3 },
  { time: 14.0, index: 4 },
  { time: 29.8, index: 5 },
  { time: 33.4, index: 6 },
  { time: 36.6, index: 7 },
  { time: 40.8, index: 8 },
  { time: 45.4, index: 9 },
  { time: 49.0, index: 10 },
  { time: 52.0, index: 11 }
];

const lyricSpotlightThemes = [
  {
    y: "12%",
    shift: "-8px",
    glow: "radial-gradient(circle at 48% 16%, rgba(255, 208, 168, 0.2), rgba(255, 208, 168, 0.05) 28%, rgba(255, 208, 168, 0) 56%), radial-gradient(circle at 72% 16%, rgba(168, 199, 255, 0.12), rgba(168, 199, 255, 0) 38%)"
  },
  {
    y: "31%",
    shift: "0px",
    glow: "radial-gradient(circle at 52% 34%, rgba(245, 179, 203, 0.24), rgba(245, 179, 203, 0.05) 30%, rgba(245, 179, 203, 0) 58%), radial-gradient(circle at 24% 24%, rgba(255, 208, 168, 0.1), rgba(255, 208, 168, 0) 36%)"
  },
  {
    y: "49%",
    shift: "8px",
    glow: "radial-gradient(circle at 48% 52%, rgba(255, 148, 148, 0.18), rgba(255, 148, 148, 0.05) 30%, rgba(255, 148, 148, 0) 58%), radial-gradient(circle at 78% 42%, rgba(168, 199, 255, 0.08), rgba(168, 199, 255, 0) 34%)"
  },
  {
    y: "69%",
    shift: "16px",
    glow: "radial-gradient(circle at 50% 72%, rgba(168, 199, 255, 0.22), rgba(168, 199, 255, 0.05) 30%, rgba(168, 199, 255, 0) 56%), radial-gradient(circle at 24% 62%, rgba(245, 179, 203, 0.08), rgba(245, 179, 203, 0) 34%)"
  },
  {
    y: "86%",
    shift: "22px",
    glow: "radial-gradient(circle at 50% 88%, rgba(255, 208, 168, 0.24), rgba(255, 208, 168, 0.06) 30%, rgba(255, 208, 168, 0) 56%), radial-gradient(circle at 74% 74%, rgba(245, 179, 203, 0.1), rgba(245, 179, 203, 0) 34%)"
  },
  {
    y: "18%",
    shift: "-6px",
    glow: "radial-gradient(circle at 44% 20%, rgba(168, 199, 255, 0.22), rgba(168, 199, 255, 0.05) 30%, rgba(168, 199, 255, 0) 56%), radial-gradient(circle at 78% 18%, rgba(255, 208, 168, 0.08), rgba(255, 208, 168, 0) 34%)"
  },
  {
    y: "31%",
    shift: "2px",
    glow: "radial-gradient(circle at 48% 34%, rgba(245, 179, 203, 0.2), rgba(245, 179, 203, 0.05) 30%, rgba(245, 179, 203, 0) 56%), radial-gradient(circle at 22% 28%, rgba(168, 199, 255, 0.08), rgba(168, 199, 255, 0) 34%)"
  },
  {
    y: "45%",
    shift: "8px",
    glow: "radial-gradient(circle at 52% 48%, rgba(255, 208, 168, 0.22), rgba(255, 208, 168, 0.05) 30%, rgba(255, 208, 168, 0) 56%), radial-gradient(circle at 74% 42%, rgba(168, 199, 255, 0.08), rgba(168, 199, 255, 0) 34%)"
  },
  {
    y: "58%",
    shift: "12px",
    glow: "radial-gradient(circle at 56% 60%, rgba(255, 148, 148, 0.16), rgba(255, 148, 148, 0.04) 30%, rgba(255, 148, 148, 0) 56%), radial-gradient(circle at 24% 56%, rgba(245, 179, 203, 0.08), rgba(245, 179, 203, 0) 34%)"
  },
  {
    y: "72%",
    shift: "18px",
    glow: "radial-gradient(circle at 50% 74%, rgba(168, 199, 255, 0.22), rgba(168, 199, 255, 0.05) 30%, rgba(168, 199, 255, 0) 56%), radial-gradient(circle at 76% 66%, rgba(255, 208, 168, 0.08), rgba(255, 208, 168, 0) 34%)"
  },
  {
    y: "84%",
    shift: "22px",
    glow: "radial-gradient(circle at 48% 86%, rgba(245, 179, 203, 0.24), rgba(245, 179, 203, 0.05) 30%, rgba(245, 179, 203, 0) 56%), radial-gradient(circle at 28% 78%, rgba(255, 208, 168, 0.08), rgba(255, 208, 168, 0) 34%)"
  },
  {
    y: "92%",
    shift: "26px",
    glow: "radial-gradient(circle at 50% 92%, rgba(255, 208, 168, 0.26), rgba(255, 208, 168, 0.06) 30%, rgba(255, 208, 168, 0) 56%), radial-gradient(circle at 72% 84%, rgba(168, 199, 255, 0.08), rgba(168, 199, 255, 0) 34%)"
  }
];

const birthdayMessage = "Mabar epep yukkk";
const photoSources = {
  main: {
    src: "aila-main.jpeg",
    alt: "Foto aila"
  },
  alt: {
    src: "aila-alt.jpeg",
    alt: "Foto kedua Aila"
  }
};

const birthdayTarget = new Date(2026, 3, 1, 0, 0, 0, 0);

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function updateMiniCountdown() {
  if (!miniCountdownTime) {
    return;
  }

  const now = new Date();
  const difference = birthdayTarget.getTime() - now.getTime();

  if (difference <= 0) {
    miniCountdownTime.textContent = "hari ini sudah datang";
    return;
  }

  const totalSeconds = Math.floor(difference / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  miniCountdownTime.textContent = `${String(days).padStart(2, "0")} hari · ${String(hours).padStart(2, "0")} jam · ${String(minutes).padStart(2, "0")} menit · ${String(seconds).padStart(2, "0")} detik`;
}

function createStars(total = 22) {
  starLayer.innerHTML = "";

  for (let index = 0; index < total; index += 1) {
    const star = document.createElement("span");
    star.className = "floating-star";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${-10 - Math.random() * 90}px`;
    star.style.width = `${6 + Math.random() * 8}px`;
    star.style.height = star.style.width;
    star.style.opacity = `${0.35 + Math.random() * 0.45}`;
    star.style.animationDuration = `${8 + Math.random() * 6}s`;
    star.style.animationDelay = `${Math.random() * 4}s`;
    star.style.setProperty("--star-drift", `${Math.random() * 100 - 50}px`);
    starLayer.appendChild(star);
  }
}

function triggerSoftFlash() {
  if (!softFlash) {
    return;
  }

  softFlash.classList.add("is-active");
  window.setTimeout(() => {
    softFlash.classList.remove("is-active");
  }, 340);
}

function triggerCakeGlow() {
  if (!cakeMomentGlow) {
    return;
  }

  cakeMomentGlow.classList.add("is-active");
  window.setTimeout(() => {
    cakeMomentGlow.classList.remove("is-active");
  }, 620);
}

function clearSequenceTimer() {
  if (sequenceStepTimer) {
    window.clearTimeout(sequenceStepTimer);
    sequenceStepTimer = null;
  }

  if (sequenceFinishTimer) {
    window.clearTimeout(sequenceFinishTimer);
    sequenceFinishTimer = null;
  }

  if (sequenceStageTimer) {
    window.clearTimeout(sequenceStageTimer);
    sequenceStageTimer = null;
  }
}

function playPhotoSequence() {
  if (!photoSequence || !sequenceSlides.length) {
    revealCelebration();
    return;
  }

  clearSequenceTimer();
  cakeScreen?.classList.add("is-exiting");
  triggerSoftFlash();

  sequenceStageTimer = window.setTimeout(() => {
    cakeScreen?.classList.add("hidden");
    cakeScreen?.classList.remove("is-exiting");
    photoSequence.classList.remove("hidden");
    photoSequence.classList.remove("is-entering");
    void photoSequence.offsetWidth;
    photoSequence.classList.add("is-entering");

    sequenceSlides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === 0);
    });

    sequenceStepTimer = window.setTimeout(() => {
      sequenceSlides.forEach((slide, index) => {
        slide.classList.toggle("is-active", index === 1);
      });
    }, flowTimings.sequenceSecondSlide);

    sequenceFinishTimer = window.setTimeout(() => {
      photoSequence.classList.remove("is-entering");
      photoSequence.classList.add("hidden");
      revealCelebration();
    }, flowTimings.sequenceFinish);
  }, flowTimings.sequenceStageIn);
}

function bindTap(element, handler) {
  if (!element) {
    return;
  }

  let tapped = false;

  element.addEventListener("click", handler);
  element.addEventListener("touchend", (event) => {
    event.preventDefault();

    if (tapped) {
      return;
    }

    tapped = true;
    handler(event);
    window.setTimeout(() => {
      tapped = false;
    }, 320);
  }, { passive: false });
}

function launchConfetti(total = 26) {
  const colors = ["#ffd29c", "#ffb7d7", "#9fd5ff", "#fff3d8"];

  for (let index = 0; index < total; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[index % colors.length];
    piece.style.setProperty("--drift", `${Math.random() * 220 - 110}px`);
    confettiLayer.appendChild(piece);

    window.setTimeout(() => {
      piece.remove();
    }, 1600);
  }
}

function openCelebration() {
  introScreen.classList.add("hidden");
  cakeScreen?.classList.remove("hidden");
  playBirthdayAudio();
  fadeAudioVolume(0.58, 900);
  window.setTimeout(() => {
    showToast("Klik lilinnya buat tiup.");
  }, flowTimings.introToast);
}

function revealCelebration() {
  clearSequenceTimer();
  cakeScreen?.classList.add("hidden");
  cakeScreen?.classList.remove("is-exiting");
  photoSequence?.classList.add("hidden");
  photoSequence?.classList.remove("is-entering");
  celebrationScreen.classList.remove("hidden");
  memoryPortrait?.classList.remove("is-revealed");
  memoryPortrait?.classList.remove("is-floating");
  closingLine?.classList.remove("is-visible");

  revealItems.forEach((item, index) => {
    window.setTimeout(() => {
      item.classList.add("is-visible");
    }, index * flowTimings.revealStep);
  });

  window.setTimeout(() => {
    memoryPortrait?.classList.add("is-revealed");
    memoryPortrait?.classList.add("is-floating");
  }, flowTimings.photoReveal);
  window.setTimeout(() => {
    closingLine?.classList.add("is-visible");
  }, flowTimings.closingLine);

  startTypingMessage();
  playBirthdayAudio();
  fadeAudioVolume(0.92, flowTimings.audioFadeIn);
  launchConfetti(28);
  showToast("Selamat ulang tahun, Aila.");
}

function replayCelebration() {
  clearSequenceTimer();
  launchConfetti(24);
  createStars(26);
  startTypingMessage();
  if (birthdayAudio?.paused) {
    playBirthdayAudio();
  }
  showToast("Semoga harimu seru terus.");
}

function updateTrackStatus(text) {
  if (trackStatus) {
    trackStatus.textContent = text;
  }
}

function updateTrackProgress() {
  if (!birthdayAudio || !trackProgressFill) {
    return;
  }

  const duration = birthdayAudio.duration;

  if (!duration || Number.isNaN(duration)) {
    trackProgressFill.style.width = "0%";
    return;
  }

  const progress = Math.min((birthdayAudio.currentTime / duration) * 100, 100);
  trackProgressFill.style.width = `${progress}%`;
}

function fadeAudioVolume(targetVolume, duration = 900) {
  if (!birthdayAudio) {
    return;
  }

  if (volumeFadeFrame) {
    window.cancelAnimationFrame(volumeFadeFrame);
    volumeFadeFrame = null;
  }

  const startVolume = birthdayAudio.volume;
  const startTime = performance.now();

  const tick = (now) => {
    const elapsed = now - startTime;
    const ratio = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - ratio, 3);
    birthdayAudio.volume = startVolume + ((targetVolume - startVolume) * eased);

    if (ratio < 1) {
      volumeFadeFrame = window.requestAnimationFrame(tick);
      return;
    }

    volumeFadeFrame = null;
  };

  volumeFadeFrame = window.requestAnimationFrame(tick);
}

function openPhotoLightbox(photoKey) {
  const photo = photoSources[photoKey];

  if (!photo || !photoLightbox || !photoLightboxImage) {
    return;
  }

  photoLightboxImage.src = photo.src;
  photoLightboxImage.alt = photo.alt;
  photoLightbox.classList.remove("hidden");
  window.requestAnimationFrame(() => {
    photoLightbox.classList.add("is-open");
  });
  photoLightbox.setAttribute("aria-hidden", "false");
  photoLightboxClose?.focus();
}

function closePhotoLightbox() {
  if (!photoLightbox || !photoLightboxImage) {
    return;
  }

  photoLightbox.classList.remove("is-open");
  photoLightbox.classList.add("hidden");
  photoLightbox.setAttribute("aria-hidden", "true");
  photoLightboxImage.src = "";
  photoLightboxImage.alt = "";
}

function resetLyrics() {
  lastLyricIndex = -1;

  lyricLines.forEach((line) => {
    line.classList.remove("is-active", "is-past");
  });

  if (lyricsCopy) {
    lyricsCopy.scrollTop = 0;
  }

  if (lyricSpotlight) {
    lyricSpotlight.style.setProperty("--spot-y", "12%");
    lyricSpotlight.style.setProperty("--spot-shift", "0px");
    lyricSpotlight.style.background = lyricSpotlightThemes[0].glow;
    lyricSpotlight.style.opacity = "0.18";
  }
}

function updateLyricSpotlight(activeIndex) {
  if (!lyricSpotlight) {
    return;
  }

  const theme = lyricSpotlightThemes[activeIndex] || lyricSpotlightThemes[0];
  lyricSpotlight.style.setProperty("--spot-y", theme.y);
  lyricSpotlight.style.setProperty("--spot-shift", theme.shift);
  lyricSpotlight.style.background = theme.glow;
  lyricSpotlight.style.opacity = activeIndex >= 0 ? "0.4" : "0.18";
}

function showSecretNote() {
  if (!secretNote) {
    return;
  }

  secretNote.classList.add("is-visible");
  window.clearTimeout(secretNoteTimer);
  secretNoteTimer = window.setTimeout(() => {
    secretNote.classList.remove("is-visible");
  }, 3600);
}

function syncLyricsToAudio() {
  if (!birthdayAudio || !lyricLines.length) {
    return;
  }

  const currentTime = birthdayAudio.currentTime;
  let activeIndex = 0;

  lyricCuePoints.forEach((cuePoint) => {
    if (currentTime >= cuePoint.time - 0.15) {
      activeIndex = cuePoint.index;
    }
  });

  lyricLines.forEach((line, index) => {
    line.classList.toggle("is-active", index === activeIndex);
    line.classList.toggle("is-past", activeIndex > index);
  });

  if (activeIndex !== lastLyricIndex) {
    lyricLines[activeIndex]?.scrollIntoView({
      block: "center",
      behavior: "smooth"
    });
    lastLyricIndex = activeIndex;
  }

  updateLyricSpotlight(activeIndex);
}

async function playBirthdayAudio() {
  if (!birthdayAudio) {
    return;
  }

  try {
    if (birthdayAudio.currentTime === 0) {
      birthdayAudio.volume = celebrationScreen.classList.contains("hidden") ? 0.62 : 0.82;
    }
    await birthdayAudio.play();
    if (musicToggle) {
      musicToggle.textContent = "Pause Lagu";
    }
    musicPanel?.classList.add("is-playing");
    updateTrackStatus("Sedang diputar untuk nemenin halaman ini");
    updateTrackProgress();
  } catch {
    updateTrackStatus("Lagu belum bisa diputar, coba tekan tombol putar lagi");
  }
}

function pauseBirthdayAudio() {
  if (!birthdayAudio) {
    return;
  }

  birthdayAudio.pause();
  musicPanel?.classList.remove("is-playing");
  if (musicToggle) {
    musicToggle.textContent = "Putar Lagu";
  }
  updateTrackStatus("Lagu dijeda");
}

function restartBirthdayAudio() {
  if (!birthdayAudio) {
    return;
  }

  birthdayAudio.currentTime = 0;
  playBirthdayAudio();
}

async function toggleBirthdayAudio() {
  if (!birthdayAudio) {
    return;
  }

  if (birthdayAudio.paused) {
    await playBirthdayAudio();
    return;
  }

  pauseBirthdayAudio();
}

function blowCandle(candle) {
  if (!candle || candle.classList.contains("is-blown")) {
    return;
  }

  candle.classList.add("is-blown");
  blownCandles += 1;
  launchConfetti(10);

  if (blownCandles < cakeCandles.length) {
    showToast(`Lilin padam ${blownCandles}/${cakeCandles.length}`);
    return;
  }

  stopMicListening();
  showToast("Semua lilin sudah padam.");
  triggerCakeGlow();
  triggerSoftFlash();
  window.setTimeout(() => {
    playPhotoSequence();
  }, flowTimings.cakeToSequence);
}

function updateMicStatus(text, isLive = false) {
  if (!micStatus) {
    return;
  }

  micStatus.textContent = text;
  micStatus.classList.toggle("is-live", isLive);
}

function stopMicListening() {
  micListening = false;

  if (micFrameId) {
    window.cancelAnimationFrame(micFrameId);
    micFrameId = null;
  }

  if (microphoneStream) {
    microphoneStream.getTracks().forEach((track) => track.stop());
    microphoneStream = null;
  }

  if (audioContext) {
    audioContext.close().catch(() => {});
    audioContext = null;
  }

  analyser = null;
  micSource = null;
  micDataArray = null;

  if (micButton) {
    micButton.disabled = false;
    micButton.textContent = "Tiup Dengan Mic";
  }

  if (blownCandles < cakeCandles.length) {
    updateMicStatus("Mic belum aktif");
  } else {
    updateMicStatus("Semua lilin padam");
  }
}

function monitorMicInput() {
  if (!analyser || !micDataArray || !micListening) {
    return;
  }

  analyser.getByteFrequencyData(micDataArray);
  let peak = 0;

  for (let index = 0; index < micDataArray.length; index += 1) {
    if (micDataArray[index] > peak) {
      peak = micDataArray[index];
    }
  }

  if (peak > 150 && !micCooldown) {
    micCooldown = true;
    const nextCandle = [...cakeCandles].find((candle) => !candle.classList.contains("is-blown"));

    if (nextCandle) {
      blowCandle(nextCandle);
      updateMicStatus("Hembusan terdeteksi", true);
    }

    window.setTimeout(() => {
      micCooldown = false;
      if (micListening && blownCandles < cakeCandles.length) {
        updateMicStatus("Tiup lagi untuk matikan lilinnya", true);
      }
    }, 900);
  }

  if (blownCandles >= cakeCandles.length) {
    stopMicListening();
    return;
  }

  micFrameId = window.requestAnimationFrame(monitorMicInput);
}

async function startMicListening() {
  if (micListening || blownCandles >= cakeCandles.length) {
    return;
  }

  try {
    if (micButton) {
      micButton.disabled = true;
      micButton.textContent = "Mengaktifkan Mic...";
    }

    microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new window.AudioContext();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    micDataArray = new Uint8Array(analyser.frequencyBinCount);
    micSource = audioContext.createMediaStreamSource(microphoneStream);
    micSource.connect(analyser);

    micListening = true;
    if (micButton) {
      micButton.disabled = false;
      micButton.textContent = "Mic Aktif";
    }
    updateMicStatus("Tiup ke microphone untuk matikan lilin", true);
    monitorMicInput();
  } catch {
    if (micButton) {
      micButton.disabled = false;
      micButton.textContent = "Tiup Dengan Mic";
    }
    updateMicStatus("Izin mic ditolak atau tidak tersedia");
    showToast("Mic belum bisa dipakai.");
  }
}

function burstFromBadge(total = 18) {
  launchConfetti(total);

  if (!badgeCore) {
    return;
  }

  badgeCore.classList.remove("is-pulsing");
  window.requestAnimationFrame(() => {
    badgeCore.classList.add("is-pulsing");
  });

  window.setTimeout(() => {
    badgeCore.classList.remove("is-pulsing");
  }, 700);
}

function applyInteractiveMotion(event) {
  if (prefersTouch) {
    return;
  }

  const xRatio = event.clientX / window.innerWidth;
  const yRatio = event.clientY / window.innerHeight;
  const offsetX = (xRatio - 0.5) * 18;
  const offsetY = (yRatio - 0.5) * 18;

  document.body.style.setProperty("--mouse-x", `${xRatio * 100}%`);
  document.body.style.setProperty("--mouse-y", `${yRatio * 100}%`);

  if (glowLeft) {
    glowLeft.style.transform = `translate(${offsetX * -0.8}px, ${offsetY * -0.8}px)`;
  }

  if (glowRight) {
    glowRight.style.transform = `translate(${offsetX * 0.8}px, ${offsetY * 0.8}px)`;
  }

  if (!celebrationScreen.classList.contains("hidden") && heroCard) {
    heroCard.classList.add("is-interactive");
    heroCard.style.transform = `perspective(1200px) rotateX(${offsetY * -0.35}deg) rotateY(${offsetX * 0.35}deg)`;
  } else if (introCard) {
    introCard.classList.add("is-interactive");
    introCard.style.transform = `perspective(1200px) rotateX(${offsetY * -0.28}deg) rotateY(${offsetX * 0.28}deg)`;
  }

  if (heroBadge) {
    heroBadge.style.transform = `translate(${offsetX * 0.6}px, ${offsetY * 0.6}px)`;
  }

  if (badgeCore) {
    badgeCore.style.transform = `translate(calc(-50% + ${offsetX * 0.35}px), calc(-50% + ${offsetY * 0.35}px))`;
  }

  if (heroTitle && !celebrationScreen.classList.contains("hidden")) {
    heroTitle.style.letterSpacing = `${-0.04 + offsetX * 0.0025}em`;
  }

  if (memoryPortrait && !celebrationScreen.classList.contains("hidden")) {
    memoryPortrait.style.transform = `rotateX(${offsetY * -0.16}deg) rotateY(${offsetX * 0.18}deg) translate3d(${offsetX * 0.35}px, ${offsetY * 0.35}px, 0)`;
  }

  const activeButtons = [openButton];

  activeButtons.filter(Boolean).forEach((button) => {
    const rect = button.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    const distance = Math.hypot(dx, dy);

    if (distance < 140) {
      button.classList.add("is-magnetic");
      button.style.transform = `translate(${dx * 0.08}px, ${dy * 0.08}px)`;
    } else {
      button.classList.remove("is-magnetic");
      button.style.transform = "";
    }
  });
}

function resetInteractiveMotion() {
  if (prefersTouch) {
    return;
  }

  if (introCard) {
    introCard.style.transform = "";
    introCard.classList.remove("is-interactive");
  }

  if (heroCard) {
    heroCard.style.transform = "";
    heroCard.classList.remove("is-interactive");
  }

  if (heroBadge) {
    heroBadge.style.transform = "";
  }

  if (badgeCore) {
    badgeCore.style.transform = "";
    badgeCore.classList.remove("is-pulsing");
  }

  if (glowLeft) {
    glowLeft.style.transform = "";
  }

  if (glowRight) {
    glowRight.style.transform = "";
  }

  if (heroTitle) {
    heroTitle.style.letterSpacing = "";
  }

  if (memoryPortrait) {
    memoryPortrait.style.transform = "";
  }

  magneticButtons.forEach((button) => {
    button.style.transform = "";
    button.classList.remove("is-magnetic");
  });
}

function startTypingMessage() {
  if (!mainMessage) {
    return;
  }

  window.clearTimeout(typingTimer);
  mainMessage.textContent = "";
  mainMessage.classList.add("is-typing");

  let index = 0;

  function typeNext() {
    mainMessage.textContent = birthdayMessage.slice(0, index);
    index += 1;

    if (index <= birthdayMessage.length) {
      typingTimer = window.setTimeout(typeNext, flowTimings.typingSpeed);
      return;
    }

    mainMessage.classList.remove("is-typing");
  }

  typeNext();
}

createStars();
updateMiniCountdown();
countdownTimer = window.setInterval(updateMiniCountdown, 1000);

bindTap(openButton, openCelebration);
bindTap(micButton, startMicListening);
bindTap(musicToggle, toggleBirthdayAudio);
cakeCandles.forEach((candle) => {
  bindTap(candle, () => blowCandle(candle));
  candle.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      blowCandle(candle);
    }
  });
});
heroBadge?.addEventListener("click", () => burstFromBadge(20));
heroBadge?.addEventListener("click", () => {
  secretTapCount += 1;
  window.clearTimeout(secretTapTimer);
  secretTapTimer = window.setTimeout(() => {
    secretTapCount = 0;
  }, 1500);

  if (secretTapCount >= 4) {
    showSecretNote();
    secretTapCount = 0;
  }
});
heroBadge?.addEventListener("mouseenter", () => {
  if (badgeCore) {
    badgeCore.style.boxShadow = "0 18px 42px rgba(255, 183, 215, 0.32)";
  }
  musicPanel?.classList.add("is-halo");
});
heroBadge?.addEventListener("mouseleave", () => {
  if (badgeCore) {
    badgeCore.style.boxShadow = "";
  }
  musicPanel?.classList.remove("is-halo");
});
bindTap(photoLightboxClose, closePhotoLightbox);
photoOpenButtons.forEach((button) => {
  bindTap(button, () => {
    openPhotoLightbox(button.dataset.photoOpen);
  });
});
photoLightbox?.addEventListener("click", (event) => {
  if (event.target === photoLightbox) {
    closePhotoLightbox();
  }
});
birthdayAudio?.addEventListener("ended", () => {
  if (musicToggle) {
    musicToggle.textContent = "Putar Ulang Lagu";
  }
  musicPanel?.classList.remove("is-playing");
  updateTrackProgress();
  resetLyrics();
  updateTrackStatus("Lagu selesai diputar");
});
birthdayAudio?.addEventListener("play", syncLyricsToAudio);
birthdayAudio?.addEventListener("timeupdate", updateTrackProgress);
birthdayAudio?.addEventListener("timeupdate", syncLyricsToAudio);
birthdayAudio?.addEventListener("seeking", syncLyricsToAudio);
birthdayAudio?.addEventListener("loadedmetadata", updateTrackProgress);
birthdayAudio?.addEventListener("loadedmetadata", resetLyrics);
resetLyrics();
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && photoLightbox && !photoLightbox.classList.contains("hidden")) {
    closePhotoLightbox();
  }
});
window.addEventListener("pointermove", applyInteractiveMotion);
window.addEventListener("pointerleave", resetInteractiveMotion);
