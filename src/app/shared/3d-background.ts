import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-3d-background',
  standalone: true,
  template: `
    <div class="background-3d">
      <div class="video-background">
        <div class="animated-bg"></div>
      </div>
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
        <div class="shape shape-5"></div>
        <div class="shape shape-6"></div>
      </div>
      <div class="gradient-overlay"></div>
    </div>
  `,
  styles: [`
    .background-3d {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      overflow: hidden;
      background: linear-gradient(135deg, 
        #667eea 0%, 
        #764ba2 25%, 
        #f093fb 50%, 
        #f5576c 75%, 
        #4facfe 100%);
      opacity: 0.12;
      animation: backgroundShift 20s ease-in-out infinite;
    }

    .video-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -2;
    }

    .animated-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: 
        radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%),
        linear-gradient(135deg, rgba(74, 144, 226, 0.1) 0%, rgba(143, 88, 188, 0.1) 100%);
      animation: videoEffect 25s ease-in-out infinite;
    }

    @keyframes videoEffect {
      0%, 100% {
        transform: scale(1) rotate(0deg);
        filter: hue-rotate(0deg);
      }
      25% {
        transform: scale(1.05) rotate(1deg);
        filter: hue-rotate(90deg);
      }
      50% {
        transform: scale(0.95) rotate(-1deg);
        filter: hue-rotate(180deg);
      }
      75% {
        transform: scale(1.02) rotate(0.5deg);
        filter: hue-rotate(270deg);
      }
    }

    @keyframes backgroundShift {
      0%, 100% { 
        background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
      }
      33% { 
        background: linear-gradient(135deg, #4facfe 0%, #667eea 25%, #764ba2 50%, #f093fb 75%, #f5576c 100%);
      }
      66% { 
        background: linear-gradient(135deg, #f5576c 0%, #4facfe 25%, #667eea 50%, #764ba2 75%, #f093fb 100%);
      }
    }

    .floating-shapes {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .shape {
      position: absolute;
      border-radius: 50%;
      background: linear-gradient(135deg, 
        rgba(102, 126, 234, 0.1), 
        rgba(118, 75, 162, 0.1), 
        rgba(240, 147, 251, 0.1));
      animation: float 20s infinite linear;
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
      backdrop-filter: blur(10px);
    }

    .shape-1 {
      width: 80px;
      height: 80px;
      top: 20%;
      left: 10%;
      animation-delay: 0s;
      animation-duration: 25s;
    }

    .shape-2 {
      width: 120px;
      height: 120px;
      top: 60%;
      left: 80%;
      animation-delay: -5s;
      animation-duration: 30s;
    }

    .shape-3 {
      width: 60px;
      height: 60px;
      top: 80%;
      left: 20%;
      animation-delay: -10s;
      animation-duration: 20s;
    }

    .shape-4 {
      width: 100px;
      height: 100px;
      top: 10%;
      left: 70%;
      animation-delay: -15s;
      animation-duration: 35s;
    }

    .shape-5 {
      width: 40px;
      height: 40px;
      top: 40%;
      left: 50%;
      animation-delay: -20s;
      animation-duration: 15s;
    }

    .shape-6 {
      width: 90px;
      height: 90px;
      top: 70%;
      left: 60%;
      animation-delay: -25s;
      animation-duration: 28s;
    }

    @keyframes float {
      0% {
        transform: translateY(0px) rotate(0deg) scale(1);
        opacity: 0.7;
      }
      25% {
        transform: translateY(-20px) rotate(90deg) scale(1.1);
        opacity: 0.9;
      }
      50% {
        transform: translateY(-40px) rotate(180deg) scale(0.9);
        opacity: 0.6;
      }
      75% {
        transform: translateY(-20px) rotate(270deg) scale(1.05);
        opacity: 0.8;
      }
      100% {
        transform: translateY(0px) rotate(360deg) scale(1);
        opacity: 0.7;
      }
    }

    .gradient-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: 
        radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.4) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.4) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(240, 147, 251, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 60% 60%, rgba(245, 87, 108, 0.3) 0%, transparent 50%);
      animation: pulse 12s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 0.8;
      }
      50% {
        opacity: 0.4;
      }
    }
  `],
  imports: [CommonModule]
})
export class Background3D implements OnInit, OnDestroy {
  
  ngOnInit() {
    // Add any initialization logic
  }

  ngOnDestroy() {
    // Cleanup if needed
  }
}