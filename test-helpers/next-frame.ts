// Helper function that returns a promise on next animation tick
const nextFrame = () => new Promise(r => window.requestAnimationFrame(r));

export default nextFrame;