<template>
  <div class="canvas-container">
    <canvas ref="canvas"></canvas>
    <button class="undo-btn" @click="undoLastStroke">
      <img src="@/assets/icons/rotate.svg" alt="" width="30" height="30" />
    </button>
    <button class="reset-btn" @click="cleanBoard">
      <img src="@/assets/icons/reset.svg" alt="" width="30" height="30" />
    </button>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";

export default {
  name: "InfiniteCanvas",
  setup() {
    const canvas = ref(null);
    let context = null;

    // History arrays (following your example)
    let strokeHistory = []; // Each element is an object: { vectors: [...], colour: string }
    let actionHistory = []; // Stores the stroke vectors (an array) in drawing order

    // Current stroke in progress
    let currentStroke = [];

    // Drawing state and settings
    let drawing = false;
    let penColour = "#000"; // Change as desired

    // Track last drawing coordinates
    let lastX = 0;
    let lastY = 0;

    // Redraw the entire canvas using strokeHistory
    const redrawCanvas = () => {
      if (!canvas.value) return;
      // Set canvas dimensions (adjusts to container)
      canvas.value.width = canvas.value.clientWidth;
      canvas.value.height = canvas.value.clientHeight;
      // Clear the canvas to transparent (no background fill)
      context.clearRect(0, 0, canvas.value.width, canvas.value.height);
      // Draw every stroke stored in history
      strokeHistory.forEach(strokeObj => {
        drawStroke(strokeObj);
      });
    };

    // Draw a stroke given its vector data and colour
    const drawStroke = ({ vectors, colour }) => {
      if (!vectors || vectors.length === 0) return;
      context.beginPath();
      context.moveTo(vectors[0].x, vectors[0].y);
      for (let i = 1; i < vectors.length; i++) {
        context.lineTo(vectors[i].x, vectors[i].y);
      }
      context.strokeStyle = colour;
      context.lineWidth = 2;
      context.stroke();
    };

    // --- Mouse Event Handlers ---

    const onMouseDown = e => {
      drawing = true;
      const rect = canvas.value.getBoundingClientRect();
      lastX = e.clientX - rect.left;
      lastY = e.clientY - rect.top;
      // Begin a new stroke
      currentStroke = [{ x: lastX, y: lastY }];
    };

    const onMouseMove = e => {
      if (!drawing) return;
      const rect = canvas.value.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      // Draw the segment immediately
      context.beginPath();
      context.moveTo(lastX, lastY);
      context.lineTo(currentX, currentY);
      context.strokeStyle = penColour;
      context.lineWidth = 2;
      context.stroke();
      // Save point to current stroke and update last coordinates
      currentStroke.push({ x: currentX, y: currentY });
      lastX = currentX;
      lastY = currentY;
    };

    const onMouseUp = () => {
      if (drawing) {
        // Finalize stroke: add to both histories
        strokeHistory.push({ vectors: currentStroke.slice(), colour: penColour });
        actionHistory.push(currentStroke.slice());
        drawing = false;
        currentStroke = [];
      }
    };

    // --- Touch Event Handlers ---

    const onTouchStart = e => {
      e.preventDefault();
      if (e.touches.length === 1) {
        drawing = true;
        const rect = canvas.value.getBoundingClientRect();
        const touch = e.touches[0];
        lastX = touch.clientX - rect.left;
        lastY = touch.clientY - rect.top;
        currentStroke = [{ x: lastX, y: lastY }];
      }
    };

    const onTouchMove = e => {
      e.preventDefault();
      if (!drawing || e.touches.length !== 1) return;
      const rect = canvas.value.getBoundingClientRect();
      const touch = e.touches[0];
      const currentX = touch.clientX - rect.left;
      const currentY = touch.clientY - rect.top;
      // Draw the segment
      context.beginPath();
      context.moveTo(lastX, lastY);
      context.lineTo(currentX, currentY);
      context.strokeStyle = penColour;
      context.lineWidth = 2;
      context.stroke();
      // Save point and update last coordinates
      currentStroke.push({ x: currentX, y: currentY });
      lastX = currentX;
      lastY = currentY;
    };

    // Finalize the touch stroke (as in your example)
    const onTouchEnd = e => {
      e.preventDefault();
      if (drawing) {
        // Optionally, you might emit the stroke here if using sockets
        strokeHistory.push({ vectors: currentStroke.slice(), colour: penColour });
        actionHistory.push(currentStroke.slice());
        currentStroke = [];
        redrawCanvas();
      }
      drawing = false;
    };

    // --- Reset Functionality ---

    const cleanBoard = () => {
      strokeHistory = [];
      actionHistory = [];
      redrawCanvas();
    };

    // --- Undo (Back Button) Functionality ---

    const undoLastStroke = () => {
      if (actionHistory.length === 0) return;
      const toUndo = actionHistory.pop();
      removeFromHistory(toUndo);
      // Optionally, emit a deletion event (e.g., via socket)
    };

    // Remove a stroke from strokeHistory by comparing vector arrays
    const removeFromHistory = stroke => {
      for (let i = strokeHistory.length - 1; i >= 0; i--) {
        const historyElement = strokeHistory[i];
        if (strokesEqual(historyElement.vectors, stroke)) {
          strokeHistory.splice(i, 1);
          redrawCanvas();
          return;
        }
      }
    };

    // Compare two strokes (arrays of vectors) for equality
    const strokesEqual = (strokeAVectors, strokeBVectors) => {
      if (strokeAVectors.length !== strokeBVectors.length) return false;
      for (let i = 0; i < strokeAVectors.length; i++) {
        if (!vectorsEqual(strokeAVectors[i], strokeBVectors[i])) return false;
      }
      return true;
    };

    // Compare two individual vectors
    const vectorsEqual = (vectorA, vectorB) => {
      return vectorA.x === vectorB.x && vectorA.y === vectorB.y;
    };

    // --- Lifecycle Hooks: Attach & Remove Event Listeners ---

    onMounted(() => {
      if (canvas.value) {
        context = canvas.value.getContext("2d");
        redrawCanvas();
        window.addEventListener("resize", redrawCanvas);

        // Attach mouse events
        canvas.value.addEventListener("mousedown", onMouseDown);
        canvas.value.addEventListener("mousemove", onMouseMove);
        canvas.value.addEventListener("mouseup", onMouseUp);
        canvas.value.addEventListener("mouseout", onMouseUp);

        // Attach touch events (passive: false to allow preventDefault)
        canvas.value.addEventListener("touchstart", onTouchStart, { passive: false });
        canvas.value.addEventListener("touchmove", onTouchMove, { passive: false });
        canvas.value.addEventListener("touchend", onTouchEnd, { passive: false });
        canvas.value.addEventListener("touchcancel", onTouchEnd, { passive: false });
      }
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", redrawCanvas);
      if (canvas.value) {
        canvas.value.removeEventListener("mousedown", onMouseDown);
        canvas.value.removeEventListener("mousemove", onMouseMove);
        canvas.value.removeEventListener("mouseup", onMouseUp);
        canvas.value.removeEventListener("mouseout", onMouseUp);
        canvas.value.removeEventListener("touchstart", onTouchStart);
        canvas.value.removeEventListener("touchmove", onTouchMove);
        canvas.value.removeEventListener("touchend", onTouchEnd);
        canvas.value.removeEventListener("touchcancel", onTouchEnd);
      }
    });

    return {
      canvas,
      undoLastStroke,
      cleanBoard,
    };
  },
};
</script>

<style scoped>
.canvas-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
  background: transparent; /* Transparent background */
}

.undo-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: auto;
  padding: 8px;
  cursor: pointer;
  background-color: #8419ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  img {
    display: block;
  }
}

.reset-btn {
  position: absolute;
  bottom: 20px;
  right: 90px;
  width: auto;
  padding: 8px;
  cursor: pointer;
  background-color: #8419ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  img {
    display: block;
  }
}
</style>
