import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { usePuterStore } from "~/lib/puter";
import { useNavigate, useLocation } from "react-router";
import ProperNavbar from "~/components/ProperNavbar";
import AuthGuard from "~/components/AuthGuard";

function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}

interface Particle {
  x: number;
  y: number;
  baseColor: string;
  targetOpacity: number;
  currentOpacity: number;
  opacitySpeed: number;
  baseRadius: number;
  currentRadius: number;
  layer: number;
  vx: number;
  vy: number;
  originalX: number;
  originalY: number;
  returnSpeed: number;
  trail?: boolean;
  trailLength?: number;
  age?: number;
  maxAge?: number;
}

interface TrailParticle {
  x: number;
  y: number;
  color: string;
  opacity: number;
  radius: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

interface WaveEffect {
  x: number;
  y: number;
  radius: number;
  strength: number;
  maxRadius: number;
  active: boolean;
}

interface ParticleCanvasProps {
  className?: string;
}

const ParticleCanvas: React.FC<ParticleCanvasProps> = ({ className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const dotsRef = useRef<Particle[]>([]);
  const trailParticlesRef = useRef<TrailParticle[]>([]);
  const waveEffectsRef = useRef<WaveEffect[]>([]);
  const gridRef = useRef<Record<string, number[]>>({});
  const canvasSizeRef = useRef<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const mousePositionRef = useRef<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  });
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Enhanced configuration for more noticeable effects
  const DOT_SPACING = 40;
  const BASE_OPACITY_MIN = 0.2;
  const BASE_OPACITY_MAX = 0.4;
  const BASE_RADIUS = 2;
  const INTERACTION_RADIUS = 200; // Increased interaction radius
  const INTERACTION_RADIUS_SQ = INTERACTION_RADIUS * INTERACTION_RADIUS;
  const OPACITY_BOOST = 1.2; // Increased opacity boost
  const RADIUS_BOOST = 6; // Increased radius boost
  const GRID_CELL_SIZE = Math.max(60, Math.floor(INTERACTION_RADIUS / 1.5));
  const TRAIL_COUNT = 8; // Number of trail particles per mouse movement
  const WAVE_COUNT = 3; // Number of wave effects

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      mousePositionRef.current = { x: null, y: null };
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const canvasX = event.clientX - rect.left;
    const canvasY = event.clientY - rect.top;

    // Create trail particles for mouse movement
    if (lastMousePosRef.current.x !== 0 && lastMousePosRef.current.y !== 0) {
      const dx = canvasX - lastMousePosRef.current.x;
      const dy = canvasY - lastMousePosRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 2) {
        for (let i = 0; i < TRAIL_COUNT; i++) {
          const offsetX = (Math.random() - 0.5) * 20;
          const offsetY = (Math.random() - 0.5) * 20;
          trailParticlesRef.current.push({
            x: canvasX + offsetX,
            y: canvasY + offsetY,
            color: `rgba(${139 + Math.random() * 40}, ${92 + Math.random() * 40}, ${246 + Math.random() * 20}, 1)`,
            opacity: 0.8,
            radius: Math.random() * 2 + 1,
            vx: (dx / distance) * (Math.random() * 2 + 1),
            vy: (dy / distance) * (Math.random() * 2 + 1),
            life: 1.0,
            maxLife: Math.random() * 30 + 20,
          });
        }
      }
    }

    lastMousePosRef.current = { x: canvasX, y: canvasY };
    mousePositionRef.current = { x: canvasX, y: canvasY };
  }, []);

  const handleMouseClick = useCallback((event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const canvasX = event.clientX - rect.left;
    const canvasY = event.clientY - rect.top;

    // Create explosion effect on click
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 2;
      trailParticlesRef.current.push({
        x: canvasX,
        y: canvasY,
        color: `rgba(${139 + Math.random() * 60}, ${92 + Math.random() * 60}, ${246 + Math.random() * 40}, 1)`,
        opacity: 1,
        radius: Math.random() * 3 + 1,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        maxLife: Math.random() * 80 + 60,
      });
    }

    // Create wave effect on click
    waveEffectsRef.current.push({
      x: canvasX,
      y: canvasY,
      radius: 0,
      strength: 1.0,
      maxRadius: 300,
      active: true,
    });
  }, []);

  const createDots = useCallback(() => {
    const { width, height } = canvasSizeRef.current;
    if (width === 0 || height === 0) return;

    const newDots: Particle[] = [];
    const newGrid: Record<string, number[]> = {};
    const cols = Math.ceil(width / DOT_SPACING);
    const rows = Math.ceil(height / DOT_SPACING);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * DOT_SPACING + DOT_SPACING / 2;
        const y = j * DOT_SPACING + DOT_SPACING / 2;
        const cellX = Math.floor(x / GRID_CELL_SIZE);
        const cellY = Math.floor(y / GRID_CELL_SIZE);
        const cellKey = `${cellX}_${cellY}`;

        if (!newGrid[cellKey]) {
          newGrid[cellKey] = [];
        }

        const dotIndex = newDots.length;
        newGrid[cellKey].push(dotIndex);

        const baseOpacity =
          Math.random() * (BASE_OPACITY_MAX - BASE_OPACITY_MIN) +
          BASE_OPACITY_MIN;
        const layer = Math.random() < 0.3 ? 1 : 0; // 30% chance for layer 1 (secondary layer)

        newDots.push({
          x,
          y,
          baseColor:
            layer === 0
              ? `rgba(139, 92, 246, ${BASE_OPACITY_MAX})` // Purple
              : `rgba(59, 130, 246, ${BASE_OPACITY_MAX})`, // Blue
          targetOpacity: baseOpacity,
          currentOpacity: baseOpacity,
          opacitySpeed: Math.random() * 0.008 + 0.003, // Faster breathing
          baseRadius: layer === 0 ? BASE_RADIUS : BASE_RADIUS * 0.8,
          currentRadius: layer === 0 ? BASE_RADIUS : BASE_RADIUS * 0.8,
          layer,
          vx: (Math.random() - 0.5) * 0.2, // Slight movement
          vy: (Math.random() - 0.5) * 0.2,
          originalX: x,
          originalY: y,
          returnSpeed: Math.random() * 0.2 + 0.1, // Gentle return speed
        });
      }
    }
    dotsRef.current = newDots;
    gridRef.current = newGrid;
  }, [
    DOT_SPACING,
    GRID_CELL_SIZE,
    BASE_OPACITY_MIN,
    BASE_OPACITY_MAX,
    BASE_RADIUS,
  ]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;
    const width = container ? container.clientWidth : window.innerWidth;
    const height = container ? container.clientHeight : window.innerHeight;

    if (
      canvas.width !== width ||
      canvas.height !== height ||
      canvasSizeRef.current.width !== width ||
      canvasSizeRef.current.height !== height
    ) {
      canvas.width = width;
      canvas.height = height;
      canvasSizeRef.current = { width, height };
      createDots();
    }
  }, [createDots]);

  const animateDots = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const dots = dotsRef.current;
    const grid = gridRef.current;
    const trailParticles = trailParticlesRef.current;
    const waveEffects = waveEffectsRef.current;
    const { width, height } = canvasSizeRef.current;
    const { x: mouseX, y: mouseY } = mousePositionRef.current;

    if (!ctx || !dots || !grid || width === 0 || height === 0) {
      animationFrameId.current = requestAnimationFrame(animateDots);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    // Update and draw trail particles
    for (let i = trailParticles.length - 1; i >= 0; i--) {
      const particle = trailParticles[i];
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= 1 / particle.maxLife;
      particle.opacity = particle.life;
      particle.radius *= 0.95;

      if (particle.life <= 0) {
        trailParticles.splice(i, 1);
      } else {
        ctx.beginPath();
        ctx.fillStyle = particle.color.replace(
          "1)",
          particle.opacity.toFixed(2) + ")",
        );
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Update and draw wave effects
    for (let i = waveEffects.length - 1; i >= 0; i--) {
      const wave = waveEffects[i];
      wave.radius += 3;
      wave.strength *= 0.95;

      if (wave.radius > wave.maxRadius || wave.strength < 0.1) {
        waveEffects.splice(i, 1);
      } else {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(139, 92, 246, ${wave.strength.toFixed(2)})`;
        ctx.lineWidth = wave.strength * 2;
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Mouse interaction logic
    const activeDotIndices = new Set<number>();
    if (mouseX !== null && mouseY !== null) {
      const mouseCellX = Math.floor(mouseX / GRID_CELL_SIZE);
      const mouseCellY = Math.floor(mouseY / GRID_CELL_SIZE);
      const searchRadius = Math.ceil(INTERACTION_RADIUS / GRID_CELL_SIZE);
      for (let i = -searchRadius; i <= searchRadius; i++) {
        for (let j = -searchRadius; j <= searchRadius; j++) {
          const checkCellX = mouseCellX + i;
          const checkCellY = mouseCellY + j;
          const cellKey = `${checkCellX}_${checkCellY}`;
          if (grid[cellKey]) {
            grid[cellKey].forEach((dotIndex) => activeDotIndices.add(dotIndex));
          }
        }
      }
    }

    // Draw particles with enhanced interactions
    dots.forEach((dot, index) => {
      // Update breathing animation
      dot.currentOpacity += dot.opacitySpeed;
      if (
        dot.currentOpacity >= dot.targetOpacity ||
        dot.currentOpacity <= BASE_OPACITY_MIN
      ) {
        dot.opacitySpeed = -dot.opacitySpeed;
        dot.currentOpacity = Math.max(
          BASE_OPACITY_MIN,
          Math.min(dot.currentOpacity, BASE_OPACITY_MAX),
        );
        dot.targetOpacity =
          Math.random() * (BASE_OPACITY_MAX - BASE_OPACITY_MIN) +
          BASE_OPACITY_MIN;
      }

      // Update slight movement
      dot.x += dot.vx;
      dot.y += dot.vy;

      // Bounce off edges
      if (dot.x < 0 || dot.x > width) dot.vx *= -1;
      if (dot.y < 0 || dot.y > height) dot.vy *= -1;

      let interactionFactor = 0;
      let colorShift = 0;
      dot.currentRadius = dot.baseRadius;

      if (mouseX !== null && mouseY !== null && activeDotIndices.has(index)) {
        const dx = dot.x - mouseX;
        const dy = dot.y - mouseY;
        const distSq = dx * dx + dy * dy;

        if (distSq < INTERACTION_RADIUS_SQ) {
          const distance = Math.sqrt(distSq);
          interactionFactor = Math.max(0, 1 - distance / INTERACTION_RADIUS);
          interactionFactor =
            interactionFactor * interactionFactor * interactionFactor; // Cubic curve for more dramatic effect

          // Enhanced radius boost
          dot.currentRadius = dot.baseRadius + interactionFactor * RADIUS_BOOST;

          // Color shift based on proximity - shift towards purple
          colorShift = interactionFactor * 0.8; // Increased intensity for more noticeable purple shift

          // Particle movement away from cursor
          const angle = Math.atan2(dy, dx);
          const force = interactionFactor * 0.5;
          dot.vx += Math.cos(angle) * force;
          dot.vy += Math.sin(angle) * force;
        }
      }

      // Return to original position when mouse is not interacting
      if (mouseX === null || mouseY === null || !activeDotIndices.has(index)) {
        const dx = dot.originalX - dot.x;
        const dy = dot.originalY - dot.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Apply gentle return force if particle is significantly displaced
        if (distance > 5) {
          const returnForce = Math.min(distance * 0.02, dot.returnSpeed);
          dot.vx += (dx / distance) * returnForce;
          dot.vy += (dy / distance) * returnForce;
        }
      }

      // Damping for smooth movement
      dot.vx *= 0.95;
      dot.vy *= 0.95;

      const finalOpacity = Math.min(
        1,
        dot.currentOpacity + interactionFactor * OPACITY_BOOST,
      );

      ctx.beginPath();
      const baseColor = dot.baseColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (baseColor) {
        const r = parseInt(baseColor[1]);
        const g = parseInt(baseColor[2]);
        const b = parseInt(baseColor[3]);
        // Shift towards purple (139, 92, 246) when interacting
        const targetR = 139;
        const targetG = 92;
        const targetB = 246;
        const finalR = Math.round(r + (targetR - r) * colorShift);
        const finalG = Math.round(g + (targetG - g) * colorShift);
        const finalB = Math.round(b + (targetB - b) * colorShift);
        ctx.fillStyle = `rgba(${finalR}, ${finalG}, ${finalB}, ${finalOpacity.toFixed(3)})`;
      } else {
        ctx.fillStyle = `rgba(139, 92, 246, ${finalOpacity.toFixed(3)})`;
      }
      ctx.arc(dot.x, dot.y, dot.currentRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    animationFrameId.current = requestAnimationFrame(animateDots);
  }, [
    GRID_CELL_SIZE,
    INTERACTION_RADIUS,
    INTERACTION_RADIUS_SQ,
    OPACITY_BOOST,
    RADIUS_BOOST,
    BASE_OPACITY_MIN,
    BASE_OPACITY_MAX,
  ]);

  useEffect(() => {
    handleResize();
    const handleMouseLeave = () => {
      mousePositionRef.current = { x: null, y: null };
      // Create explosion effect on mouse leave
      const canvas = canvasRef.current;
      if (canvas && lastMousePosRef.current.x !== 0) {
        for (let i = 0; i < 20; i++) {
          trailParticlesRef.current.push({
            x: lastMousePosRef.current.x,
            y: lastMousePosRef.current.y,
            color: `rgba(${139 + Math.random() * 40}, ${92 + Math.random() * 40}, ${246 + Math.random() * 20}, 1)`,
            opacity: 1,
            radius: Math.random() * 3 + 1,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5,
            life: 1.0,
            maxLife: Math.random() * 60 + 40,
          });
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseClick);
    window.addEventListener("resize", handleResize);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);

    animationFrameId.current = requestAnimationFrame(animateDots);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseClick);
      document.documentElement.removeEventListener(
        "mouseleave",
        handleMouseLeave,
      );
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [handleResize, handleMouseMove, animateDots]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 z-0 pointer-events-none", className)}
    />
  );
};

interface TypingTextProps {
  text: string;
  className?: string;
}

const TypingText: React.FC<TypingTextProps> = ({ text, className = "" }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 80);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <span className={className}>
      {displayedText}
      {currentIndex < text.length && <span className="animate-pulse">|</span>}
    </span>
  );
};

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const GlowButton: React.FC<GlowButtonProps> = ({
  children,
  className = "",
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className={cn(
        "relative px-8 py-4 rounded-lg text-lg font-semibold text-white cursor-pointer",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 rounded-lg" />
      <div
        className={cn(
          "absolute inset-0.5 bg-gray-900 rounded-md transition-opacity duration-500",
          isHovered ? "opacity-70" : "opacity-100",
        )}
      />
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 rounded-lg blur-xl transition-opacity duration-500",
          isHovered ? "opacity-100" : "opacity-0",
        )}
      />
      <span className="relative z-10">{children}</span>
    </button>
  );
};

const HeroLandingPage: React.FC = () => {
  const { auth } = usePuterStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleGetStarted = () => {
    if (auth.isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/auth?next=/dashboard");
    }
  };

  const handleDashboardClick = () => {
    if (auth.isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/auth?next=/dashboard");
    }
  };

  const handleUploadClick = () => {
    if (auth.isAuthenticated) {
      navigate("/upload");
    } else {
      navigate("/auth?next=/upload");
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthGuard requireAuth={false}>
      <div className="w-full h-screen flex items-center justify-center overflow-hidden relative bg-gradient-to-b from-white via-blue-50/80 to-indigo-50/60">
        {/* Enhanced background with radial gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/80 to-indigo-50/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-violet-200/30 via-indigo-200/20 to-blue-200/30 rounded-full blur-3xl scale-150" />
        <ParticleCanvas />

        {/* Enhanced navbar for hero page */}
        <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              {/* Logo */}
              <div className="flex items-center">
                <button
                  onClick={() => navigate("/hero")}
                  className="flex-shrink-0"
                >
                  <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    RESUMIND
                  </span>
                </button>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:ml-6 md:flex md:items-center md:space-x-8">
                <button
                  onClick={handleDashboardClick}
                  className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleUploadClick}
                  className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200"
                >
                  Upload
                </button>
                {auth.isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200"
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/auth")}
                    className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200"
                  >
                    Login
                  </button>
                )}
              </div>

              {/* Username display on right */}
              {auth.isAuthenticated && (
                <div className="hidden md:flex items-center">
                  <span className="text-sm text-gray-500">
                    {auth.user
                      ? (auth.user as any).email ||
                        (auth.user as any).name ||
                        "User"
                      : "User"}
                  </span>
                </div>
              )}

              {/* Mobile menu button */}
              <div className="flex items-center md:hidden">
                <button
                  onClick={() => {
                    const mobileMenu = document.getElementById("mobile-menu");
                    if (mobileMenu) {
                      mobileMenu.classList.toggle("hidden");
                    }
                  }}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div id="mobile-menu" className="hidden md:hidden">
            <div className="pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
              <button
                onClick={handleDashboardClick}
                className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
              >
                Dashboard
              </button>
              <button
                onClick={handleUploadClick}
                className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
              >
                Upload
              </button>
              {auth.isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => navigate("/auth")}
                  className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </nav>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6"
            style={{
              filter:
                "drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))",
            }}
          >
            <TypingText text="Smart Feedback For Your Dream Job" />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto"
          >
            Get personalized insights and improve your chances of landing your
            dream position
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 2 }}
          >
            <GlowButton onClick={handleGetStarted}>Get Started</GlowButton>
          </motion.div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default HeroLandingPage;
