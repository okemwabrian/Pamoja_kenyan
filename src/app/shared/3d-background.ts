import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-3d-background',
  standalone: true,
  template: `
    <div class="background-3d">
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
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%);
      opacity: 0.3;
    }

    .floating-shapes {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .shape {
      position: absolute;
      border-radius: 50%;
      background: rgba(102, 126, 234, 0.05);
      animation: float 20s infinite linear;
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
      background: radial-gradient(circle at 30% 70%, rgba(102, 126, 234, 0.3) 0%, transparent 50%),
                  radial-gradient(circle at 70% 30%, rgba(118, 75, 162, 0.3) 0%, transparent 50%);
      animation: pulse 8s ease-in-out infinite;
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