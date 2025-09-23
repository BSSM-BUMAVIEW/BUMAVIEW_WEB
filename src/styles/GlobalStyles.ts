import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    line-height: 1.5;
  }

  body {
    font-family: var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #ffffff;
    color: #1e293b;
  }

  /* Chess-themed animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideInDown {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes chessHover {
    0%, 100% {
      transform: scale(1) rotate(0deg);
    }
    50% {
      transform: scale(1.1) rotate(5deg);
    }
  }

  @keyframes typewriter {
    from {
      width: 0;
    }
    to {
      width: 100%;
    }
  }

  @keyframes blink {
    0%, 50% {
      opacity: 1;
    }
    51%, 100% {
      opacity: 0;
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes glow {
    from {
      box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
    }
    to {
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
    }
  }

  /* Interactive effects */
  .interactive-scale {
    transition: transform 0.2s ease-in-out;
  }

  .interactive-scale:hover {
    transform: scale(1.05);
  }

  .interactive-glow {
    transition: box-shadow 0.3s ease-in-out;
  }

  .interactive-glow:hover {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
  }

  /* Animation classes */
  .animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }

  .animate-slide-in-down {
    animation: slideInDown 0.5s ease-out;
  }

  .animate-slide-in-left {
    animation: slideInLeft 0.5s ease-out;
  }

  .animate-slide-in-right {
    animation: slideInRight 0.5s ease-out;
  }

  .animate-slide-in-up {
    animation: slideInUp 0.5s ease-out;
  }

  .animate-float {
    animation: float 3s ease-in-out infinite;
  }

  .animate-chess-hover {
    animation: chessHover 0.3s ease-in-out;
  }

  .animate-typewriter {
    animation: typewriter 2s steps(40, end);
  }

  .animate-blink {
    animation: blink 1s infinite;
  }

  .animate-scale-in {
    animation: scaleIn 0.3s ease-out;
  }

  .animate-glow {
    animation: glow 2s ease-in-out infinite alternate;
  }

  /* Chess board pattern */
  .chess-pattern {
    background-image: 
      linear-gradient(45deg, transparent 25%, rgba(59, 130, 246, 0.05) 25%, rgba(59, 130, 246, 0.05) 50%, transparent 50%, transparent 75%, rgba(59, 130, 246, 0.05) 75%);
    background-size: 60px 60px;
  }

  /* Responsive utilities */
  @media (max-width: 768px) {
    .container {
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }
`;
